import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronRight, Leaf } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate input value (what user types) from committed search (what triggers fetch)
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;

      const [productsRes, categoriesRes] = await Promise.all([
        productService.getProducts(params),
        categoryService.getCategories(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, priceRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Commit search on form submit
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setSearchTerm(trimmed);
    const newParams = {};
    if (trimmed) newParams.search = trimmed;
    if (selectedCategory) newParams.category = selectedCategory;
    setSearchParams(newParams);
  };

  // Clear search input + results
  const clearSearch = () => {
    setInputValue('');
    setSearchTerm('');
    const newParams = {};
    if (selectedCategory) newParams.category = selectedCategory;
    setSearchParams(newParams);
  };

  const handleCategoryChange = (categoryId) => {
    const next = categoryId === selectedCategory ? '' : categoryId;
    setSelectedCategory(next);
    const newParams = {};
    if (next) newParams.category = next;
    if (searchTerm) newParams.search = searchTerm;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setInputValue('');
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || selectedCategory || priceRange.min || priceRange.max;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        /* ── Token system ── */
        :root {
          --green-900: #0D3320;
          --green-700: #1A5C38;
          --green-500: #2E8B57;
          --green-400: #3DAA6E;
          --green-100: #E8F5EE;
          --green-50:  #F2FAF5;
          --white:     #FFFFFF;
          --gray-900:  #111827;
          --gray-600:  #4B5563;
          --gray-400:  #9CA3AF;
          --gray-200:  #E5E7EB;
          --gray-100:  #F9FAFB;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
        }

        .pp-root * { box-sizing: border-box; }

        .pp-root {
          min-height: 100vh;
          background: var(--white);
          font-family: 'DM Sans', sans-serif;
          color: var(--gray-900);
        }

        /* ── Header ── */
        .pp-header {
          background: var(--green-900);
          padding: 40px 0 44px;
          position: relative;
          overflow: hidden;
        }

        .pp-header::after {
          content: '';
          position: absolute;
          right: -60px;
          top: -60px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(46,139,87,0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        .pp-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .pp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .pp-breadcrumb-active {
          color: var(--green-400);
        }

        .pp-header-body {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .pp-title-block {}

        .pp-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green-400);
          margin-bottom: 10px;
        }

        .pp-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1.1;
          margin: 0;
        }

        .pp-title em {
          font-style: italic;
          color: var(--green-400);
        }

        .pp-stat-chip {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          white-space: nowrap;
          align-self: flex-end;
        }

        .pp-stat-chip strong {
          color: #fff;
          font-weight: 700;
        }

        /* ── Search bar ── */
        .pp-search-bar {
          background: var(--white);
          border-bottom: 1px solid var(--gray-200);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 30;
          box-shadow: var(--shadow-sm);
        }

        .pp-search-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pp-search-form {
          flex: 1;
          position: relative;
          display: flex;
        }

        .pp-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
          pointer-events: none;
          flex-shrink: 0;
        }

        .pp-search-input {
          width: 100%;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-sm);
          padding: 11px 42px 11px 42px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: var(--gray-900);
          background: var(--gray-100);
          outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }

        .pp-search-input::placeholder { color: var(--gray-400); }

        .pp-search-input:focus {
          background: var(--white);
          border-color: var(--green-500);
          box-shadow: 0 0 0 3px rgba(46,139,87,0.1);
        }

        .pp-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 50%;
          transition: color 0.15s, background 0.15s;
        }

        .pp-search-clear:hover {
          color: var(--gray-900);
          background: var(--gray-200);
        }

        .pp-search-btn {
          background: var(--green-700);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 11px 22px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.18s;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .pp-search-btn:hover { background: var(--green-900); }

        .pp-filter-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1.5px solid var(--gray-200);
          background: var(--white);
          border-radius: var(--radius-sm);
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: var(--gray-600);
          cursor: pointer;
          transition: all 0.18s;
          position: relative;
          white-space: nowrap;
        }

        .pp-filter-btn.open,
        .pp-filter-btn:hover {
          border-color: var(--green-500);
          color: var(--green-700);
          background: var(--green-50);
        }

        .pp-filter-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--green-500);
          border: 2px solid var(--white);
        }

        /* ── Body layout ── */
        .pp-body {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 28px 64px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        /* ── Sidebar ── */
        .pp-sidebar {
          width: 230px;
          flex-shrink: 0;
          display: none;
        }

        @media (min-width: 1024px) { .pp-sidebar { display: block; } }
        .pp-sidebar.open { display: block; }

        .pp-sidebar-card {
          background: var(--white);
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-lg);
          padding: 22px 20px;
          position: sticky;
          top: 76px;
        }

        .pp-sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--gray-200);
        }

        .pp-sidebar-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gray-900);
        }

        .pp-clear-btn {
          font-size: 12px;
          font-weight: 500;
          color: var(--green-700);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 3px;
          transition: color 0.15s;
        }

        .pp-clear-btn:hover { color: var(--green-900); }

        .pp-filter-group { margin-bottom: 24px; }
        .pp-filter-group:last-child { margin-bottom: 0; }

        .pp-filter-group-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gray-400);
          margin-bottom: 12px;
        }

        .pp-cat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          margin-bottom: 2px;
          transition: background 0.15s;
          user-select: none;
        }

        .pp-cat-item:hover { background: var(--green-50); }
        .pp-cat-item.selected { background: var(--green-50); }

        .pp-radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--gray-200);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s, background 0.15s;
        }

        .pp-cat-item.selected .pp-radio {
          border-color: var(--green-500);
          background: var(--green-500);
        }

        .pp-radio-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
        }

        .pp-cat-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--gray-600);
          transition: color 0.15s;
        }

        .pp-cat-item.selected .pp-cat-name,
        .pp-cat-item:hover .pp-cat-name { color: var(--green-900); }

        .pp-price-inputs { display: flex; flex-direction: column; gap: 8px; }

        .pp-price-wrap { position: relative; }

        .pp-price-symbol {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          color: var(--gray-400);
          pointer-events: none;
        }

        .pp-price-input {
          width: 100%;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-sm);
          padding: 9px 12px 9px 26px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: var(--gray-900);
          background: var(--gray-100);
          outline: none;
          transition: border-color 0.18s;
        }

        .pp-price-input::placeholder { color: var(--gray-400); }

        .pp-price-input:focus {
          border-color: var(--green-500);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(46,139,87,0.1);
        }

        /* Divider in sidebar */
        .pp-divider {
          height: 1px;
          background: var(--gray-200);
          margin: 0 0 20px;
        }

        /* ── Grid area ── */
        .pp-grid-area { flex: 1; min-width: 0; }

        .pp-grid-meta {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pp-count {
          font-size: 15px;
          font-weight: 600;
          color: var(--gray-900);
        }

        .pp-count-num { color: var(--green-700); }

        .pp-search-result-note {
          font-size: 13px;
          color: var(--gray-400);
          margin-top: 3px;
        }

        .pp-search-result-note em {
          font-style: normal;
          color: var(--green-700);
          font-weight: 600;
        }

        /* Active filter pills row */
        .pp-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .pp-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--green-50);
          border: 1px solid var(--green-100);
          border-radius: 100px;
          padding: 4px 10px 4px 12px;
          font-size: 12px;
          font-weight: 500;
          color: var(--green-700);
          cursor: default;
        }

        .pp-pill-x {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--green-400);
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .pp-pill-x:hover { color: var(--green-900); }

        /* Products grid */
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        /* Empty state */
        .pp-empty {
          text-align: center;
          padding: 72px 24px;
        }

        .pp-empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--green-50);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1.5px solid var(--green-100);
        }

        .pp-empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: var(--gray-900);
          margin-bottom: 8px;
        }

        .pp-empty-desc {
          font-size: 14px;
          color: var(--gray-400);
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .pp-empty-btn {
          background: var(--green-700);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.18s;
        }

        .pp-empty-btn:hover { background: var(--green-900); }

        /* Responsive */
        @media (max-width: 900px) {
          .pp-body { padding: 24px 16px 48px; gap: 0; }
          .pp-container { padding: 0 16px; }
          .pp-search-inner { padding: 12px 16px; }
          .pp-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
        }

        @media (max-width: 480px) {
          .pp-grid { grid-template-columns: 1fr; }
          .pp-search-btn span { display: none; }
        }
      `}</style>

      <div className="pp-root">

        {/* ── Green Header ── */}
        <div className="pp-header">
          <div className="pp-container">
            <nav className="pp-breadcrumb" aria-label="breadcrumb">
              <Link to="/" className="pp-breadcrumb-link">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="pp-breadcrumb-active">Products</span>
            </nav>

            <div className="pp-header-body">
              <div className="pp-title-block">
                <p className="pp-eyebrow">
                  <Leaf size={13} />
                  Fresh & Curated
                </p>
                <h1 className="pp-title">
                  Shop Our <em>Collection</em>
                </h1>
              </div>

              {!loading && (
                <div className="pp-stat-chip">
                  <strong>{products.length}</strong> items ready to ship
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky Search Bar ── */}
        <div className="pp-search-bar">
          <div className="pp-search-inner">
            <form onSubmit={handleSearch} className="pp-search-form">
              <Search className="pp-search-icon" size={16} />
              <input
                type="text"
                placeholder="Search products, brands, categories…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pp-search-input"
                aria-label="Search products"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="pp-search-clear"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            <button
              type="button"
              className="pp-search-btn"
              onClick={() => {
                const trimmed = inputValue.trim();
                setSearchTerm(trimmed);
                const p = {};
                if (trimmed) p.search = trimmed;
                if (selectedCategory) p.category = selectedCategory;
                setSearchParams(p);
              }}
            >
              <Search size={14} />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`pp-filter-btn lg:hidden ${showFilters ? 'open' : ''}`}
              aria-label="Toggle filters"
            >
              {hasActiveFilters && <span className="pp-filter-dot" />}
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="pp-body">

          {/* Sidebar */}
          <aside className={`pp-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="pp-sidebar-card">
              <div className="pp-sidebar-head">
                <span className="pp-sidebar-title">Filters</span>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="pp-clear-btn">
                    <X size={11} /> Clear all
                  </button>
                )}
              </div>

              {/* Category filter */}
              <div className="pp-filter-group">
                <p className="pp-filter-group-label">Category</p>

                <div
                  className={`pp-cat-item ${!selectedCategory ? 'selected' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  <div className="pp-radio">
                    {!selectedCategory && <div className="pp-radio-dot" />}
                  </div>
                  <span className="pp-cat-name">All Products</span>
                </div>

                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className={`pp-cat-item ${selectedCategory === cat._id ? 'selected' : ''}`}
                    onClick={() => handleCategoryChange(cat._id)}
                  >
                    <div className="pp-radio">
                      {selectedCategory === cat._id && <div className="pp-radio-dot" />}
                    </div>
                    <span className="pp-cat-name">{cat.name}</span>
                  </div>
                ))}
              </div>

              <div className="pp-divider" />

              {/* Price filter */}
              <div className="pp-filter-group">
                <p className="pp-filter-group-label">Price Range</p>
                <div className="pp-price-inputs">
                  <div className="pp-price-wrap">
                    <span className="pp-price-symbol">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="pp-price-input"
                    />
                  </div>
                  <div className="pp-price-wrap">
                    <span className="pp-price-symbol">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="pp-price-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products area */}
          <div className="pp-grid-area">

            {/* Meta row */}
            <div className="pp-grid-meta">
              <div>
                <p className="pp-count">
                  <span className="pp-count-num">{products.length}</span>{' '}
                  {products.length === 1 ? 'product' : 'products'} found
                </p>
                {searchTerm && (
                  <p className="pp-search-result-note">
                    Showing results for <em>"{searchTerm}"</em>
                  </p>
                )}
              </div>
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="pp-pills">
                {searchTerm && (
                  <span className="pp-pill">
                    "{searchTerm}"
                    <button className="pp-pill-x" onClick={clearSearch}><X size={11} /></button>
                  </span>
                )}
                {selectedCategory && categories.find(c => c._id === selectedCategory) && (
                  <span className="pp-pill">
                    {categories.find(c => c._id === selectedCategory)?.name}
                    <button className="pp-pill-x" onClick={() => handleCategoryChange('')}><X size={11} /></button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="pp-pill">
                    ₹{priceRange.min || '0'} – ₹{priceRange.max || '∞'}
                    <button className="pp-pill-x" onClick={() => setPriceRange({ min: '', max: '' })}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Loading / Grid / Empty */}
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="pp-empty">
                <div className="pp-empty-icon-wrap">
                  <Search size={26} color="var(--green-400)" />
                </div>
                <h3 className="pp-empty-title">No products found</h3>
                <p className="pp-empty-desc">
                  {searchTerm
                    ? `We couldn't find anything for "${searchTerm}". Try different keywords or remove a filter.`
                    : 'No products match your current filters. Try adjusting them.'}
                </p>
                <button onClick={clearFilters} className="pp-empty-btn">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="pp-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;