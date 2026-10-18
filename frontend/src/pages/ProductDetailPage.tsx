import { useEffect, useState, Suspense, lazy } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../lib/api'
import { ChevronRight, ArrowLeft, MessageSquare } from 'lucide-react'
import './ProductDetailPage.css'

const ModelViewer = lazy(() => import('../components/3d/ModelViewer'))

interface Product {
  id: number
  slug: string
  name: string
  category: string
  short_description: string
  long_description: string
  specifications: string
  image_path: string
  model_path: string
}

const MODEL_MAP: Record<string, string> = {
  'core-inserts': 'core-insert',
  'cavity-plates': 'cavity-plate',
  'moulding-tools': 'moulding-tool',
  'case-cover-plates': 'case-cover',
  'tooling-components': 'tooling-component',
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchProduct(slug)
      .then((r) => setProduct(r.data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner spinner--lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="detail-error">
        <h1>Product Not Found</h1>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <Link to="/products" className="btn btn--primary">
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    )
  }

  const modelKey = MODEL_MAP[product.slug] || 'core-insert'

  return (
    <>
      <title>{product.name} | SKM Tooling Center</title>
      <meta name="description" content={product.short_description} />

      <div className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <ChevronRight size={14} className="breadcrumb-sep" />
            <Link to="/products" className="breadcrumb-link">Products</Link>
            <ChevronRight size={14} className="breadcrumb-sep" />
            <span className="breadcrumb-current">{product.name}</span>
          </nav>

          <div className="product-detail-layout">
            {/* 3D Viewer */}
            <div className="product-detail-viewer">
              <Suspense fallback={<div className="detail-loading"><div className="spinner spinner--lg" /></div>}>
                <ModelViewer
                  modelKey={modelKey}
                  height={480}
                  showLabel={true}
                  label={product.name}
                  autoRotate={false}
                />
              </Suspense>
            </div>

            {/* Product Info */}
            <div className="product-detail-info">
              <span className="product-detail-category">{product.category}</span>
              <h1 className="product-detail-name">{product.name}</h1>
              <p className="product-detail-short">{product.short_description}</p>

              {product.long_description && (
                <div className="product-detail-section">
                  <h2 className="product-detail-section-title">About This Product</h2>
                  <p className="product-detail-long">{product.long_description}</p>
                </div>
              )}

              <div className="product-detail-section">
                <h2 className="product-detail-section-title">Specifications</h2>
                <div className="spec-notice">
                  <MessageSquare size={16} />
                  <span>
                    Contact us to discuss specifications, material grades, tolerances, and
                    dimensional requirements for your application.
                  </span>
                </div>
              </div>

              <div className="product-detail-actions">
                <Link
                  to={`/quote?product=${encodeURIComponent(product.category)}`}
                  className="btn btn--primary btn--lg"
                  id={`detail-quote-${product.slug}`}
                >
                  Request a Quote
                  <ChevronRight size={18} />
                </Link>
                <Link to="/contact" className="btn btn--secondary btn--lg" id={`detail-contact-${product.slug}`}>
                  Contact Us
                </Link>
              </div>

              <Link to="/products" className="back-link">
                <ArrowLeft size={14} />
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
