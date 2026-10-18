"""Email notification service."""
from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings

logger = logging.getLogger(__name__)


def _build_enquiry_email(enquiry_ref: str, name: str, email: str, company: str,
                          category: str, description: str) -> tuple[str, str]:
    subject = f"[SKM Tooling Center] New Enquiry {enquiry_ref} from {name}"
    body = f"""
New enquiry received from the SKM Tooling Center website.

Reference: {enquiry_ref}
Name: {name}
Company: {company or 'N/A'}
Email: {email}
Category: {category or 'General'}

Description:
{description}

---
This notification was generated automatically by the SKM Tooling Center website.
Log in to the admin dashboard to view and manage this enquiry.
"""
    return subject, body


def send_enquiry_notification(
    enquiry_ref: str,
    name: str,
    email: str,
    company: str = "",
    category: str = "",
    description: str = "",
) -> bool:
    """Send notification email. Returns True on success, False on failure/unconfigured."""
    if not settings.EMAIL_ENABLED or not settings.SMTP_HOST:
        logger.info("Email not configured – skipping notification for %s", enquiry_ref)
        return False

    try:
        subject, body = _build_enquiry_email(enquiry_ref, name, email, company, category, description)
        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
        msg["To"] = settings.ADMIN_EMAIL
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(msg["From"], [settings.ADMIN_EMAIL], msg.as_string())

        logger.info("Notification email sent for %s", enquiry_ref)
        return True

    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to send email for %s: %s", enquiry_ref, exc)
        return False


def send_confirmation_email(name: str, email: str, enquiry_ref: str) -> bool:
    """Send a confirmation email to the enquirer."""
    if not settings.EMAIL_ENABLED or not settings.SMTP_HOST:
        return False

    try:
        subject = f"Your enquiry has been received – {enquiry_ref}"
        body = f"""Dear {name},

Thank you for contacting SKM Tooling Center. We have received your enquiry and one of our team members will be in touch with you shortly.

Your enquiry reference: {enquiry_ref}

Please quote this reference in any future correspondence.

Best regards,
SKM Tooling Center
"""
        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(msg["From"], [email], msg.as_string())

        return True

    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to send confirmation email to %s: %s", email, exc)
        return False
