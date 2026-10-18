"""Product API routes."""
from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Product
from app.schemas.schemas import ProductResponse, ProductCreate, ProductUpdate
from app.security.auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[ProductResponse])
def list_products(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_published == True)  # noqa: E712
    if category:
        query = query.filter(Product.category == category)
    return query.order_by(Product.sort_order, Product.name).all()


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug, Product.is_published == True).first()  # noqa: E712
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Admin-only product management
@router.get("/admin/all", response_model=List[ProductResponse])
def list_all_products(
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    return db.query(Product).order_by(Product.sort_order, Product.name).all()


@router.post("/admin/create", response_model=ProductResponse, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    existing = db.query(Product).filter_by(slug=payload.slug).first()
    if existing:
        raise HTTPException(status_code=409, detail="Slug already exists")
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/admin/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/admin/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    product = db.query(Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
