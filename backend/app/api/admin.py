"""Admin authentication and dashboard routes."""
from __future__ import annotations

import logging
import time
from collections import defaultdict
from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.models import AdminUser, Enquiry, Product, SiteSettings
from app.schemas.schemas import (
    AdminUserCreate,
    AdminUserResponse,
    DashboardStats,
    SiteSettingResponse,
    SiteSettingUpdate,
    Token,
)
from app.security.auth import create_access_token, get_current_admin, hash_password, verify_password

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin"])

# Simple in-memory rate-limiter for login attempts
_login_attempts: Dict[str, list] = defaultdict(list)


def _check_rate_limit(ip: str) -> None:
    now = time.time()
    window = settings.LOGIN_LOCKOUT_SECONDS
    attempts = [t for t in _login_attempts[ip] if now - t < window]
    _login_attempts[ip] = attempts
    if len(attempts) >= settings.LOGIN_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many login attempts. Please try again in {window // 60} minutes.",
        )


@router.post("/login", response_model=Token)
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(client_ip)
    _login_attempts[client_ip].append(time.time())

    user = (
        db.query(AdminUser)
        .filter(
            (AdminUser.username == form_data.username) | (AdminUser.email == form_data.username)
        )
        .first()
    )
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    # Clear failed attempts on success
    _login_attempts[client_ip] = []

    token = create_access_token({"sub": user.username, "role": user.role})
    return Token(access_token=token, token_type="bearer", username=user.username, role=user.role)


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    enq = db.query(Enquiry)
    return DashboardStats(
        total_enquiries=enq.count(),
        new_enquiries=enq.filter(Enquiry.status == "new").count(),
        in_progress_enquiries=enq.filter(Enquiry.status == "in_progress").count(),
        completed_enquiries=enq.filter(Enquiry.status == "completed").count(),
        closed_enquiries=enq.filter(Enquiry.status == "closed").count(),
        total_products=db.query(Product).count(),
        published_products=db.query(Product).filter(Product.is_published == True).count(),  # noqa: E712
    )


# ---------------------------------------------------------------------------
# Site settings
# ---------------------------------------------------------------------------
@router.get("/settings", response_model=list[SiteSettingResponse])
def get_settings(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(SiteSettings).order_by(SiteSettings.key).all()


@router.patch("/settings/{key}", response_model=SiteSettingResponse)
def update_setting(
    key: str,
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    setting = db.query(SiteSettings).filter_by(key=key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    setting.value = payload.value
    db.commit()
    db.refresh(setting)
    return setting


# ---------------------------------------------------------------------------
# Admin user management (super-admin only, or first-run setup)
# ---------------------------------------------------------------------------
@router.post("/create-admin", response_model=AdminUserResponse, status_code=201)
def create_admin(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
):
    """Create an admin user. Protected: only works when no admin exists, or via existing admin token."""
    existing_count = db.query(AdminUser).count()
    if existing_count > 0:
        # After first admin, require auth
        raise HTTPException(
            status_code=403,
            detail="Use the CLI command to create additional admin accounts, or authenticate as an existing admin.",
        )
    existing_email = db.query(AdminUser).filter_by(email=str(payload.email)).first()
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = AdminUser(
        email=str(payload.email),
        username=payload.username,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("Admin user created: %s", user.username)
    return user
