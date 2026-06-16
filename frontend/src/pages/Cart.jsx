import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
  Leaf,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { formatPrice, getImageUrl } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
    loading,
  } = useCart();

  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  if (cartItems.length === 0) {
    return (
      <>
        <style>{`
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
          }
          .cp-root * { box-sizing: border-box; }
          .cp-root {
            min-height: 100vh;
            background: var(--white);
            font-family: 'DM Sans', sans-serif;
          }
          .cp-header {
            background: var(--green-900);
            padding: 40px 0 44px;
            position: relative;
            overflow: hidden;
          }
          .cp-header::after {
            content: '';
            position: absolute;
            right: -60px; top: -60px;
            width: 320px; height: 320px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(46,139,87,0.25) 0%, transparent 70%);
            pointer-events: none;
          }
          .cp-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
          .cp-breadcrumb {
            display: flex; align-items: center; gap: 6px;
            font-size: 12px; color: rgba(255,255,255,0.4);
            letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px;
          }
          .cp-breadcrumb-active { color: var(--green-400); }
          .cp-eyebrow {
            display: flex; align-items: center; gap: 8px;
            font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
            text-transform: uppercase; color: var(--green-400); margin-bottom: 10px;
          }
          .cp-title {
            font-family: 'DM Serif Display', serif;
            font-size: clamp(28px, 4vw, 42px);
            font-weight: 400; color: #fff; margin: 0; line-height: 1.1;
          }
          .cp-title em { font-style: italic; color: var(--green-400); }

          /* Empty state */
          .cp-empty-body {
            display: flex; align-items: center; justify-content: center;
            padding: 80px 24px; min-height: 60vh;
          }
          .cp-empty-card {
            text-align: center; max-width: 400px;
          }
          .cp-empty-icon {
            width: 88px; height: 88px; border-radius: 50%;
            background: var(--green-50);
            border: 1.5px solid var(--green-100);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
          }
          .cp-empty-title {
            font-family: 'DM Serif Display', serif;
            font-size: 26px; color: var(--gray-900); margin-bottom: 10px;
          }
          .cp-empty-desc {
            font-size: 14px; color: var(--gray-400);
            line-height: 1.6; margin-bottom: 28px;
          }
          .cp-empty-btn {
            display: inline-flex; align-items: center; gap: 8px;
            background: var(--green-700); color: #fff;
            border: none; border-radius: 8px;
            padding: 13px 28px; font-size: 14px; font-weight: 600;
            font-family: 'DM Sans', sans-serif; cursor: pointer;
            text-decoration: none; transition: background 0.18s;
          }
          .cp-empty-btn:hover { background: var(--green-900); }
        `}</style>
        <div className="cp-root">
          <div className="cp-header">
            <div className="cp-container">
              <nav className="cp-breadcrumb">
                Home <ChevronRight size={12} />
                <span className="cp-breadcrumb-active">Cart</span>
              </nav>
              <p className="cp-eyebrow"><Leaf size={13} /> Your Bag</p>
              <h1 className="cp-title">Shopping <em>Cart</em></h1>
            </div>
          </div>
          <div className="cp-empty-body">
            <div className="cp-empty-card">
              <div className="cp-empty-icon">
                <ShoppingBag size={34} color="var(--green-400)" />
              </div>
              <h2 className="cp-empty-title">Your cart is empty</h2>
              <p className="cp-empty-desc">
                Looks like you haven't added anything yet. Browse our collection and find something you'll love.
              </p>
              <Link to="/products" className="cp-empty-btn">
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
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
        .cp-root * { box-sizing: border-box; }
        .cp-root {
          min-height: 100vh;
          background: var(--white);
          font-family: 'DM Sans', sans-serif;
          color: var(--gray-900);
        }

        /* Header */
        .cp-header {
          background: var(--green-900);
          padding: 40px 0 44px;
          position: relative;
          overflow: hidden;
        }
        .cp-header::after {
          content: '';
          position: absolute;
          right: -60px; top: -60px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(46,139,87,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .cp-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
        .cp-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.4);
          letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px;
        }
        .cp-breadcrumb-active { color: var(--green-400); }
        .cp-header-body {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .cp-eyebrow {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--green-400); margin-bottom: 10px;
        }
        .cp-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 400; color: #fff; margin: 0; line-height: 1.1;
        }
        .cp-title em { font-style: italic; color: var(--green-400); }
        .cp-stat-chip {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 8px 18px;
          font-size: 13px; color: rgba(255,255,255,0.7);
          font-weight: 500; white-space: nowrap; align-self: flex-end;
        }
        .cp-stat-chip strong { color: #fff; font-weight: 700; }

        /* Body */
        .cp-body {
          max-width: 1280px; margin: 0 auto;
          padding: 36px 28px 64px;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 28px;
          align-items: flex-start;
        }

        /* Cart items */
        .cp-items { display: flex; flex-direction: column; gap: 16px; }

        .cp-item {
          background: var(--white);
          border: 1.5px solid var(--gray-200);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 18px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .cp-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          border-color: var(--green-100);
        }

        .cp-item-img {
          width: 100px; height: 100px;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
          background: var(--gray-100);
        }

        .cp-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .cp-item-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cp-item-desc {
          font-size: 12px;
          color: var(--gray-400);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .cp-item-price {
          font-size: 17px;
          font-weight: 700;
          color: var(--green-700);
        }

        /* Right side controls */
        .cp-item-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          flex-shrink: 0;
        }

        .cp-delete-btn {
          background: var(--red-50);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: var(--red-500);
          display: flex;
          align-items: center;
          transition: background 0.15s;
        }
        .cp-delete-btn:hover { background: #fee2e2; }

        .cp-qty-control {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--gray-200);
          border-radius: 8px;
          overflow: hidden;
          background: var(--gray-100);
        }

        .cp-qty-btn {
          background: none;
          border: none;
          padding: 8px 10px;
          cursor: pointer;
          color: var(--gray-600);
          display: flex;
          align-items: center;
          transition: background 0.15s, color 0.15s;
        }
        .cp-qty-btn:hover:not(:disabled) {
          background: var(--white);
          color: var(--green-700);
        }
        .cp-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .cp-qty-value {
          min-width: 40px;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: var(--gray-900);
          padding: 8px 4px;
          background: var(--white);
          border-left: 1.5px solid var(--gray-200);
          border-right: 1.5px solid var(--gray-200);
        }

        .cp-item-subtotal {
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-600);
          white-space: nowrap;
        }

        /* Order summary */
        .cp-summary {
          background: var(--white);
          border: 1.5px solid var(--gray-200);
          border-radius: 16px;
          padding: 24px;
          position: sticky;
          top: 20px;
        }

        .cp-summary-title {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          font-weight: 400;
          color: var(--gray-900);
          margin: 0 0 22px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--gray-200);
        }

        .cp-summary-rows { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }

        .cp-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .cp-summary-label { color: var(--gray-600); }
        .cp-summary-val { font-weight: 600; color: var(--gray-900); }
        .cp-summary-free { font-weight: 600; color: var(--green-500); }

        .cp-summary-divider {
          height: 1px;
          background: var(--gray-200);
          margin: 4px 0 16px;
        }

        .cp-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 24px;
        }

        .cp-summary-total-label {
          font-size: 15px;
          font-weight: 700;
          color: var(--gray-900);
        }

        .cp-summary-total-val {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: var(--green-700);
        }

        .cp-checkout-btn {
          width: 100%;
          background: var(--green-700);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 14px 20px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.18s;
          margin-bottom: 14px;
        }
        .cp-checkout-btn:hover { background: var(--green-900); }

        .cp-continue-link {
          display: block;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--green-700);
          text-decoration: none;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .cp-continue-link:hover { background: var(--green-50); }

        /* Green accent bar at top of summary */
        .cp-summary-accent {
          height: 4px;
          background: linear-gradient(90deg, var(--green-500), var(--green-400));
          border-radius: 16px 16px 0 0;
          margin: -24px -24px 22px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .cp-body {
            grid-template-columns: 1fr;
            padding: 24px 16px 48px;
          }
          .cp-container { padding: 0 16px; }
        }

        @media (max-width: 560px) {
          .cp-item { flex-wrap: wrap; }
          .cp-item-img { width: 80px; height: 80px; }
          .cp-item-controls { flex-direction: row; width: 100%; justify-content: space-between; }
        }
      `}</style>

      <div className="cp-root">
        {/* Header */}
        <div className="cp-header">
          <div className="cp-container">
            <nav className="cp-breadcrumb">
              <Link to="/" className="cp-breadcrumb-link">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="cp-breadcrumb-active">Cart</span>
            </nav>
            <div className="cp-header-body">
              <div>
                <p className="cp-eyebrow"><Leaf size={13} /> Your Bag</p>
                <h1 className="cp-title">Shopping <em>Cart</em></h1>
              </div>
              <div className="cp-stat-chip">
                <strong>{cartItems.length}</strong> {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="cp-body">

          {/* Left — Cart items */}
          <div className="cp-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cp-item">
                <img
                  src={getImageUrl(item.product.image)}
                  alt={item.product.name}
                  className="cp-item-img"
                />

                <div className="cp-item-info">
                  <div>
                    <h3 className="cp-item-name">{item.product.name}</h3>
                    <p className="cp-item-desc">{item.product.description}</p>
                  </div>
                  <p className="cp-item-price">{formatPrice(item.product.price)}</p>
                </div>

                <div className="cp-item-controls">
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="cp-delete-btn"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="cp-qty-control">
                    <button
                      className="cp-qty-btn"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cp-qty-value">{item.quantity}</span>
                    <button
                      className="cp-qty-btn"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="cp-item-subtotal">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Order Summary */}
          <div className="cp-summary">
            <div className="cp-summary-accent" />
            <h2 className="cp-summary-title">Order Summary</h2>

            <div className="cp-summary-rows">
              <div className="cp-summary-row">
                <span className="cp-summary-label">Subtotal ({cartItems.length} items)</span>
                <span className="cp-summary-val">{formatPrice(cartTotal)}</span>
              </div>
              <div className="cp-summary-row">
                <span className="cp-summary-label">Delivery</span>
                <span className="cp-summary-free">Free</span>
              </div>
            </div>

            <div className="cp-summary-divider" />

            <div className="cp-summary-total">
              <span className="cp-summary-total-label">Total</span>
              <span className="cp-summary-total-val">{formatPrice(cartTotal)}</span>
            </div>

            <button onClick={() => navigate("/checkout")} className="cp-checkout-btn">
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <Link to="/products" className="cp-continue-link">
              ← Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Cart;