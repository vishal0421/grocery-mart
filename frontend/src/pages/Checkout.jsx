import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { MapPin, CreditCard, Truck, Shield, CheckCircle, User, Phone, ChevronRight, Leaf } from 'lucide-react';
import { load } from "@cashfreepayments/cashfree-js";
import { paymentService } from "../services/paymentService";


const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

 useEffect(() => {
  if (cartItems.length === 0) {
    navigate("/cart");
  }
}, [cartItems, navigate]);

if (cartItems.length === 0) {
  return null;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pinCode) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
    

      if (paymentMethod === "COD") {

        await orderService.createOrder(
          fullAddress,
          "COD"
        );

        await fetchCart();

        setOrderPlaced(true);

        toast.success(
          "Order placed successfully!"
        );

      } else {

        const user =
          JSON.parse(
            localStorage.getItem("user")
          );

        const paymentResponse =
          await paymentService.createPayment({

            orderId:
              Date.now().toString(),

            amount:
              cartTotal,

            customerName:
              formData.fullName,

            customerEmail:
              user.email,

            customerPhone:
              formData.phone,
          });

        const cashfree =
          await load({
            mode: "sandbox",
          });

        cashfree.checkout({

          paymentSessionId:
            paymentResponse.paymentSessionId,

          redirectTarget:
            "_self",
        });
      }
      await fetchCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      setTimeout(() => { navigate('/order-success'); }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

    :root {
      --g900:#0D3320; --g700:#1A5C38; --g500:#2E8B57;
      --g400:#3DAA6E; --g100:#E8F5EE; --g50:#F2FAF5;
      --wh:#FFFFFF;
      --gr9:#111827; --gr7:#374151; --gr6:#4B5563;
      --gr4:#9CA3AF; --gr2:#E5E7EB; --gr1:#F9FAFB;
    }

    .co-root * { box-sizing:border-box; }
    .co-root {
      min-height:100vh;
      background:var(--gr1);
      font-family:'DM Sans',sans-serif;
      color:var(--gr9);
    }

    /* ── Header (same as all pages) ── */
    .co-header {
      background:var(--g900);
      padding:40px 0 44px;
      position:relative; overflow:hidden;
    }
    .co-header::after {
      content:'';
      position:absolute; right:-60px; top:-60px;
      width:320px; height:320px; border-radius:50%;
      background:radial-gradient(circle,rgba(46,139,87,.25) 0%,transparent 70%);
      pointer-events:none;
    }
    .co-container { max-width:1280px; margin:0 auto; padding:0 28px; }

    .co-breadcrumb {
      display:flex; align-items:center; gap:6px;
      font-size:12px; color:rgba(255,255,255,.4);
      letter-spacing:.05em; text-transform:uppercase; margin-bottom:20px;
    }
    .co-breadcrumb a { color:rgba(255,255,255,.4); text-decoration:none; }
    .co-breadcrumb-active { color:var(--g400); }

    .co-header-body {
      display:flex; align-items:flex-end;
      justify-content:space-between; gap:24px; flex-wrap:wrap;
    }
    .co-eyebrow {
      display:flex; align-items:center; gap:8px;
      font-size:12px; font-weight:600; letter-spacing:.12em;
      text-transform:uppercase; color:var(--g400); margin-bottom:10px;
    }
    .co-title {
      font-family:'DM Serif Display',serif;
      font-size:clamp(28px,4vw,42px);
      font-weight:400; color:#fff; margin:0; line-height:1.1;
    }
    .co-title em { font-style:italic; color:var(--g400); }
    .co-stat-chip {
      background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.12);
      border-radius:100px; padding:8px 18px;
      font-size:13px; color:rgba(255,255,255,.7);
      font-weight:500; white-space:nowrap; align-self:flex-end;
    }
    .co-stat-chip strong { color:#fff; font-weight:700; }

    /* ── Body grid ── */
    .co-body {
      max-width:1280px; margin:0 auto;
      padding:36px 28px 64px;
      display:grid;
      grid-template-columns:1fr 360px;
      gap:28px;
      align-items:flex-start;
    }

    /* ── Card ── */
    .co-card {
      background:var(--wh);
      border:1.5px solid var(--gr2);
      border-radius:16px;
      padding:28px;
    }

    /* section title row */
    .co-sec-head {
      display:flex; align-items:center; gap:12px;
      margin-bottom:24px; padding-bottom:18px;
      border-bottom:1px solid var(--gr2);
    }
    .co-sec-icon {
      width:40px; height:40px; border-radius:10px;
      background:var(--g50); border:1.5px solid var(--g100);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .co-sec-title {
      font-family:'DM Serif Display',serif;
      font-size:18px; font-weight:400; color:var(--gr9); margin:0;
    }
    .co-sec-sub { font-size:12px; color:var(--gr4); margin-top:2px; }

    /* ── Form fields ── */
    .co-field { display:flex; flex-direction:column; gap:6px; }
    .co-label {
      font-size:11px; font-weight:700;
      letter-spacing:.06em; text-transform:uppercase;
      color:var(--gr6);
    }
    .co-input-wrap { position:relative; }
    .co-input-ico {
      position:absolute; left:13px; top:50%; transform:translateY(-50%);
      color:var(--gr4); pointer-events:none;
      transition:color .15s;
    }
    .co-input {
      width:100%;
      border:1.5px solid var(--gr2); border-radius:9px;
      padding:11px 14px 11px 38px;
      font-size:13px; font-family:'DM Sans',sans-serif;
      color:var(--gr9); background:var(--gr1);
      outline:none;
      transition:border-color .18s, background .18s, box-shadow .18s;
    }
    .co-input.no-ico { padding-left:14px; }
    .co-input::placeholder { color:var(--gr4); }
    .co-input:focus {
      border-color:var(--g500);
      background:var(--wh);
      box-shadow:0 0 0 3px rgba(46,139,87,.1);
    }
    .co-input:focus ~ .co-input-ico,
    .co-input-wrap:focus-within .co-input-ico { color:var(--g500); }

    .co-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .co-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
    .co-form-gap { display:flex; flex-direction:column; gap:18px; }

    /* ── Trust badges ── */
    .co-trust { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
    .co-trust-item {
      display:flex; flex-direction:column; align-items:center; gap:7px;
      padding:14px 8px;
      border-radius:12px;
      border:1.5px solid transparent;
      transition:border-color .18s, background .18s;
    }
    .co-trust-item.green { background:var(--g50); border-color:var(--g100); }
    .co-trust-item.blue  { background:#EFF6FF; border-color:#DBEAFE; }
    .co-trust-item.purple{ background:#F5F3FF; border-color:#EDE9FE; }
    .co-trust-label { font-size:10px; font-weight:700; color:var(--gr7); text-align:center; letter-spacing:.02em; }

    /* ── Submit button ── */
    .co-submit {
      width:100%; background:var(--g700); color:#fff;
      border:none; border-radius:10px;
      padding:14px 20px;
      font-size:15px; font-weight:700;
      font-family:'DM Sans',sans-serif;
      cursor:pointer;
      display:flex; align-items:center; justify-content:center; gap:9px;
      transition:background .18s, transform .15s, box-shadow .18s;
      box-shadow:0 4px 14px rgba(26,92,56,.25);
    }
    .co-submit:hover:not(:disabled) {
      background:var(--g900);
      transform:translateY(-1px);
      box-shadow:0 8px 20px rgba(13,51,32,.3);
    }
    .co-submit:disabled { opacity:.6; cursor:not-allowed; }

    .co-spinner {
      width:16px; height:16px;
      border:2.5px solid rgba(255,255,255,.35);
      border-top-color:#fff;
      border-radius:50%;
      animation:co-spin .7s linear infinite;
    }
    @keyframes co-spin { to { transform:rotate(360deg); } }

    /* ── Order summary card ── */
    .co-summary { position:sticky; top:20px; }

    .co-summary-accent {
      height:4px;
      background:linear-gradient(90deg,var(--g500),var(--g400));
      border-radius:16px 16px 0 0;
      margin:-28px -28px 22px;
    }

    /* item list */
    .co-items { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; max-height:260px; overflow-y:auto; }
    .co-item {
      display:flex; gap:12px; align-items:center;
      padding:12px 14px;
      background:var(--gr1);
      border:1px solid var(--gr2);
      border-radius:10px;
    }
    .co-item-info { flex:1; min-width:0; }
    .co-item-name {
      font-size:13px; font-weight:600; color:var(--gr9);
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    .co-item-qty { font-size:11px; color:var(--gr4); margin-top:2px; }
    .co-item-price { font-size:13px; font-weight:700; color:var(--g700); flex-shrink:0; }

    /* totals */
    .co-totals { border-top:1px solid var(--gr2); padding-top:16px; display:flex; flex-direction:column; gap:12px; }
    .co-total-row { display:flex; justify-content:space-between; align-items:center; font-size:13px; }
    .co-total-label { color:var(--gr6); }
    .co-total-val { font-weight:600; color:var(--gr9); }
    .co-total-free { font-weight:600; color:var(--g500); }

    .co-grand-row {
      display:flex; justify-content:space-between; align-items:baseline;
      border-top:1px solid var(--gr2); padding-top:14px; margin-top:4px;
    }
    .co-grand-label { font-size:15px; font-weight:700; color:var(--gr9); }
    .co-grand-val {
      font-family:'DM Serif Display',serif;
      font-size:26px; color:var(--g700);
    }

    .co-free-banner {
      display:flex; align-items:center; gap:8px;
      background:var(--g50); border:1px solid var(--g100);
      border-radius:9px; padding:11px 14px;
      font-size:12px; font-weight:600; color:var(--g700);
      margin-top:16px;
    }

    /* ── Order placed state ── */
    .co-success {
      min-height:100vh; background:var(--gr1);
      display:flex; align-items:center; justify-content:center;
      padding:24px;
    }
    .co-success-card {
      background:var(--wh);
      border:1.5px solid var(--gr2);
      border-radius:20px;
      padding:48px 40px;
      max-width:420px; width:100%;
      text-align:center;
      box-shadow:0 12px 40px rgba(0,0,0,.08);
    }
    .co-success-icon {
      width:80px; height:80px; border-radius:50%;
      background:var(--g50); border:1.5px solid var(--g100);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 24px;
    }
    .co-success-title {
      font-family:'DM Serif Display',serif;
      font-size:28px; color:var(--gr9); margin-bottom:10px;
    }
    .co-success-desc { font-size:14px; color:var(--gr4); line-height:1.6; margin-bottom:28px; }
    .co-progress {
      height:3px; border-radius:4px; background:var(--gr2); overflow:hidden;
    }
    .co-progress-fill {
      height:100%; border-radius:4px;
      background:linear-gradient(90deg,var(--g500),var(--g400));
      animation:co-prog 2s ease forwards;
    }
    @keyframes co-prog { from { width:0%; } to { width:100%; } }

    /* ── Responsive ── */
    @media(max-width:1024px){
      .co-body { grid-template-columns:1fr; padding:24px 16px 48px; }
      .co-container { padding:0 16px; }
    }
    @media(max-width:600px){
      .co-grid-2 { grid-template-columns:1fr; }
      .co-grid-3 { grid-template-columns:1fr 1fr; }
      .co-card { padding:20px 16px; }
    }
  `;

  /* ── Order placed screen ── */
  if (orderPlaced) {
    return (
      <>
        <style>{styles}</style>
        <div className="co-success">
          <div className="co-success-card">
            <div className="co-success-icon">
              <CheckCircle size={34} color="var(--g500)" />
            </div>
            <h2 className="co-success-title">Order Placed!</h2>
            <p className="co-success-desc">
              Your order has been successfully placed.<br />
              Redirecting to order details…
            </p>
            <div className="co-progress">
              <div className="co-progress-fill" />
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main checkout ── */
  return (
    <>
      <style>{styles}</style>
      <div className="co-root">

        {/* Header */}
        <div className="co-header">
          <div className="co-container">
            <nav className="co-breadcrumb">
              <a href="/">Home</a>
              <ChevronRight size={12} />
              <a href="/cart">Cart</a>
              <ChevronRight size={12} />
              <span className="co-breadcrumb-active">Checkout</span>
            </nav>
            <div className="co-header-body">
              <div>
                <p className="co-eyebrow"><Leaf size={13} /> Almost There</p>
                <h1 className="co-title">Complete your <em>Order</em></h1>
              </div>
              <div className="co-stat-chip">
                <strong>{cartItems.length}</strong>{' '}
                {cartItems.length === 1 ? 'item' : 'items'} in cart
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="co-body">

          {/* ── Left: Form ── */}
          <div className="co-card">
            <div className="co-sec-head">
              <div className="co-sec-icon">
                <MapPin size={18} color="var(--g500)" />
              </div>
              <div>
                <h2 className="co-sec-title">Shipping Information</h2>
                <p className="co-sec-sub">We'll deliver to this address</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="co-form-gap">

              {/* Name + Phone */}
              <div className="co-grid-2">
                <div className="co-field">
                  <label className="co-label">Full Name *</label>
                  <div className="co-input-wrap">
                    <User className="co-input-ico" size={14} />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Your full name"
                      className="co-input"
                      required
                    />
                  </div>
                </div>
                <div className="co-field">
                  <label className="co-label">Phone Number *</label>
                  <div className="co-input-wrap">
                    <Phone className="co-input-ico" size={14} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit number"
                      className="co-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="co-field">
                <label className="co-label">Street Address *</label>
                <div className="co-input-wrap">
                  <MapPin className="co-input-ico" size={14} />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no., street name, area"
                    className="co-input"
                    required
                  />
                </div>
              </div>

              {/* City / State / PIN */}
              <div className="co-grid-3">
                {[
                  { label: 'City *', key: 'city', ph: 'City' },
                  { label: 'State *', key: 'state', ph: 'State' },
                  { label: 'PIN Code *', key: 'pinCode', ph: 'PIN' },
                ].map(({ label, key, ph }) => (
                  <div key={key} className="co-field">
                    <label className="co-label">{label}</label>
                    <input
                      type="text"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={ph}
                      className="co-input no-ico"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="co-trust">
                <div className="co-trust-item green">
                  <Truck size={18} color="var(--g500)" />
                  <span className="co-trust-label">Fast Delivery</span>
                </div>
                <div className="co-trust-item blue">
                  <Shield size={18} color="#2563EB" />
                  <span className="co-trust-label">Secure Order</span>
                </div>
                <div className="co-trust-item purple">
                  <CreditCard size={18} color="#7C3AED" />
                  <span className="co-trust-label">Easy Payment</span>
                </div>
              </div>

              {/* Submit */}
              <div
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "10px",
                  background: "#fff",
                }}
              >
                <h3
                  style={{
                    marginBottom: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Payment Method
                </h3>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />
                  Cash On Delivery
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />
                  Online Payment
                </label>
              </div>
              <button type="submit" disabled={loading} className="co-submit">
                {loading ? (
                  <>
                    <span className="co-spinner" />
                    Placing Order…
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} />
                    Place Order
                  </>
                )}
              </button>

            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="co-card co-summary">
            <div className="co-summary-accent" />

            <div className="co-sec-head" style={{ marginBottom: 18 }}>
              <div>
                <h2 className="co-sec-title">Order Summary</h2>
                <p className="co-sec-sub">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>

            {/* Items */}
            <div className="co-items">
              {cartItems.map((item, index) => (
                <div key={item.product?._id || item._id || index} className="co-item">
                  <div className="co-item-info">
                    <div className="co-item-name">{item.product.name}</div>
                    <div className="co-item-qty">Qty: {item.quantity}</div>
                  </div>
                  <span className="co-item-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="co-totals">
              <div className="co-total-row">
                <span className="co-total-label">Subtotal</span>
                <span className="co-total-val">{formatPrice(cartTotal)}</span>
              </div>
              <div className="co-total-row">
                <span className="co-total-label">Delivery</span>
                <span className="co-total-free">Free</span>
              </div>
            </div>

            <div className="co-grand-row">
              <span className="co-grand-label">Total</span>
              <span className="co-grand-val">{formatPrice(cartTotal)}</span>
            </div>

            <div className="co-free-banner">
              <Truck size={14} color="var(--g500)" />
              Free delivery on this order 🎉
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;