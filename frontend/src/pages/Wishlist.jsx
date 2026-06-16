import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, ChevronRight, Leaf, X } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      setWishlist(response.wishlist);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <LoadingSpinner />;

  const wishlistProducts = wishlist?.products || [];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

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
      --red-50:    #FEF2F2;
      --red-500:   #EF4444;
    }

    .wl-root * { box-sizing: border-box; }
    .wl-root {
      min-height: 100vh;
      background: var(--white);
      font-family: 'DM Sans', sans-serif;
      color: var(--gray-900);
    }

    /* ── Header (matches Products page exactly) ── */
    .wl-header {
      background: var(--green-900);
      padding: 40px 0 44px;
      position: relative;
      overflow: hidden;
    }
    .wl-header::after {
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

    .wl-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
    }

    .wl-breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 20px;
      text-decoration: none;
    }
    .wl-breadcrumb a { color: rgba(255,255,255,0.4); text-decoration: none; }
    .wl-breadcrumb-active { color: var(--green-400); }

    .wl-header-body {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    .wl-eyebrow {
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

    .wl-title {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(30px, 4vw, 44px);
      font-weight: 400;
      color: #FFFFFF;
      line-height: 1.1;
      margin: 0;
    }
    .wl-title em {
      font-style: italic;
      color: var(--green-400);
    }

    .wl-stat-chip {
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
    .wl-stat-chip strong { color: #fff; font-weight: 700; }

    /* ── Body ── */
    .wl-body {
      max-width: 1280px;
      margin: 0 auto;
      padding: 36px 28px 64px;
    }

    .wl-grid-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .wl-count {
      font-size: 15px;
      font-weight: 600;
      color: var(--gray-900);
    }
    .wl-count-num { color: var(--green-700); }

    /* ── Product grid ── */
    .wl-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }

    /* ── Product card ── */
    .wl-card {
      background: var(--white);
      border: 1.5px solid var(--gray-200);
      border-radius: 16px;
      overflow: hidden;
      transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
    }
    .wl-card:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.09);
      border-color: var(--green-100);
      transform: translateY(-3px);
    }

    .wl-card-img-wrap {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--gray-100);
    }

    .wl-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.45s;
    }
    .wl-card:hover .wl-card-img { transform: scale(1.06); }

    /* Remove (heart) button */
    .wl-remove-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--white);
      border: 1.5px solid var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, transform 0.15s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .wl-remove-btn:hover {
      background: var(--red-50);
      border-color: #FECACA;
      transform: scale(1.1);
    }

    .wl-out-badge {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: var(--red-500);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 100px;
    }

    /* Card body */
    .wl-card-body { padding: 16px 18px 18px; }

    .wl-card-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-decoration: none;
      display: block;
      transition: color 0.15s;
    }
    .wl-card-name:hover { color: var(--green-700); }

    .wl-card-desc {
      font-size: 12px;
      color: var(--gray-400);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 14px;
    }

    .wl-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .wl-price {
      font-size: 17px;
      font-weight: 700;
      color: var(--green-700);
    }

    .wl-stock-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 100px;
    }
    .wl-stock-in  { background: var(--green-50);  color: var(--green-700); }
    .wl-stock-out { background: var(--red-50);     color: var(--red-500);   }

    .wl-cart-btn {
      width: 100%;
      background: var(--green-700);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 11px;
      font-size: 13px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      transition: background 0.18s;
    }
    .wl-cart-btn:hover:not(:disabled) { background: var(--green-900); }
    .wl-cart-btn:disabled {
      background: var(--gray-200);
      color: var(--gray-400);
      cursor: not-allowed;
    }

    /* ── Empty state ── */
    .wl-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 55vh;
      padding: 64px 24px;
    }
    .wl-empty-card { text-align: center; max-width: 380px; }

    .wl-empty-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--green-50);
      border: 1.5px solid var(--green-100);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 22px;
    }

    .wl-empty-title {
      font-family: 'DM Serif Display', serif;
      font-size: 24px;
      color: var(--gray-900);
      margin-bottom: 8px;
    }

    .wl-empty-desc {
      font-size: 14px;
      color: var(--gray-400);
      line-height: 1.6;
      margin-bottom: 28px;
    }

    .wl-empty-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--green-700);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 13px 28px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.18s;
    }
    .wl-empty-btn:hover { background: var(--green-900); }

    /* Responsive */
    @media (max-width: 900px) {
      .wl-body { padding: 24px 16px 48px; }
      .wl-container { padding: 0 16px; }
      .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
    }
    @media (max-width: 480px) {
      .wl-grid { grid-template-columns: 1fr; }
    }
  `;

  if (wishlistProducts.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="wl-root">
          {/* Header */}
          <div className="wl-header">
            <div className="wl-container">
              <nav className="wl-breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight size={12} />
                <span className="wl-breadcrumb-active">Wishlist</span>
              </nav>
              <div className="wl-header-body">
                <div>
                  <p className="wl-eyebrow"><Leaf size={13} /> My Saved Items</p>
                  <h1 className="wl-title">My <em>Wishlist</em></h1>
                </div>
              </div>
            </div>
          </div>

          {/* Empty */}
          <div className="wl-empty">
            <div className="wl-empty-card">
              <div className="wl-empty-icon">
                <Heart size={30} color="var(--green-400)" />
              </div>
              <h2 className="wl-empty-title">Your wishlist is empty</h2>
              <p className="wl-empty-desc">
                Save your favourite products and come back to them anytime.
              </p>
              <Link to="/products" className="wl-empty-btn">
                Browse Products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="wl-root">

        {/* ── Header ── */}
        <div className="wl-header">
          <div className="wl-container">
            <nav className="wl-breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={12} />
              <span className="wl-breadcrumb-active">Wishlist</span>
            </nav>
            <div className="wl-header-body">
              <div>
                <p className="wl-eyebrow"><Leaf size={13} /> My Saved Items</p>
                <h1 className="wl-title">My <em>Wishlist</em></h1>
              </div>
              <div className="wl-stat-chip">
                <strong>{wishlistProducts.length}</strong>{' '}
                {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="wl-body">

          <div className="wl-grid-meta">
            <p className="wl-count">
              <span className="wl-count-num">{wishlistProducts.length}</span>{' '}
              {wishlistProducts.length === 1 ? 'product' : 'products'} saved
            </p>
            <Link to="/products" style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-700)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>

          <div className="wl-grid">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="wl-card">

                {/* Image */}
                <div className="wl-card-img-wrap">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="wl-card-img"
                    />
                  </Link>

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="wl-remove-btn"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} fill="#EF4444" color="#EF4444" />
                  </button>

                  {product.stock === 0 && (
                    <span className="wl-out-badge">Out of Stock</span>
                  )}
                </div>

                {/* Body */}
                <div className="wl-card-body">
                  <Link to={`/products/${product._id}`} className="wl-card-name">
                    {product.name}
                  </Link>
                  <p className="wl-card-desc">{product.description}</p>

                  <div className="wl-card-footer">
                    <span className="wl-price">{formatPrice(product.price)}</span>
                    <span className={`wl-stock-badge ${product.stock > 0 ? 'wl-stock-in' : 'wl-stock-out'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className="wl-cart-btn"
                  >
                    <ShoppingBag size={15} />
                    Add to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Wishlist;