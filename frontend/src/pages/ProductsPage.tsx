import { useEffect, useState, Suspense, lazy } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { fetchProducts } from '../lib/api'
import { Search, Filter } from 'lucide-react'
import './ProductsPage.css'

const ModelViewer = lazy(() => import('../components/3d/ModelViewer'))

interface Product {
  id: number
  slug: string
  name: string
  category: string
  short_description: string
  image_path: string
  model_path: string
}

const CATEGORIES = [
  'All',
  'Core Inserts',
  'Cavity Plates',
  'Moulding Tools',
  'Case Cover Plates',
  'Tooling Components',
]

const MODEL_MAP: Record<string, string> = {
  'core-inserts': 'core-insert',
  'cavity-plates': 'cavity-plate',
  'moulding-tools': 'moulding-tool',
  'case-cover-plates': 'case-cover',
  'tooling-components': 'tooling-component',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    setLoading(true)
    const cat = selectedCategory === 'All' ? undefined : selectedCategory
    fetchProducts(cat)
      .then((r) => setProducts(r.data))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  const filtered = products.filter((p) =>
    search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      : true
  )

  const handleCategory = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
    setSearch('')
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filtered])

  return (
    <>
      <title>Products | SKM Tooling Center</title>
      <meta name="description" content="Browse precision tooling products from SKM Tooling Center — core inserts, cavity plates, moulding tools, and more." />

      <div className="products-page">
        {/* Page header */}
        <div className="page-hero">
          <div className="tech-grid" aria-hidden="true" />
          <div className="container page-hero-content">
            <p className="section-label">Product Catalogue</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Precision Tooling Components
            </h1>
            <p className="section-description mx-auto" style={{ textAlign: 'center' }}>
              Engineering-grade tooling components manufactured to your specifications.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingBlock: 'var(--space-12)' }}>
          {/* Filters */}
          <div className="products-filters">
            <div className="category-filters" role="group" aria-label="Filter by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => handleCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-wrap">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="search"
                className="form-input search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Results */}
          {loading && (
            <div className="products-loading" aria-live="polite">
              <div className="spinner spinner--lg" />
              <p>Loading products...</p>
            </div>
          )}
          {error && <p className="form-error" style={{ textAlign: 'center' }}>{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <div className="products-empty" aria-live="polite">
              <Filter size={40} style={{ color: 'var(--text-faint)' }} />
              <p>No products found matching your criteria.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="products-grid">
              {filtered.map((product, i) => (
                <article
                  key={product.id}
                  className="product-list-card reveal"
                  style={{ transitionDelay: `${(i % 6) * 80}ms` }}
                >
                  <div className="product-list-viewer">
                    <Suspense fallback={<div className="product-card-loader"><div className="spinner" /></div>}>
                      <ModelViewer
                        modelKey={MODEL_MAP[product.slug] || 'core-insert'}
                        height={220}
                        showLabel={false}
                        autoRotate
                      />
                    </Suspense>
                  </div>
                  <div className="product-list-body">
                    <span className="product-card-category">{product.category}</span>
                    <h2 className="product-list-name">{product.name}</h2>
                    <p className="product-list-desc">{product.short_description}</p>
                    <div className="product-card-actions">
                      <Link to={`/products/${product.slug}`} className="btn btn--ghost btn--sm">
                        View Details
                      </Link>
                      <Link to={`/quote?product=${product.category}`} className="btn btn--primary btn--sm">
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
