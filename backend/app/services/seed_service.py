"""Seed default site settings and product data."""
from __future__ import annotations

import logging
from sqlalchemy.orm import Session

from app.models.models import SiteSettings, Product

logger = logging.getLogger(__name__)

DEFAULT_SETTINGS = [
    ("company_name", "SKM Tooling Center", "Public company name displayed on the website"),
    ("company_tagline", "Precision Tooling. Engineered for Performance.", "Hero tagline"),
    ("company_email", "skmtoolingcenter@gmail.com", "Public contact email address"),
    ("company_phone", "+91 86674 74237", "Primary public contact phone number"),
    ("company_phone_secondary", "+91 95664 93554", "Secondary public contact phone number"),
    ("whatsapp_number", "+91 86674 74237", "Official WhatsApp contact number"),
    ("company_address", "No. 7/174-1B, Near Govt. Hr. School, Rajeswari Layout, Begapalli (PO), SIPCOT, Phase 3, Hosur – 635126, Krishnagiri, Tamil Nadu, India.", "Public company address"),
    ("company_description", "SKM Tooling Center specialises in precision tooling, mould components, and engineered tooling solutions for demanding industrial applications.", "Company description for the About section"),
    ("seo_title", "SKM Tooling Center | Precision Industrial Tooling", "Website SEO title tag"),
    ("seo_description", "SKM Tooling Center delivers precision-engineered tooling components including core inserts, cavity plates, moulding tools, and case cover plates.", "Meta description"),
    ("twitter_handle", "", "Twitter/X handle (optional)"),
    ("linkedin_url", "", "LinkedIn page URL (optional)"),
    ("enquiry_notification_email", "skmtoolingcenter@gmail.com", "Email address to receive enquiry notifications"),
]

DEFAULT_PRODUCTS = [
    {
        "slug": "core-inserts",
        "name": "Core Inserts",
        "category": "Core Inserts",
        "short_description": "Precision-machined core inserts for injection moulding tools, engineered to exact tolerances.",
        "long_description": "Core inserts are precision-machined components used within injection moulding tools to form the internal geometry of moulded parts. Contact us to discuss specifications, material grades, and dimensional requirements for your application.",
        "specifications": "",
        "image_path": "/images/product-core-insert.jpg",
        "model_path": "core-insert",
        "is_published": True,
        "sort_order": 1,
    },
    {
        "slug": "cavity-plates",
        "name": "Cavity Plates",
        "category": "Cavity Plates",
        "short_description": "High-precision cavity plates engineered for consistent part quality and extended tool life.",
        "long_description": "Cavity plates define the external form of the moulded component. Our cavity plates are manufactured to close tolerances. Please contact us to discuss your specific dimensional and material requirements.",
        "specifications": "",
        "image_path": "/images/product-cavity-plate.jpg",
        "model_path": "cavity-plate",
        "is_published": True,
        "sort_order": 2,
    },
    {
        "slug": "moulding-tools",
        "name": "Moulding Tools",
        "category": "Moulding Tools",
        "short_description": "Complete moulding tool assemblies designed and manufactured to customer specifications.",
        "long_description": "Complete moulding tool assemblies for injection moulding applications. Each tool is produced to customer-supplied drawings and specifications. Contact us to discuss your tooling requirements.",
        "specifications": "",
        "image_path": "/images/product-moulding-tool.jpg",
        "model_path": "moulding-tool",
        "is_published": True,
        "sort_order": 3,
    },
    {
        "slug": "case-cover-plates",
        "name": "Case Cover Plates",
        "category": "Case Cover Plates",
        "short_description": "Precision case cover plates manufactured to drawing for housing and enclosure applications.",
        "long_description": "Case cover plates are machined components used in enclosures and housings. Manufactured to customer-supplied drawings. Contact us to discuss specifications and quantities.",
        "specifications": "",
        "image_path": "/images/product-case-cover.jpg",
        "model_path": "case-cover",
        "is_published": True,
        "sort_order": 4,
    },
    {
        "slug": "tooling-components",
        "name": "Tooling Components",
        "category": "Tooling Components",
        "short_description": "Specialist tooling components and precision-machined parts for industrial applications.",
        "long_description": "A range of precision-machined tooling components engineered for industrial applications. Produced to customer drawings and specifications. Contact us to discuss your component requirements.",
        "specifications": "",
        "image_path": "/images/product-tooling-components.jpg",
        "model_path": "tooling-component",
        "is_published": True,
        "sort_order": 5,
    },
]


def seed_defaults(db: Session) -> None:
    """Populate site settings and products if not already present."""
    # Site settings
    for key, value, description in DEFAULT_SETTINGS:
        existing = db.query(SiteSettings).filter_by(key=key).first()
        if not existing:
            db.add(SiteSettings(key=key, value=value, description=description))

    # Products
    for p in DEFAULT_PRODUCTS:
        existing = db.query(Product).filter_by(slug=p["slug"]).first()
        if not existing:
            db.add(Product(**p))

    db.commit()
    logger.info("Default seed data applied.")
