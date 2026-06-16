import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { wishlistService } from '../services/wishlistService';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product._id, 1);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        .pc-wrap * { box-sizing: border-box; }

        .pc-wrap {
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          display: block;
        }

        .pc-card {
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.22s, border-color 0.22s, transform 0.22s;
          cursor: pointer;
        }

        .pc-card:hover {
          box-shadow: 0 10px 32px rgba(0,0,0,0.1);
          border-color: #E8F5EE;
          transform: translateY(-4px);
        }

        /* Image area */
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #F9FAFB;
        }

        .pc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .pc-card:hover .pc-img { transform: scale(1.06); }

        /* Dark overlay on hover */
        .pc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(13,51,32,0.45) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.22s;
          pointer-events: none;
        }
        .pc-card:hover .pc-overlay { opacity: 1; }

        /* Wishlist button */
        .pc-wish-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.18s, transform 0.18s, background 0.15s, border-color 0.15s;
        }
        .pc-card:hover .pc-wish-btn {
          opacity: 1;
          transform: scale(1);
        }
        .pc-wish-btn:hover {
          background: #FEF2F2;
          border-color: #FECACA;
        }

        /* Stock badges */
        .pc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 100px;
          color: #fff;
        }
        .pc-badge-low  { background: #F59E0B; }
        .pc-badge-out  { background: #EF4444; }

        /* Quick add button */
        .pc-quick-add {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%) translateY(12px);
          background: #FFFFFF;
          color: #1A5C38;
          border: none;
          border-radius: 8px;
          padding: 9px 20px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          white-space: nowrap;
          opacity: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transition: opacity 0.2s, transform 0.2s, background 0.15s, color 0.15s;
        }
        .pc-card:hover .pc-quick-add {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .pc-quick-add:hover {
          background: #1A5C38;
          color: #fff;
        }
        .pc-quick-add:disabled {
          background: #E5E7EB;
          color: #9CA3AF;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Card body */
        .pc-body {
          padding: 14px 16px 16px;
        }

        .pc-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 5px;
        }

        .pc-name {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          transition: color 0.15s;
        }
        .pc-card:hover .pc-name { color: #1A5C38; }

        .pc-rating {
          display: flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
        }
        .pc-rating span {
          font-size: 11px;
          font-weight: 600;
          color: #9CA3AF;
        }

        .pc-desc {
          font-size: 12px;
          color: #9CA3AF;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .pc-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pc-price {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #1A5C38;
          line-height: 1;
        }

        .pc-instock {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #2E8B57;
          background: #F2FAF5;
          border: 1px solid #E8F5EE;
          padding: 3px 9px;
          border-radius: 100px;
          text-transform: uppercase;
        }
      `}</style>

      <Link to={`/products/${product._id}`} className="pc-wrap">
        <div
          className="pc-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className="pc-img-wrap">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="pc-img"
            />

            <div className="pc-overlay" />

            {/* Wishlist */}
            <button className="pc-wish-btn" onClick={handleWishlistToggle} aria-label="Toggle wishlist">
              <Heart
                size={15}
                fill={isWishlisted ? '#EF4444' : 'none'}
                color={isWishlisted ? '#EF4444' : '#6B7280'}
              />
            </button>

            {/* Badges */}
            {product.stock === 0 && (
              <span className="pc-badge pc-badge-out">Out of Stock</span>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <span className="pc-badge pc-badge-low">Low Stock</span>
            )}

            {/* Quick Add */}
            <button
              className="pc-quick-add"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          </div>

          {/* Body */}
          <div className="pc-body">
            <div className="pc-top-row">
              <h3 className="pc-name">{product.name}</h3>
              <div className="pc-rating">
                <Star size={11} fill="#FBBF24" color="#FBBF24" />
                <span>4.5</span>
              </div>
            </div>

            <p className="pc-desc">{product.description}</p>

            <div className="pc-bottom-row">
              <span className="pc-price">{formatPrice(product.price)}</span>
              {product.stock > 0 && (
                <span className="pc-instock">In Stock</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;