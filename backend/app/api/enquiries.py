"""Enquiry API routes."""
from __future__ import annotations

import logging
import os
import mimetypes
import uuid
from typing import List, Optional
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.models import Enquiry
from app.schemas.schemas import EnquiryCreate, EnquiryResponse, EnquiryStatusUpdate
from app.security.auth import get_current_admin
from app.services.email_service import send_enquiry_notification, send_confirmation_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/enquiries", tags=["enquiries"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".dwg", ".dxf", ".stp", ".step", ".iges", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "application/octet-stream",
}


def _validate_upload(file: UploadFile) -> None:
    if not file.filename:
        return
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' is not allowed. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )
    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        logger.warning("Suspicious MIME type %s for file %s", file.content_type, file.filename)


async def _save_upload(file: UploadFile) -> tuple[str, str]:
    """Save uploaded file to the uploads directory. Returns (original_name, saved_path)."""
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    original_name = Path(file.filename).name
    safe_name = f"{uuid.uuid4().hex}_{original_name}"
    file_path = upload_dir / safe_name

    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB",
        )

    with open(file_path, "wb") as f:
        f.write(content)

    return original_name, str(file_path)


@router.post("", response_model=dict, status_code=201)
async def create_enquiry(
    name: str = Form(...),
    company: str = Form(""),
    email: str = Form(...),
    phone: str = Form(""),
    product_category: str = Form(""),
    description: str = Form(...),
    quantity: str = Form(""),
    material_spec: str = Form(""),
    required_delivery: str = Form(""),
    consent: bool = Form(...),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    # Validate with Pydantic schema
    try:
        payload = EnquiryCreate(
            name=name,
            company=company,
            email=email,
            phone=phone,
            product_category=product_category,
            description=description,
            quantity=quantity,
            material_spec=material_spec,
            required_delivery=required_delivery,
            consent=consent,
        )
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    attachment_filename = ""
    attachment_path = ""

    if attachment and attachment.filename:
        _validate_upload(attachment)
        attachment_filename, attachment_path = await _save_upload(attachment)

    enquiry = Enquiry(
        name=payload.name,
        company=payload.company,
        email=str(payload.email),
        phone=payload.phone,
        product_category=payload.product_category,
        description=payload.description,
        quantity=payload.quantity,
        material_spec=payload.material_spec,
        required_delivery=payload.required_delivery,
        attachment_filename=attachment_filename,
        attachment_path=attachment_path,
        status="new",
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    logger.info("Enquiry %s created from %s", enquiry.reference, enquiry.email)

    # Send emails (non-blocking; failure does not cancel submission)
    email_sent = send_enquiry_notification(
        enquiry_ref=enquiry.reference,
        name=enquiry.name,
        email=str(enquiry.email),
        company=enquiry.company,
        category=enquiry.product_category,
        description=enquiry.description,
    )
    send_confirmation_email(enquiry.name, str(enquiry.email), enquiry.reference)

    return {
        "success": True,
        "reference": enquiry.reference,
        "message": "Your enquiry has been received. We will be in touch shortly.",
        "email_notification_sent": email_sent,
    }


# ---------------------------------------------------------------------------
# Admin routes
# ---------------------------------------------------------------------------
@router.get("/admin/all", response_model=List[EnquiryResponse])
def list_enquiries(
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    query = db.query(Enquiry)
    if status:
        query = query.filter(Enquiry.status == status)
    if search:
        like = f"%{search}%"
        query = query.filter(
            Enquiry.name.ilike(like) | Enquiry.email.ilike(like) | Enquiry.reference.ilike(like)
        )
    offset = (page - 1) * page_size
    return query.order_by(Enquiry.created_at.desc()).offset(offset).limit(page_size).all()


@router.get("/admin/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    enquiry = db.query(Enquiry).filter_by(id=enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.patch("/admin/{enquiry_id}", response_model=EnquiryResponse)
def update_enquiry_status(
    enquiry_id: int,
    payload: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    enquiry = db.query(Enquiry).filter_by(id=enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.status = payload.status
    if payload.admin_notes is not None:
        enquiry.admin_notes = payload.admin_notes
    db.commit()
    db.refresh(enquiry)
    return enquiry
