import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart, User, Search, Menu, X,
  LogOut, Heart, Leaf, ArrowRight, ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* ─── quick-search suggestions (static — swap with real API if needed) ─── */
const SUGGESTIONS = [
  "Fresh Vegetables", "Organic Fruits", "Dairy & Eggs",
  "Bakery", "Beverages", "Snacks", "Rice & Pulses",
  "Oils & Ghee", "Spices", "Breakfast Cereals",
];

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [searchVal, setSearchVal]           = useState("");
  const [searchFocused, setSearchFocused]   = useState(false);
  const [profileHover, setProfileHover]     = useState(false);
  const searchRef = useRef(null);

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  /* close search dropdown on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchFocused(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchFocused(false);
    }
  };

  const handleSuggestionClick = (s) => {
    setSearchVal(s);
    navigate(`/products?search=${encodeURIComponent(s)}`);
    setSearchFocused(false);
  };

  const isActive = (p) => location.pathname === p;

  const filtered = searchVal.trim()
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(searchVal.toLowerCase()))
    : SUGGESTIONS.slice(0, 6);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --g900:#0D3320; --g700:#1A5C38; --g500:#2E8B57;
          --g400:#3DAA6E; --g100:#E8F5EE; --g50:#F2FAF5;
          --wh:#FFFFFF;
          --gr9:#111827; --gr7:#374151; --gr6:#4B5563;
          --gr4:#9CA3AF; --gr2:#E5E7EB; --gr1:#F9FAFB;
        }

        /* ── Reset ── */
        .hd * { box-sizing:border-box; margin:0; padding:0; }
        .hd { position:sticky; top:0; z-index:50; font-family:'DM Sans',sans-serif; }

        /* ── Outer shell ── */
        .hd-shell {
          background:var(--wh);
          border-bottom:1.5px solid var(--gr2);
          transition:box-shadow .25s;
        }
        .hd-shell.up {
          box-shadow:0 4px 24px rgba(0,0,0,.08);
        }

        /* ── Top accent line ── */
        .hd-accent {
          height:3px;
          background:linear-gradient(90deg,var(--g900) 0%,var(--g500) 50%,var(--g400) 100%);
        }

        /* ── Main row ── */
        .hd-row {
          max-width:1280px;
          margin:0 auto;
          padding:0 28px;
          height:66px;
          display:flex;
          align-items:center;
          gap:20px;
        }

        /* ══ LOGO ══ */
        .hd-logo {
          display:flex; align-items:center; gap:10px;
          text-decoration:none; flex-shrink:0; outline:none;
        }
        .hd-logo-mark {
          width:40px; height:40px; border-radius:11px;
          background:var(--g900);
          display:flex; align-items:center; justify-content:center;
          position:relative;
          transition:transform .22s, box-shadow .22s;
          box-shadow:0 2px 8px rgba(13,51,32,.25);
        }
        .hd-logo:hover .hd-logo-mark {
          transform:scale(1.07) rotate(-3deg);
          box-shadow:0 6px 18px rgba(13,51,32,.35);
        }
        .hd-logo-pip {
          position:absolute; bottom:-4px; right:-4px;
          width:16px; height:16px; border-radius:50%;
          background:var(--g400);
          border:2.5px solid var(--wh);
          display:flex; align-items:center; justify-content:center;
        }
        .hd-logo-words { line-height:1; }
        .hd-logo-name {
          font-size:15px; font-weight:700;
          color:var(--gr9); letter-spacing:-.02em;
          display:flex; align-items:baseline; gap:1px;
        }
        .hd-logo-name em {
          font-style:italic; font-family:'DM Serif Display',serif;
          color:var(--g700); font-size:16px;
        }
        .hd-logo-tag {
          font-size:9px; font-weight:600;
          letter-spacing:.12em; text-transform:uppercase;
          color:var(--gr4); margin-top:3px;
        }

        /* ══ SEARCH ══ */
        .hd-search-wrap {
          flex:1; max-width:420px;
          position:relative;
          display:none;
        }
        @media(min-width:768px){ .hd-search-wrap{display:block;} }

        .hd-search-form { display:flex; position:relative; }

        .hd-search-ico {
          position:absolute; left:13px; top:50%; transform:translateY(-50%);
          color:var(--gr4); pointer-events:none;
          transition:color .15s;
        }
        .hd-search-wrap:focus-within .hd-search-ico { color:var(--g500); }

        .hd-search-inp {
          width:100%;
          padding:10px 48px 10px 40px;
          border:1.5px solid var(--gr2);
          border-radius:10px;
          font-size:13px; font-family:'DM Sans',sans-serif;
          color:var(--gr9); background:var(--gr1);
          outline:none;
          transition:border-color .18s, background .18s, box-shadow .18s;
        }
        .hd-search-inp::placeholder { color:var(--gr4); }
        .hd-search-inp:focus {
          background:var(--wh);
          border-color:var(--g500);
          box-shadow:0 0 0 3px rgba(46,139,87,.12);
        }

        /* clear × */
        .hd-search-clear {
          position:absolute; right:42px; top:50%; transform:translateY(-50%);
          width:20px; height:20px; border-radius:50%;
          background:var(--gr2); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:var(--gr6);
          transition:background .15s, color .15s;
        }
        .hd-search-clear:hover { background:var(--gr4); color:var(--wh); }

        /* search submit arrow */
        .hd-search-submit {
          position:absolute; right:8px; top:50%; transform:translateY(-50%);
          width:28px; height:28px; border-radius:8px;
          background:var(--g700); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:background .18s, transform .15s;
        }
        .hd-search-submit:hover { background:var(--g900); transform:translateY(-50%) scale(1.05); }

        /* ── dropdown ── */
        .hd-search-drop {
          position:absolute; top:calc(100% + 8px); left:0; right:0;
          background:var(--wh);
          border:1.5px solid var(--gr2);
          border-radius:12px;
          box-shadow:0 12px 40px rgba(0,0,0,.12);
          overflow:hidden;
          animation:hd-fade-in .15s ease;
          z-index:100;
        }
        @keyframes hd-fade-in {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .hd-drop-label {
          font-size:10px; font-weight:700;
          letter-spacing:.1em; text-transform:uppercase;
          color:var(--gr4); padding:10px 14px 6px;
        }

        .hd-drop-item {
          display:flex; align-items:center; gap:10px;
          padding:9px 14px; cursor:pointer;
          transition:background .12s;
          font-size:13px; font-weight:500; color:var(--gr7);
          text-decoration:none;
        }
        .hd-drop-item:hover {
          background:var(--g50); color:var(--g700);
        }
        .hd-drop-item:hover .hd-drop-arr { opacity:1; transform:translateX(0); }

        .hd-drop-dot {
          width:6px; height:6px; border-radius:50%;
          background:var(--g100); flex-shrink:0;
          border:1.5px solid var(--gr2);
          transition:background .12s;
        }
        .hd-drop-item:hover .hd-drop-dot { background:var(--g400); border-color:var(--g400); }

        .hd-drop-arr {
          margin-left:auto; color:var(--g400);
          opacity:0; transform:translateX(-4px);
          transition:opacity .15s, transform .15s;
        }

        .hd-drop-footer {
          border-top:1px solid var(--gr2);
          padding:8px 14px;
          display:flex; align-items:center; justify-content:space-between;
          font-size:12px; color:var(--gr4);
        }
        .hd-drop-footer kbd {
          background:var(--gr1); border:1px solid var(--gr2);
          border-radius:4px; padding:1px 6px;
          font-size:10px; font-family:monospace; color:var(--gr6);
        }

        /* ══ NAV ══ */
        .hd-nav {
          display:none; align-items:center; gap:2px;
          margin-left:auto;
        }
        @media(min-width:1024px){ .hd-nav{display:flex;} }

        .hd-nl {
          position:relative;
          font-size:13px; font-weight:500;
          color:var(--gr6); text-decoration:none;
          padding:7px 13px; border-radius:9px;
          transition:color .15s, background .15s;
          white-space:nowrap;
        }
        .hd-nl::after {
          content:'';
          position:absolute; bottom:4px; left:50%; transform:translateX(-50%);
          width:0; height:2px; border-radius:2px;
          background:var(--g500);
          transition:width .22s;
        }
        .hd-nl:hover { color:var(--g700); background:var(--g50); }
        .hd-nl:hover::after, .hd-nl.on::after { width:18px; }
        .hd-nl.on { color:var(--g700); font-weight:600; background:var(--g50); }

        /* admin pill */
        .hd-nl.adm {
          color:var(--g700); font-weight:600;
          border:1.5px solid var(--g100); background:var(--g50);
        }
        .hd-nl.adm:hover { background:var(--g100); }
        .hd-nl.adm::after { display:none; }

        /* ══ ACTIONS ══ */
        .hd-acts {
          display:none; align-items:center; gap:3px; flex-shrink:0;
        }
        @media(min-width:768px){ .hd-acts{display:flex;} }

        /* icon button base */
        .hd-ib {
          position:relative;
          width:38px; height:38px; border-radius:9px;
          border:none; background:none;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; text-decoration:none; color:var(--gr6);
          transition:color .15s, background .15s, transform .15s;
          flex-shrink:0;
        }
        .hd-ib:hover { transform:scale(1.08); }

        .hd-ib.wsh:hover { color:#EF4444; background:#FEF2F2; }
        .hd-ib.crt:hover { color:var(--g700); background:var(--g50); }
        .hd-ib.lgt:hover { color:#EF4444; background:#FEF2F2; }

        /* cart badge */
        .hd-badge {
          position:absolute; top:4px; right:4px;
          min-width:16px; height:16px;
          background:var(--g500); color:var(--wh);
          font-size:9px; font-weight:800;
          border-radius:100px; padding:0 3px;
          display:flex; align-items:center; justify-content:center;
          border:2px solid var(--wh);
          animation:hd-pop .2s ease;
        }
        @keyframes hd-pop {
          0%   { transform:scale(0); }
          70%  { transform:scale(1.2); }
          100% { transform:scale(1); }
        }

        /* divider */
        .hd-sep { width:1px; height:24px; background:var(--gr2); margin:0 4px; }

        /* profile pill */
        .hd-prof {
          display:flex; align-items:center; gap:8px;
          padding:5px 14px 5px 5px;
          border-radius:100px;
          border:1.5px solid var(--gr2);
          background:var(--wh);
          text-decoration:none; cursor:pointer;
          transition:border-color .18s, background .18s, box-shadow .18s, transform .15s;
          position:relative;
        }
        .hd-prof:hover {
          border-color:var(--g400);
          background:var(--g50);
          box-shadow:0 4px 14px rgba(46,139,87,.12);
          transform:translateY(-1px);
        }
        .hd-prof-av {
          width:28px; height:28px; border-radius:50%;
          background:var(--g700);
          display:flex; align-items:center; justify-content:center;
        }
        .hd-prof-lbl {
          font-size:13px; font-weight:600; color:var(--gr7);
          transition:color .15s;
        }
        .hd-prof:hover .hd-prof-lbl { color:var(--g700); }

        /* auth buttons */
        .hd-login {
          font-size:13px; font-weight:600; color:var(--gr7);
          text-decoration:none; padding:7px 16px;
          border-radius:9px; border:1.5px solid var(--gr2);
          background:var(--wh);
          transition:border-color .15s, background .15s, transform .15s;
        }
        .hd-login:hover { border-color:var(--gr4); background:var(--gr1); transform:translateY(-1px); }

        .hd-signup {
          font-size:13px; font-weight:700; color:var(--wh);
          text-decoration:none; padding:7px 18px;
          border-radius:9px; background:var(--g700); border:none;
          transition:background .18s, transform .15s, box-shadow .18s;
          box-shadow:0 2px 8px rgba(26,92,56,.3);
        }
        .hd-signup:hover { background:var(--g900); transform:translateY(-1px); box-shadow:0 4px 14px rgba(13,51,32,.35); }

        /* ══ HAMBURGER ══ */
        .hd-ham {
          margin-left:auto; width:38px; height:38px;
          border-radius:9px; border:1.5px solid var(--gr2);
          background:var(--wh);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--gr7);
          transition:background .15s, border-color .15s, transform .15s;
          flex-shrink:0;
        }
        .hd-ham:hover { background:var(--gr1); transform:scale(1.05); }
        @media(min-width:768px){ .hd-ham{display:none;} }

        /* ══ MOBILE MENU ══ */
        .hd-mob {
          border-top:1px solid var(--gr2);
          background:var(--wh);
          padding:16px 24px 20px;
          display:flex; flex-direction:column; gap:3px;
          animation:hd-slide-down .2s ease;
        }
        @keyframes hd-slide-down {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @media(min-width:768px){ .hd-mob{display:none!important;} }

        /* mobile search */
        .hd-mob-sw { position:relative; margin-bottom:10px; }
        .hd-mob-si {
          position:absolute; left:13px; top:50%; transform:translateY(-50%);
          color:var(--gr4); pointer-events:none;
        }
        .hd-mob-inp {
          width:100%; padding:10px 44px 10px 38px;
          border:1.5px solid var(--gr2); border-radius:9px;
          font-size:13px; font-family:'DM Sans',sans-serif;
          color:var(--gr9); background:var(--gr1); outline:none;
          transition:border-color .18s;
        }
        .hd-mob-inp:focus { border-color:var(--g500); background:var(--wh); }
        .hd-mob-inp::placeholder { color:var(--gr4); }
        .hd-mob-go {
          position:absolute; right:8px; top:50%; transform:translateY(-50%);
          width:28px; height:28px; border-radius:7px;
          background:var(--g700); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
        }

        /* mobile links */
        .hd-ml {
          display:flex; align-items:center; gap:10px;
          font-size:13px; font-weight:500; color:var(--gr7);
          text-decoration:none; padding:10px 12px; border-radius:9px;
          transition:background .13s, color .13s;
        }
        .hd-ml:hover { background:var(--gr1); }
        .hd-ml.on { background:var(--g50); color:var(--g700); font-weight:600; }

        .hd-mdiv { height:1px; background:var(--gr2); margin:6px 0; }

        .hd-mob-cnt {
          margin-left:auto;
          background:var(--g500); color:var(--wh);
          font-size:10px; font-weight:700;
          padding:2px 8px; border-radius:100px;
        }

        .hd-mob-lgt {
          display:flex; align-items:center; gap:10px;
          font-size:13px; font-weight:500; color:#EF4444;
          background:none; border:none; cursor:pointer;
          padding:10px 12px; border-radius:9px;
          font-family:'DM Sans',sans-serif; width:100%; text-align:left;
          transition:background .13s;
        }
        .hd-mob-lgt:hover { background:#FEF2F2; }

        .hd-mob-auth { display:flex; gap:10px; margin-top:4px; }
        .hd-mob-auth a {
          flex:1; text-align:center;
          font-size:13px; font-weight:600;
          padding:11px; border-radius:9px; text-decoration:none;
        }
        .hd-mob-log {
          color:var(--gr7);
          border:1.5px solid var(--gr2); background:var(--wh);
        }
        .hd-mob-log:hover { background:var(--gr1); }
        .hd-mob-reg { color:var(--wh)!important; background:var(--g700); }
        .hd-mob-reg:hover { background:var(--g900)!important; }
      `}</style>

      <header className="hd">
        <div className={`hd-shell ${scrolled ? "up" : ""}`}>

          {/* green accent line */}
          <div className="hd-accent" />

          <div className="hd-row">

            {/* ── Logo ── */}
            <Link to="/" className="hd-logo">
              <div className="hd-logo-mark">
                <Leaf size={18} color="#fff" />
                <div className="hd-logo-pip">
                  <Leaf size={7} color="#fff" />
                </div>
              </div>
              <div className="hd-logo-words">
                <div className="hd-logo-name">
                  Grocery<em>Mart</em>
                </div>
                <div className="hd-logo-tag">Fresh · Fast · Premium</div>
              </div>
            </Link>

            {/* ── Search ── */}
            <div className="hd-search-wrap" ref={searchRef}>
              <form className="hd-search-form" onSubmit={handleSearchSubmit}>
                <Search className="hd-search-ico" size={15} />
                <input
                  className="hd-search-inp"
                  type="text"
                  placeholder="Search groceries, fruits, vegetables…"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  autoComplete="off"
                />
                {searchVal && (
                  <button
                    type="button"
                    className="hd-search-clear"
                    onClick={() => setSearchVal("")}
                  >
                    <X size={10} />
                  </button>
                )}
                <button type="submit" className="hd-search-submit">
                  <ArrowRight size={13} color="#fff" />
                </button>
              </form>

              {/* dropdown */}
              {searchFocused && filtered.length > 0 && (
                <div className="hd-search-drop">
                  <div className="hd-drop-label">
                    {searchVal ? "Suggestions" : "Popular searches"}
                  </div>
                  {filtered.map((s) => (
                    <div
                      key={s}
                      className="hd-drop-item"
                      onMouseDown={() => handleSuggestionClick(s)}
                    >
                      <span className="hd-drop-dot" />
                      {s}
                      <ChevronRight className="hd-drop-arr" size={13} />
                    </div>
                  ))}
                  <div className="hd-drop-footer">
                    <span>Press <kbd>Enter</kbd> to search</span>
                    <span style={{ fontSize: 11, color: "var(--g400)", fontWeight: 600 }}>
                      {filtered.length} results
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Nav links ── */}
            <nav className="hd-nav">
              <Link to="/" className={`hd-nl ${isActive("/") ? "on" : ""}`}>Home</Link>
              <Link to="/products" className={`hd-nl ${isActive("/products") ? "on" : ""}`}>Products</Link>
              {user && (
                <Link to="/wishlist" className={`hd-nl ${isActive("/wishlist") ? "on" : ""}`}>Wishlist</Link>
              )}
              {isAdmin && (
                <Link to="/admin" className={`hd-nl adm ${isActive("/admin") ? "on" : ""}`}>Admin</Link>
              )}
            </nav>

            {/* ── Right actions ── */}
            <div className="hd-acts">
              {user ? (
                <>
                  <Link to="/wishlist" className="hd-ib wsh" title="Wishlist">
                    <Heart size={18} />
                  </Link>

                  <Link to="/cart" className="hd-ib crt" title="Cart">
                    <ShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="hd-badge">{cartCount}</span>
                    )}
                  </Link>

                  <div className="hd-sep" />

                  <Link
                    to="/profile"
                    className="hd-prof"
                    onMouseEnter={() => setProfileHover(true)}
                    onMouseLeave={() => setProfileHover(false)}
                  >
                    <div className="hd-prof-av">
                      <User size={13} color="#fff" />
                    </div>
                    <span className="hd-prof-lbl">Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="hd-ib lgt"
                    title="Logout"
                  >
                    <LogOut size={17} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hd-login">Login</Link>
                  <Link to="/register" className="hd-signup">Sign Up</Link>
                </>
              )}
            </div>

            {/* ── Hamburger ── */}
            <button
              className="hd-ham"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* ══ Mobile menu ══ */}
          {mobileMenuOpen && (
            <div className="hd-mob">

              {/* mobile search */}
              <div className="hd-mob-sw">
                <Search className="hd-mob-si" size={14} />
                <input
                  className="hd-mob-inp"
                  type="text"
                  placeholder="Search…"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchVal.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                />
                <button
                  className="hd-mob-go"
                  onClick={() => {
                    if (searchVal.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <ArrowRight size={13} color="#fff" />
                </button>
              </div>

              {[
                { to: "/",        label: "Home",     show: true },
                { to: "/products",label: "Products", show: true },
                { to: "/wishlist",label: "Wishlist", show: !!user },
                { to: "/admin",   label: "Admin",    show: !!isAdmin },
              ].filter(l => l.show).map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`hd-ml ${isActive(to) ? "on" : ""}`}
                >
                  {label}
                </Link>
              ))}

              <div className="hd-mdiv" />

              {user ? (
                <>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`hd-ml ${isActive("/cart") ? "on" : ""}`}
                  >
                    <ShoppingCart size={15} color="var(--gr4)" />
                    Cart
                    {cartCount > 0 && <span className="hd-mob-cnt">{cartCount}</span>}
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`hd-ml ${isActive("/profile") ? "on" : ""}`}
                  >
                    <User size={15} color="var(--gr4)" />
                    Profile
                  </Link>

                  <button
                    className="hd-mob-lgt"
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <div className="hd-mob-auth">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hd-mob-log"
                  >Login</Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hd-mob-reg"
                  >Sign Up</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;