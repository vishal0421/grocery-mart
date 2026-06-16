import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice, getImageUrl } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, MapPin, Clock, LogOut, User, ShoppingBag, Leaf, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        setOrders(response.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':    return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
      case 'Processing': return { bg: '#EFF6FF', color: '#1D4ED8', border: '#DBEAFE' };
      case 'Shipped':    return { bg: '#F5F3FF', color: '#6D28D9', border: '#EDE9FE' };
      case 'Delivered':  return { bg: '#F2FAF5', color: '#1A5C38', border: '#E8F5EE' };
      default:           return { bg: '#F9FAFB', color: '#4B5563', border: '#E5E7EB' };
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --g900:#0D3320; --g700:#1A5C38; --g500:#2E8B57;
          --g400:#3DAA6E; --g100:#E8F5EE; --g50:#F2FAF5;
          --wh:#FFFFFF;
          --gr9:#111827; --gr7:#374151; --gr6:#4B5563;
          --gr4:#9CA3AF; --gr2:#E5E7EB; --gr1:#F9FAFB;
        }

        .pf-root * { box-sizing:border-box; }
        .pf-root {
          min-height:100vh;
          background:var(--gr1);
          font-family:'DM Sans',sans-serif;
          color:var(--gr9);
        }

        /* ── Header ── */
        .pf-header {
          background:var(--g900);
          padding:40px 0 56px;
          position:relative; overflow:hidden;
        }
        .pf-header::after {
          content:'';
          position:absolute; right:-60px; top:-60px;
          width:320px; height:320px; border-radius:50%;
          background:radial-gradient(circle,rgba(46,139,87,.25) 0%,transparent 70%);
          pointer-events:none;
        }
        .pf-container { max-width:1280px; margin:0 auto; padding:0 28px; }

        .pf-breadcrumb {
          display:flex; align-items:center; gap:6px;
          font-size:12px; color:rgba(255,255,255,.4);
          letter-spacing:.05em; text-transform:uppercase; margin-bottom:24px;
        }
        .pf-breadcrumb-active { color:var(--g400); }

        .pf-header-row {
          display:flex; align-items:center; gap:20px; flex-wrap:wrap;
        }

        .pf-avatar {
          width:76px; height:76px; border-radius:20px;
          background:var(--g700);
          border:1.5px solid rgba(255,255,255,.15);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
          box-shadow:0 8px 24px rgba(0,0,0,.25);
        }
        .pf-avatar span {
          font-family:'DM Serif Display',serif;
          font-size:30px; color:#fff;
        }

        .pf-eyebrow {
          display:flex; align-items:center; gap:7px;
          font-size:11px; font-weight:600; letter-spacing:.12em;
          text-transform:uppercase; color:var(--g400); margin-bottom:6px;
        }
        .pf-name {
          font-family:'DM Serif Display',serif;
          font-size:clamp(24px,3vw,32px);
          font-weight:400; color:#fff; margin:0; line-height:1.1;
        }
        .pf-email { font-size:13px; color:rgba(255,255,255,.5); margin-top:4px; }

        /* ── Body ── */
        .pf-body {
          max-width:1280px; margin:-32px auto 0;
          padding:0 28px 64px;
          display:grid;
          grid-template-columns:300px 1fr;
          gap:24px;
          align-items:flex-start;
          position:relative;
          z-index:5;
        }

        .pf-card {
          background:var(--wh);
          border:1.5px solid var(--gr2);
          border-radius:16px;
          padding:24px;
          box-shadow:0 8px 28px rgba(0,0,0,.06);
        }

        /* ── Info rows ── */
        .pf-info-rows { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
        .pf-info-row {
          display:flex; align-items:center; gap:12px;
          padding:12px 14px;
          background:var(--gr1);
          border:1px solid var(--gr2);
          border-radius:12px;
          transition:border-color .15s, background .15s;
        }
        .pf-info-row:hover { border-color:var(--g100); background:var(--g50); }

        .pf-info-icon {
          width:36px; height:36px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        }
        .pf-info-icon.green  { background:var(--g100); }
        .pf-info-icon.blue   { background:#DBEAFE; }
        .pf-info-icon.purple { background:#EDE9FE; }

        .pf-info-label { font-size:11px; color:var(--gr4); font-weight:500; }
        .pf-info-value { font-size:13px; color:var(--gr9); font-weight:700; margin-top:1px; text-transform:capitalize; }

        .pf-logout-btn {
          width:100%; padding:13px;
          border-radius:10px;
          background:#FEF2F2;
          color:#DC2626;
          border:1.5px solid #FECACA;
          font-size:13px; font-weight:700;
          font-family:'DM Sans',sans-serif;
          cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:background .18s, border-color .18s;
        }
        .pf-logout-btn:hover { background:#FEE2E2; border-color:#FCA5A5; }

        /* ── Orders section ── */
        .pf-orders-head {
          display:flex; align-items:center; gap:10px;
          margin-bottom:22px; padding-bottom:18px;
          border-bottom:1px solid var(--gr2);
        }
        .pf-orders-icon {
          width:38px; height:38px; border-radius:10px;
          background:var(--g50); border:1.5px solid var(--g100);
          display:flex; align-items:center; justify-content:center;
        }
        .pf-orders-title {
          font-family:'DM Serif Display',serif;
          font-size:19px; font-weight:400; color:var(--gr9); margin:0;
        }
        .pf-orders-sub { font-size:12px; color:var(--gr4); margin-top:2px; }

        /* ── Empty orders ── */
        .pf-empty {
          text-align:center; padding:64px 20px;
        }
        .pf-empty-icon {
          width:72px; height:72px; border-radius:50%;
          background:var(--g50); border:1.5px solid var(--g100);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 18px;
        }
        .pf-empty-title { font-family:'DM Serif Display',serif; font-size:19px; color:var(--gr9); margin-bottom:6px; }
        .pf-empty-desc { font-size:13px; color:var(--gr4); }

        /* ── Order card ── */
        .pf-order-list { display:flex; flex-direction:column; gap:14px; }
        .pf-order-card {
          border:1.5px solid var(--gr2);
          border-radius:14px;
          padding:18px 20px;
          transition:border-color .2s, box-shadow .2s;
        }
        .pf-order-card:hover {
          border-color:var(--g100);
          box-shadow:0 6px 20px rgba(0,0,0,.06);
        }

        .pf-order-top {
          display:flex; align-items:flex-start; justify-content:space-between;
          margin-bottom:16px; gap:10px; flex-wrap:wrap;
        }
        .pf-order-id { font-size:14px; font-weight:700; color:var(--gr9); }
        .pf-order-date {
          font-size:11px; color:var(--gr4); margin-top:3px;
          display:flex; align-items:center; gap:4px;
        }

        .pf-status-pill {
          font-size:11px; font-weight:700;
          padding:5px 13px; border-radius:100px;
          border:1px solid;
          white-space:nowrap;
        }

        .pf-order-items { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
        .pf-order-item {
          display:flex; align-items:center; gap:10px;
          font-size:12.5px;
          background:var(--gr1);
          border-radius:9px;
          padding:8px 12px;
        }
        .pf-item-icon {
          width:22px; height:22px; border-radius:7px;
          background:var(--g100);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        }
        .pf-item-name { flex:1; color:var(--gr7); font-weight:500; }
        .pf-item-qty { color:var(--gr4); font-size:11px; }

        .pf-order-footer {
          display:flex; align-items:center; justify-content:space-between;
          padding-top:14px; border-top:1px solid var(--gr2);
          gap:12px; flex-wrap:wrap;
        }
        .pf-order-addr {
          display:flex; align-items:center; gap:6px;
          font-size:12px; color:var(--gr6);
          min-width:0;
        }
        .pf-order-addr span {
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:240px;
        }
        .pf-order-total {
          font-family:'DM Serif Display',serif;
          font-size:18px; color:var(--g700); flex-shrink:0;
        }

        /* ── Responsive ── */
        @media(max-width:900px){
          .pf-body { grid-template-columns:1fr; margin-top:-24px; padding:0 16px 48px; }
          .pf-container { padding:0 16px; }
        }
        @media(max-width:560px){
          .pf-order-addr span { max-width:140px; }
        }
      `}</style>

      <div className="pf-root">

        {/* ── Header ── */}
        <div className="pf-header">
          <div className="pf-container">
            <nav className="pf-breadcrumb">
              Home <ChevronRight size={11} />
              <span className="pf-breadcrumb-active">My Profile</span>
            </nav>

            <div className="pf-header-row">
              <div className="pf-avatar">
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="pf-eyebrow"><Leaf size={12} /> My Account</p>
                <h1 className="pf-name">{user?.name}</h1>
                <p className="pf-email">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="pf-body">

          {/* ── Left: Info card ── */}
          <div className="pf-card">
            <div className="pf-info-rows">
              <div className="pf-info-row">
                <div className="pf-info-icon green">
                  <User size={16} color="var(--g700)" />
                </div>
                <div>
                  <p className="pf-info-label">Full Name</p>
                  <p className="pf-info-value">{user?.name}</p>
                </div>
              </div>

              <div className="pf-info-row">
                <div className="pf-info-icon blue">
                  <Package size={16} color="#2563EB" />
                </div>
                <div>
                  <p className="pf-info-label">Total Orders</p>
                  <p className="pf-info-value">{orders.length} orders</p>
                </div>
              </div>

              <div className="pf-info-row">
                <div className="pf-info-icon purple">
                  <ShoppingBag size={16} color="#7C3AED" />
                </div>
                <div>
                  <p className="pf-info-label">Account Type</p>
                  <p className="pf-info-value">{user?.role === 'admin' ? 'Admin' : 'Customer'}</p>
                </div>
              </div>
            </div>

            <button onClick={logout} className="pf-logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* ── Right: Orders ── */}
          <div className="pf-card">
            <div className="pf-orders-head">
              <div className="pf-orders-icon">
                <Package size={18} color="var(--g500)" />
              </div>
              <div>
                <h2 className="pf-orders-title">Order History</h2>
                <p className="pf-orders-sub">Track and review your past orders</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="pf-empty">
                <div className="pf-empty-icon">
                  <Package size={30} color="var(--g400)" />
                </div>
                <h3 className="pf-empty-title">No orders yet</h3>
                <p className="pf-empty-desc">Your order history will appear here</p>
              </div>
            ) : (
              <div className="pf-order-list">
                {orders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <div key={order._id} className="pf-order-card">
                      <div className="pf-order-top">
                        <div>
                          <p className="pf-order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="pf-order-date">
                            <Clock size={11} />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span
                          className="pf-status-pill"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderColor: statusStyle.border,
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="pf-order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="pf-order-item">
                            <div className="pf-item-icon">
                              <Package size={11} color="var(--g700)" />
                            </div>
                            <span className="pf-item-name">{item.product?.name || 'Product'}</span>
                            <span className="pf-item-qty">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pf-order-footer">
                        <div className="pf-order-addr">
                          <MapPin size={13} color="var(--g500)" />
                          <span>{order.shippingAddress}</span>
                        </div>
                        <p className="pf-order-total">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;