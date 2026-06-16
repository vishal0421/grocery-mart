import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Sparkles, Leaf, Star, Quote, CheckCircle2 } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getFeaturedProducts(),
          categoryService.getCategories(),
        ]);
        setProducts(productsRes.products?.slice(0, 8) || []);
        setCategories(categoriesRes.categories?.slice(0, 8) || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --g900: #0D3320; --g800: #123D27; --g700: #1A5C38;
          --g500: #2E8B57; --g400: #3DAA6E; --g300: #6BC98E;
          --g100: #E8F5EE; --g50: #F2FAF5;
          --white: #FFFFFF;
          --gray900: #111827; --gray700: #374151;
          --gray600: #4B5563; --gray400: #9CA3AF;
          --gray200: #E5E7EB; --gray100: #F9FAFB;
        }

        .hm-root * { box-sizing: border-box; }
        .hm-root {
          font-family: 'DM Sans', sans-serif;
          color: var(--gray900);
          background: var(--white);
          overflow-x: hidden;
        }

        .hm-hero {
          position: relative;
          min-height: 700px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hm-hero-bg { position: absolute; inset: 0; }
        .hm-hero-bg img { width: 100%; height: 100%; object-fit: cover; }

        .hm-hero-overlay-1 {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, rgba(13,51,32,0.94) 0%, rgba(26,92,56,0.82) 55%, rgba(46,139,87,0.48) 100%);
        }
        .hm-hero-overlay-2 {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(13,51,32,0.55) 0%, transparent 50%);
        }

        .hm-hero-circle-1 {
          position: absolute; top: -80px; right: -80px;
          width: 480px; height: 480px; border-radius: 50%;
          border: 1px solid rgba(61,170,110,0.15);
          pointer-events: none;
        }
        .hm-hero-circle-2 {
          position: absolute; top: -30px; right: -30px;
          width: 340px; height: 340px; border-radius: 50%;
          border: 1px solid rgba(61,170,110,0.1);
          pointer-events: none;
        }
        .hm-hero-glow {
          position: absolute; bottom: -40px; left: 20%;
          width: 500px; height: 200px;
          background: radial-gradient(ellipse, rgba(46,139,87,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .hm-leaf-particle {
          position: absolute;
          opacity: 0.18;
          pointer-events: none;
          animation: hm-float 7s ease-in-out infinite;
        }
        @keyframes hm-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(12deg); }
        }

        .hm-hero-inner {
          position: relative; z-index: 10;
          max-width: 1280px; margin: 0 auto;
          padding: 80px 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          width: 100%;
        }

        .hm-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 7px 16px;
          margin-bottom: 24px;
          animation: hm-pulse-glow 2.4s ease-in-out infinite;
        }
        @keyframes hm-pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252,211,77,0.0); }
          50% { box-shadow: 0 0 0 5px rgba(252,211,77,0.08); }
        }
        .hm-hero-badge span {
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.05em; color: rgba(255,255,255,0.9);
          text-transform: uppercase;
        }

        .hm-hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 5vw, 62px);
          font-weight: 400;
          color: #fff;
          line-height: 1.08;
          margin: 0 0 20px;
        }
        .hm-hero-title em {
          font-style: italic;
          color: var(--g300);
          display: block;
          position: relative;
        }

        .hm-hero-desc {
          font-size: 16px; line-height: 1.7;
          color: rgba(255,255,255,0.78);
          margin-bottom: 28px;
          max-width: 460px;
        }

        .hm-hero-rating {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 32px;
        }
        .hm-hero-stars { display: flex; gap: 2px; }
        .hm-hero-rating-text {
          font-size: 13px; color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .hm-hero-rating-text strong { color: #fff; }

        .hm-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }

        .hm-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--white); color: var(--g700);
          border: none; border-radius: 10px;
          padding: 14px 28px;
          font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .hm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,0.25); }

        .hm-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 10px;
          padding: 14px 28px;
          font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .hm-btn-ghost:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }

        .hm-hero-right {
          display: flex; flex-direction: column; gap: 16px; align-items: flex-end;
        }

        .hm-stat-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          padding: 20px 24px;
          width: 250px;
          transition: transform 0.25s, border-color 0.25s, background 0.25s;
        }
        .hm-stat-card:hover {
          transform: translateX(-6px) scale(1.02);
          border-color: rgba(255,255,255,0.32);
          background: rgba(255,255,255,0.15);
        }

        .hm-stat-card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }

        .hm-stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--g500);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .hm-stat-card-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 2px; }
        .hm-stat-card-val { font-family: 'DM Serif Display', serif; font-size: 22px; color: #fff; }

        .hm-stat-bar { height: 3px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden; }
        .hm-stat-bar-fill { height: 100%; background: var(--g300); border-radius: 4px; }

        .hm-trust-strip { background: var(--g900); padding: 18px 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .hm-trust-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
        }
        .hm-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.02em;
        }
        .hm-trust-item strong { color: rgba(255,255,255,0.85); }

        .hm-features { background: var(--gray100); padding: 72px 0; }
        .hm-features-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }

        .hm-feat-card {
          background: var(--white);
          border: 1.5px solid var(--gray200);
          border-radius: 16px;
          padding: 28px 24px;
          display: flex; flex-direction: column; gap: 16px;
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
        }
        .hm-feat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--g500), var(--g300));
          transform: scaleX(0);
          transition: transform 0.3s;
          transform-origin: left;
        }
        .hm-feat-card:hover::before { transform: scaleX(1); }
        .hm-feat-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.09);
          border-color: var(--g100);
          transform: translateY(-5px);
        }

        .hm-feat-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: transform 0.25s;
        }
        .hm-feat-card:hover .hm-feat-icon { transform: scale(1.08) rotate(-4deg); }

        .hm-feat-title { font-size: 16px; font-weight: 700; color: var(--gray900); margin: 0 0 4px; }
        .hm-feat-desc { font-size: 13px; color: var(--gray400); line-height: 1.6; margin: 0; }

        .hm-sec-head {
          max-width: 1280px; margin: 0 auto; padding: 0 28px; margin-bottom: 36px;
          display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }
        .hm-sec-head-center {
          max-width: 1280px; margin: 0 auto; padding: 0 28px; margin-bottom: 36px;
          text-align: center;
        }

        .hm-sec-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--g500); margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px; justify-content: center;
        }
        .hm-sec-eyebrow-left {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--g500); margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }

        .hm-sec-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 400; color: var(--gray900); margin: 0 0 8px;
        }
        .hm-sec-title em { font-style: italic; color: var(--g500); }
        .hm-sec-sub { font-size: 14px; color: var(--gray400); margin: 0; }

        .hm-view-all {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--g700);
          text-decoration: none; padding: 8px 16px;
          border-radius: 8px; border: 1.5px solid var(--g100);
          background: var(--g50);
          transition: background 0.15s, border-color 0.15s, transform 0.15s;
          white-space: nowrap; align-self: flex-end;
        }
        .hm-view-all:hover { background: var(--g100); border-color: var(--g300); transform: translateX(2px); }

        .hm-categories { padding: 72px 0; background: var(--white); }
        .hm-cat-grid {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 16px;
        }

        .hm-cat-item {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          text-decoration: none; cursor: pointer;
        }

        .hm-cat-img-wrap {
          width: 80px; height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 2.5px solid var(--gray200);
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          flex-shrink: 0;
          position: relative;
        }
        .hm-cat-item:hover .hm-cat-img-wrap {
          border-color: var(--g400);
          transform: translateY(-5px) scale(1.04);
          box-shadow: 0 10px 24px rgba(46,139,87,0.25);
        }
        .hm-cat-img-wrap img { width: 100%; height: 100%; object-fit: cover; }

        .hm-cat-name {
          font-size: 12px; font-weight: 600;
          color: var(--gray700); text-align: center;
          transition: color 0.2s;
        }
        .hm-cat-item:hover .hm-cat-name { color: var(--g700); }

        .hm-products { padding: 72px 0; background: var(--gray100); }
        .hm-prod-grid {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        .hm-prod-item { transition: transform 0.25s; }
        .hm-prod-item:hover { transform: translateY(-4px); }

        .hm-mobile-cta { text-align: center; margin-top: 28px; display: none; }

        .hm-testimonials { padding: 72px 0; background: var(--white); }
        .hm-test-grid {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .hm-test-card {
          background: var(--gray100);
          border: 1.5px solid var(--gray200);
          border-radius: 16px;
          padding: 26px 24px;
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s, background 0.25s;
          position: relative;
        }
        .hm-test-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateY(-4px);
          border-color: var(--g100);
          background: var(--white);
        }
        .hm-test-quote-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--g100);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .hm-test-stars { display: flex; gap: 2px; margin-bottom: 12px; }
        .hm-test-text { font-size: 13.5px; color: var(--gray700); line-height: 1.7; margin-bottom: 18px; }
        .hm-test-author { display: flex; align-items: center; gap: 10px; }
        .hm-test-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--g700);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Serif Display', serif;
          color: #fff; font-size: 14px; flex-shrink: 0;
        }
        .hm-test-name { font-size: 13px; font-weight: 700; color: var(--gray900); }
        .hm-test-role { font-size: 11px; color: var(--gray400); }

        .hm-cta { padding: 80px 0; background: var(--g900); position: relative; overflow: hidden; }
        .hm-cta::before {
          content: '';
          position: absolute; left: -120px; top: -120px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(46,139,87,0.3) 0%, transparent 70%);
          pointer-events: none;
        }
        .hm-cta::after {
          content: '';
          position: absolute; right: -100px; bottom: -100px;
          width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(61,170,110,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .hm-cta-inner {
          max-width: 720px; margin: 0 auto; padding: 0 28px;
          text-align: center; position: relative; z-index: 2;
        }

        .hm-cta-eyebrow {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--g300); margin-bottom: 16px;
          display: flex; align-items: center; gap: 6px; justify-content: center;
        }

        .hm-cta-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 400; color: #fff; margin: 0 0 16px; line-height: 1.1;
        }
        .hm-cta-title em { font-style: italic; color: var(--g300); }

        .hm-cta-desc {
          font-size: 15px; color: rgba(255,255,255,0.65);
          line-height: 1.7; margin-bottom: 32px;
        }

        .hm-cta-trust {
          display: flex; gap: 18px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .hm-cta-trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.6);
        }

        .hm-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .hm-cta-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--white); color: var(--g700);
          border: none; border-radius: 10px;
          padding: 14px 28px; font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .hm-cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,0.3); }

        .hm-cta-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 14px 28px; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .hm-cta-btn-ghost:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }

        @media (max-width: 1024px) {
          .hm-hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .hm-hero-right { display: none; }
          .hm-features-inner { grid-template-columns: 1fr; gap: 14px; }
          .hm-cat-grid { grid-template-columns: repeat(4, 1fr); }
          .hm-prod-grid { grid-template-columns: repeat(2, 1fr); }
          .hm-test-grid { grid-template-columns: 1fr; }
          .hm-trust-inner { justify-content: center; }
        }

        @media (max-width: 640px) {
          .hm-hero { min-height: 560px; }
          .hm-hero-inner { padding: 60px 16px; }
          .hm-features { padding: 48px 0; }
          .hm-features-inner { padding: 0 16px; }
          .hm-categories { padding: 52px 0; }
          .hm-cat-grid { grid-template-columns: repeat(4, 1fr); padding: 0 16px; gap: 12px; }
          .hm-cat-img-wrap { width: 64px; height: 64px; }
          .hm-products { padding: 52px 0; }
          .hm-prod-grid { grid-template-columns: 1fr; padding: 0 16px; }
          .hm-mobile-cta { display: block; padding: 0 16px; }
          .hm-testimonials { padding: 52px 0; }
          .hm-test-grid { padding: 0 16px; }
          .hm-cta { padding: 60px 0; }
          .hm-sec-head, .hm-sec-head-center { padding: 0 16px; }
          .hm-view-all { display: none; }
          .hm-trust-inner { padding: 0 16px; gap: 14px; }
        }
      `}</style>

      <div className="hm-root">

        <section className="hm-hero">
          <div className="hm-hero-bg">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80"
              alt="Fresh Groceries"
            />
          </div>
          <div className="hm-hero-overlay-1" />
          <div className="hm-hero-overlay-2" />
          <div className="hm-hero-circle-1" />
          <div className="hm-hero-circle-2" />
          <div className="hm-hero-glow" />

          <Leaf size={28} className="hm-leaf-particle" style={{ top: '18%', left: '6%', animationDelay: '0s' }} color="#fff" />
          <Leaf size={20} className="hm-leaf-particle" style={{ top: '60%', left: '12%', animationDelay: '1.5s' }} color="#fff" />
          <Leaf size={34} className="hm-leaf-particle" style={{ top: '75%', left: '3%', animationDelay: '3s' }} color="#fff" />

          <div className="hm-hero-inner">
            <div>
              <div className="hm-hero-badge">
                <Sparkles size={13} color="#FCD34D" />
                <span>Premium Quality Guaranteed</span>
              </div>

              <h1 className="hm-hero-title">
                Fresh Groceries
                <em>Delivered Fast</em>
              </h1>

              <p className="hm-hero-desc">
                Shop thousands of fresh, organic products and get them delivered to your doorstep — fast, fresh, and premium every time.
              </p>

              <div className="hm-hero-rating">
                <div className="hm-hero-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#FCD34D" color="#FCD34D" />
                  ))}
                </div>
                <span className="hm-hero-rating-text">
                  <strong>4.9/5</strong> from 12,000+ happy customers
                </span>
              </div>

              <div className="hm-hero-btns">
                <Link to="/products" className="hm-btn-primary">
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link to="/register" className="hm-btn-ghost">
                  Get Started
                </Link>
              </div>
            </div>

            <div className="hm-hero-right">
              {[
                { label: 'Organic Products', val: '2,400+', pct: '80%', icon: Leaf },
                { label: 'Happy Customers', val: '12,000+', pct: '92%', icon: Sparkles },
                { label: 'Avg Delivery Time', val: '28 min', pct: '70%', icon: Truck },
              ].map(({ label, val, pct, icon: Icon }) => (
                <div key={label} className="hm-stat-card">
                  <div className="hm-stat-card-top">
                    <div className="hm-stat-icon"><Icon size={20} color="#fff" /></div>
                    <div>
                      <div className="hm-stat-card-label">{label}</div>
                      <div className="hm-stat-card-val">{val}</div>
                    </div>
                  </div>
                  <div className="hm-stat-bar"><div className="hm-stat-bar-fill" style={{ width: pct }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="hm-trust-strip">
          <div className="hm-trust-inner">
            <div className="hm-trust-item"><CheckCircle2 size={14} color="#3DAA6E" /> <strong>2,400+</strong>&nbsp;Organic Products</div>
            <div className="hm-trust-item"><CheckCircle2 size={14} color="#3DAA6E" /> <strong>50+</strong>&nbsp;Cities Served</div>
            <div className="hm-trust-item"><CheckCircle2 size={14} color="#3DAA6E" /> <strong>99.2%</strong>&nbsp;On-Time Delivery</div>
            <div className="hm-trust-item"><CheckCircle2 size={14} color="#3DAA6E" /> <strong>4.9★</strong>&nbsp;Average Rating</div>
          </div>
        </div>

        <section className="hm-features">
          <div className="hm-features-inner">
            {[
              { Icon: Truck,  title: 'Express Delivery',  desc: 'Get your orders delivered within 30 minutes, right at your door.', bg: '#DCFCE7', color: '#16A34A' },
              { Icon: Shield, title: 'Quality Promise',   desc: '100% fresh and premium quality products, every single order.', bg: '#DBEAFE', color: '#2563EB' },
              { Icon: Clock,  title: '24/7 Support',      desc: 'Round-the-clock customer assistance, whenever you need help.', bg: '#F5F3FF', color: '#7C3AED' },
            ].map(({ Icon, title, desc, bg, color }) => (
              <div key={title} className="hm-feat-card">
                <div className="hm-feat-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <div>
                  <p className="hm-feat-title">{title}</p>
                  <p className="hm-feat-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="hm-categories">
          <div className="hm-sec-head-center">
            <p className="hm-sec-eyebrow"><Leaf size={12} /> Browse by Type</p>
            <h2 className="hm-sec-title">Shop by <em>Category</em></h2>
            <p className="hm-sec-sub">Curated categories for your daily essentials</p>
          </div>

          <div className="hm-cat-grid">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="hm-cat-item"
              >
                <div className="hm-cat-img-wrap">
                  <img
                    src={`http://localhost:5000/uploads/${category.image}`}
                    alt={category.name}
                  />
                </div>
                <span className="hm-cat-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="hm-products">
          <div className="hm-sec-head">
            <div>
              <p className="hm-sec-eyebrow-left"><Sparkles size={12} /> Handpicked for you</p>
              <h2 className="hm-sec-title">Featured <em>Products</em></h2>
              <p className="hm-sec-sub">Premium picks from our freshest collection</p>
            </div>
            <Link to="/products" className="hm-view-all">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="hm-prod-grid">
            {products.map((product) => (
              <div key={product._id} className="hm-prod-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="hm-mobile-cta">
            <Link to="/products" className="hm-btn-primary" style={{ color: 'var(--g700)', background: 'var(--white)', border: '1.5px solid var(--g100)', boxShadow: 'none' }}>
              View All Products <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="hm-testimonials">
          <div className="hm-sec-head-center">
            <p className="hm-sec-eyebrow"><Star size={12} /> Loved by Thousands</p>
            <h2 className="hm-sec-title">What Our <em>Customers Say</em></h2>
            <p className="hm-sec-sub">Real experiences from our growing community</p>
          </div>

          <div className="hm-test-grid">
            {[
              { name: 'Anika Sharma', role: 'Regular Customer', text: 'Delivery is always on time and the produce feels genuinely fresh. This has completely replaced my weekly market trips.' },
              { name: 'Rohan Mehta', role: 'Verified Buyer', text: 'Quality is consistently excellent and the app makes reordering effortless. Customer support resolved my issue within minutes.' },
              { name: 'Priya Nair', role: 'Premium Member', text: 'Love the organic selection and how transparent the pricing is. Packaging is thoughtful too — nothing arrives damaged.' },
            ].map(({ name, role, text }) => (
              <div key={name} className="hm-test-card">
                <div className="hm-test-quote-icon">
                  <Quote size={16} color="var(--g500)" fill="var(--g100)" />
                </div>
                <div className="hm-test-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#FCD34D" color="#FCD34D" />
                  ))}
                </div>
                <p className="hm-test-text">{text}</p>
                <div className="hm-test-author">
                  <div className="hm-test-avatar">{name.charAt(0)}</div>
                  <div>
                    <div className="hm-test-name">{name}</div>
                    <div className="hm-test-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="hm-cta">
          <div className="hm-cta-inner">
            <p className="hm-cta-eyebrow"><Leaf size={12} /> Join the Community</p>
            <h2 className="hm-cta-title">
              Ready to Experience
              <em> Premium Shopping?</em>
            </h2>
            <p className="hm-cta-desc">
              Join thousands of happy customers and enjoy fast, fresh grocery delivery — straight from farm to your door.
            </p>

            <div className="hm-cta-trust">
              <span className="hm-cta-trust-item"><CheckCircle2 size={13} color="var(--g300)" /> No hidden fees</span>
              <span className="hm-cta-trust-item"><CheckCircle2 size={13} color="var(--g300)" /> Cancel anytime</span>
              <span className="hm-cta-trust-item"><CheckCircle2 size={13} color="var(--g300)" /> Free delivery</span>
            </div>

            <div className="hm-cta-btns">
              <Link to="/register" className="hm-cta-btn-primary">
                Create Free Account <ArrowRight size={15} />
              </Link>
              <Link to="/products" className="hm-cta-btn-ghost">
                Browse Products
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;