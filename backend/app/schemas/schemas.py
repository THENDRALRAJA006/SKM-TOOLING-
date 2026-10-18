"""Pydantic schemas for request/response validation."""
from __future__ import annotations

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator, ConfigDict
import re

_EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')


def _validate_email(v: str) -> str:
    v = v.strip()
    if not v or not _EMAIL_RE.match(v):
        raise ValueError('Enter a valid email address')
    if len(v) > 255:
        raise ValueError('Email address is too long')
    return v


# ---------------------------------------------------------------------------
# Admin User schemas
# ---------------------------------------------------------------------------
class AdminUserCreate(BaseModel):
    email: str

    @field_validator('email')
    @classmethod
    def email_valid(cls, v: str) -> str:
        return _validate_email(v)
    username: str
    password: str
    role: str = "admin"

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_-]{3,50}$", v):
            raise ValueError("Username must be 3-50 alphanumeric characters, underscores, or hyphens")
        return v


class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    username: str
    role: str
    is_active: bool
    created_at: datetime


# ---------------------------------------------------------------------------
# Auth schemas
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    username: str
    password: str



class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str


# ---------------------------------------------------------------------------
# Product schemas
# ---------------------------------------------------------------------------
class ProductBase(BaseModel):
    name: str
    category: str
    short_description: str
    long_description: str = ""
    specifications: str = ""
    image_path: str = ""
    model_path: str = ""
    is_published: bool = True
    sort_order: int = 0


class ProductCreate(ProductBase):
    slug: str

    @field_validator("slug")
    @classmethod
    def slug_valid(cls, v: str) -> str:
        if not re.match(r"^[a-z0-9-]+$", v):
            raise ValueError("Slug must be lowercase letters, numbers, and hyphens only")
        return v


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    short_description: Optional[str] = None
    long_description: Optional[str] = None
    specifications: Optional[str] = None
    image_path: Optional[str] = None
    model_path: Optional[str] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    category: str
    short_description: str
    long_description: str
    specifications: str
    image_path: str
    model_path: str
    is_published: bool
    sort_order: int
    created_at: datetime
    updated_at: Optional[datetime] = None


# ---------------------------------------------------------------------------
# Enquiry schemas
# ---------------------------------------------------------------------------
class EnquiryCreate(BaseModel):
    name: str
    company: str = ""
    email: str

    @field_validator('email')
    @classmethod
    def email_valid(cls, v: str) -> str:
        return _validate_email(v)
    phone: str = ""
    product_category: str = ""
    description: str
    quantity: str = ""
    material_spec: str = ""
    required_delivery: str = ""
    consent: bool

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name is required")
        if len(v) > 200:
            raise ValueError("Name must be 200 characters or less")
        return v

    @field_validator("description")
    @classmethod
    def description_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Project description is required")
        if len(v) > 5000:
            raise ValueError("Description must be 5000 characters or less")
        return v

    @field_validator("consent")
    @classmethod
    def consent_required(cls, v: bool) -> bool:
        if not v:
            raise ValueError("You must consent to data processing to submit an enquiry")
        return v

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, v: str) -> str:
        v = v.strip()
        if v and not re.match(r"^[+\d\s\-()]{0,30}$", v):
            raise ValueError("Invalid phone number format")
        return v


class EnquiryStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def status_valid(cls, v: str) -> str:
        allowed = {"new", "in_progress", "completed", "closed"}
        if v not in allowed:
            raise ValueError(f"Status must be one of: {', '.join(allowed)}")
        return v


class EnquiryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    reference: str
    name: str
    company: str
    email: str
    phone: str
    product_category: str
    description: str
    quantity: str
    material_spec: str
    required_delivery: str
    attachment_filename: str
    status: str
    admin_notes: str
    created_at: datetime
    updated_at: Optional[datetime] = None


# ---------------------------------------------------------------------------
# Site settings schemas
# ---------------------------------------------------------------------------
class SiteSettingUpdate(BaseModel):
    value: str


class SiteSettingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    key: str
    value: str
    description: str
    updated_at: Optional[datetime] = None


# ---------------------------------------------------------------------------
# Dashboard schema
# ---------------------------------------------------------------------------
class DashboardStats(BaseModel):
    total_enquiries: int
    new_enquiries: int
    in_progress_enquiries: int
    completed_enquiries: int
    closed_enquiries: int
    total_products: int
    published_products: int
