"""SQLAlchemy ORM models."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


def _now():
    return datetime.now(timezone.utc)


def _new_uuid():
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Admin user
# ---------------------------------------------------------------------------
class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(512), nullable=False)
    role = Column(String(50), default="admin", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now)


# ---------------------------------------------------------------------------
# Product
# ---------------------------------------------------------------------------
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    name = Column(String(300), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    short_description = Column(Text, nullable=False)
    long_description = Column(Text, default="")
    specifications = Column(Text, default="")  # JSON string
    image_path = Column(String(500), default="")
    model_path = Column(String(500), default="")
    is_published = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now)


# ---------------------------------------------------------------------------
# Enquiry
# ---------------------------------------------------------------------------
class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(20), unique=True, index=True, default=lambda: f"ENQ-{uuid.uuid4().hex[:8].upper()}")
    name = Column(String(200), nullable=False)
    company = Column(String(200), default="")
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), default="")
    product_category = Column(String(100), default="")
    description = Column(Text, nullable=False)
    quantity = Column(String(100), default="")
    material_spec = Column(String(300), default="")
    required_delivery = Column(String(100), default="")
    attachment_filename = Column(String(500), default="")
    attachment_path = Column(String(500), default="")
    status = Column(String(50), default="new", index=True)  # new, in_progress, completed, closed
    admin_notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now)


# ---------------------------------------------------------------------------
# Site settings
# ---------------------------------------------------------------------------
class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, default="")
    description = Column(String(500), default="")
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now)
