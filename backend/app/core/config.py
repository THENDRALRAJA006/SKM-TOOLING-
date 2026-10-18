"""Application configuration – all secrets come from environment variables."""
from __future__ import annotations

from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ------------------------------------------------------------------
    # App
    # ------------------------------------------------------------------
    APP_NAME: str = "SKM Tooling Center"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ------------------------------------------------------------------
    # Security
    # ------------------------------------------------------------------
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_RANDOM_256_BIT_HEX"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8  # 8 hours
    ALGORITHM: str = "HS256"

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------
    DATABASE_URL: str = "sqlite:///./skm_tooling.db"
    # For PostgreSQL:
    # DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/skm_tooling"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: str) -> str:
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # ------------------------------------------------------------------
    # Email
    # ------------------------------------------------------------------
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""
    ADMIN_EMAIL: str = "skmtoolingcenter@gmail.com"
    EMAIL_ENABLED: bool = False

    # ------------------------------------------------------------------
    # File uploads
    # ------------------------------------------------------------------
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # ------------------------------------------------------------------
    # Rate limiting
    # ------------------------------------------------------------------
    LOGIN_MAX_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_SECONDS: int = 300

    # ------------------------------------------------------------------
    # Company (public-facing, can be managed via admin settings)
    # ------------------------------------------------------------------
    COMPANY_NAME: str = "SKM Tooling Center"


settings = Settings()
