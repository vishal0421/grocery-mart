import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, Plus, Edit, Trash2,
  TrendingUp, LayoutGrid, Filter, X, Leaf,
  ChevronRight, AlertCircle, CheckCircle, Clock, Truck,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';
import { formatPrice, getImageUrl } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'dashboard',  label: 'Overview',    Icon: LayoutGrid },
  { id: 'products',   label: 'Products',    Icon: Package },
  { id: 'categories', label: 'Categories',  Icon: Filter },
  { id: 'orders',     label: 'Orders',      Icon: ShoppingCart },
];

const STATUS_CONFIG = {
  Pending:    { color: '#F59E0B', bg: '#FEF3C7', Icon: Clock },
  Processing: { color: '#3B82F6', bg: '#EFF6FF', Icon: AlertCircle },
  Shipped:    { color: '#8B5CF6', bg: '#F5F3FF', Icon: Truck },
  Delivered:  { color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', stock: '',
    category: '', image: null, featured: false,
  });

  const [categoryForm, setCategoryForm] = useState({ name: '', image: null });

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
        adminService.getDashboardStats(),
        productService.getProducts(),
        categoryService.getCategories(),
        orderService.getAllOrders(),
      ]);
      setStats(statsRes);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
      setOrders(ordersRes.orders || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('stock', productForm.stock);
    formData.append('category', productForm.category);
    formData.append('featured', productForm.featured);
    if (productForm.image) formData.append('image', productForm.image);

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, productForm);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', stock: '', category: '', image: null, featured: false });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, description: product.description,
      price: product.price, stock: product.stock,
      category: product.category?._id || '',
      image: null, featured: product.featured || false,
    });
    setShowProductModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', categoryForm.name);
    if (categoryForm.image) formData.append('image', categoryForm.image);
    try {
      await categoryService.createCategory(formData);
      toast.success('Category created successfully');
      setShowCategoryModal(false);
      setCategoryForm({ name: '', image: null });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --g900: #0D3320; --g700: #1A5C38; --g500: #2E8B57;
          --g400: #3DAA6E; --g100: #E8F5EE; --g50: #F2FAF5;
          --white: #FFFFFF; --gray900: #111827; --gray700: #374151;
          --gray600: #4B5563; --gray400: #9CA3AF;
          --gray200: #E5E7EB; --gray100: #F9FAFB;
        }

        .ad-root * { box-sizing: border-box; }
        .ad-root {
          min-height: 100vh;
          background: var(--gray100);
          font-family: 'DM Sans', sans-serif;
          color: var(--gray900);
        }

        /* Header */
        .ad-header {
          background: var(--g900);
          padding: 36px 0 40px;
          position: relative;
          overflow: hidden;
        }
        .ad-header::after {
          content: '';
          position: absolute; right: -60px; top: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(46,139,87,0.22) 0%, transparent 70%);
          pointer-events: none;
        }
        .ad-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
        .ad-breadcrumb {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 18px;
        }
        .ad-breadcrumb-active { color: var(--g400); }
        .ad-header-body { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .ad-eyebrow {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--g400); margin-bottom: 8px;
        }
        .ad-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(26px, 3.5vw, 40px);
          font-weight: 400; color: #fff; margin: 0; line-height: 1.1;
        }
        .ad-title em { font-style: italic; color: var(--g400); }
        .ad-header-chips { display: flex; gap: 10px; flex-wrap: wrap; }
        .ad-chip {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 6px 14px; font-size: 12px;
          color: rgba(255,255,255,0.65); font-weight: 500;
        }
        .ad-chip strong { color: #fff; }

        /* Tabs */
        .ad-tabs-bar {
          background: var(--white);
          border-bottom: 1px solid var(--gray200);
          position: sticky; top: 0; z-index: 20;
        }
        .ad-tabs {
          max-width: 1280px; margin: 0 auto;
          padding: 0 28px;
          display: flex; gap: 0; overflow-x: auto;
        }
        .ad-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 16px 20px;
          font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: var(--gray400);
          background: none; border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer; white-space: nowrap;
          transition: color 0.18s, border-color 0.18s;
        }
        .ad-tab:hover { color: var(--g700); }
        .ad-tab.active { color: var(--g700); border-bottom-color: var(--g500); }

        /* Body */
        .ad-body { max-width: 1280px; margin: 0 auto; padding: 32px 28px 64px; }

        /* Section header */
        .ad-section-head {
          display: flex; align-items: flex-end;
          justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
        }
        .ad-section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 24px; font-weight: 400; color: var(--gray900); margin: 0 0 4px;
        }
        .ad-section-sub { font-size: 13px; color: var(--gray400); }

        /* Add button */
        .ad-add-btn {
          display: flex; align-items: center; gap: 7px;
          background: var(--g700); color: #fff;
          border: none; border-radius: 8px;
          padding: 10px 20px; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.18s; white-space: nowrap;
        }
        .ad-add-btn:hover { background: var(--g900); }

        /* Stat cards */
        .ad-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .ad-stat-card {
          background: var(--white);
          border: 1.5px solid var(--gray200);
          border-radius: 16px; padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ad-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); border-color: var(--g100); }
        .ad-stat-top { display: flex; align-items: center; justify-content: space-between; }
        .ad-stat-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ad-stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 36px; color: var(--gray900); line-height: 1;
        }
        .ad-stat-label { font-size: 12px; color: var(--gray400); font-weight: 500; margin-top: 2px; text-align: right; }
        .ad-stat-bar { height: 3px; background: var(--gray100); border-radius: 4px; overflow: hidden; }
        .ad-stat-fill { height: 100%; border-radius: 4px; }

        /* Table */
        .ad-table-wrap {
          background: var(--white);
          border: 1.5px solid var(--gray200);
          border-radius: 16px;
          overflow: hidden;
        }
        .ad-table { width: 100%; border-collapse: collapse; }
        .ad-table thead { background: var(--gray100); border-bottom: 1px solid var(--gray200); }
        .ad-table th {
          padding: 12px 20px; text-align: left;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray400);
        }
        .ad-table td { padding: 14px 20px; border-bottom: 1px solid var(--gray100); }
        .ad-table tbody tr:last-child td { border-bottom: none; }
        .ad-table tbody tr { transition: background 0.15s; }
        .ad-table tbody tr:hover { background: var(--g50); }

        .ad-prod-cell { display: flex; align-items: center; gap: 14px; }
        .ad-prod-img { width: 52px; height: 52px; object-fit: cover; border-radius: 10px; flex-shrink: 0; border: 1px solid var(--gray200); }
        .ad-prod-name { font-size: 14px; font-weight: 600; color: var(--gray900); }
        .ad-prod-cat { font-size: 12px; color: var(--gray400); margin-top: 2px; }
        .ad-price { font-size: 14px; font-weight: 700; color: var(--g700); }

        .ad-stock-badge {
          display: inline-flex; align-items: center;
          padding: 4px 10px; border-radius: 100px;
          font-size: 11px; font-weight: 600;
        }
        .ad-stock-ok  { background: var(--g100); color: var(--g700); }
        .ad-stock-low { background: #FEF3C7; color: #92400E; }
        .ad-stock-out { background: #FEE2E2; color: #991B1B; }

        .ad-action-btn {
          padding: 8px; border: none; border-radius: 8px;
          cursor: pointer; display: flex; align-items: center;
          transition: background 0.15s;
        }
        .ad-action-edit { background: #EFF6FF; color: #2563EB; }
        .ad-action-edit:hover { background: #DBEAFE; }
        .ad-action-del  { background: #FEF2F2; color: #DC2626; }
        .ad-action-del:hover  { background: #FEE2E2; }
        .ad-actions { display: flex; gap: 8px; }

        /* Category cards */
        .ad-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .ad-cat-card {
          background: var(--white); border: 1.5px solid var(--gray200);
          border-radius: 14px; overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ad-cat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: var(--g100); }
        .ad-cat-img-wrap { aspect-ratio: 1; overflow: hidden; }
        .ad-cat-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .ad-cat-card:hover .ad-cat-img { transform: scale(1.06); }
        .ad-cat-body { padding: 14px 16px; }
        .ad-cat-name { font-size: 14px; font-weight: 600; color: var(--gray900); }

        /* Order cards */
        .ad-order-list { display: flex; flex-direction: column; gap: 16px; }
        .ad-order-card {
          background: var(--white); border: 1.5px solid var(--gray200);
          border-radius: 16px; overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .ad-order-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .ad-order-head {
          padding: 18px 22px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          border-bottom: 1px solid var(--gray100);
        }
        .ad-order-id { font-size: 13px; font-weight: 700; color: var(--gray900); }
        .ad-order-meta { font-size: 12px; color: var(--gray400); margin-top: 3px; }
        .ad-order-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .ad-order-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; color: var(--g700);
        }
        .ad-status-select {
          border: 1.5px solid var(--gray200); border-radius: 8px;
          padding: 8px 12px; font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; color: var(--gray700);
          background: var(--gray100); outline: none; cursor: pointer;
          transition: border-color 0.18s;
        }
        .ad-status-select:focus { border-color: var(--g500); background: var(--white); }
        .ad-order-body { padding: 16px 22px; }
        .ad-order-addr { font-size: 12px; color: var(--gray600); margin-bottom: 10px; }
        .ad-order-addr strong { color: var(--gray900); font-weight: 600; }
        .ad-order-items { display: flex; flex-wrap: wrap; gap: 8px; }
        .ad-order-item-badge {
          display: inline-flex; align-items: center;
          background: var(--g50); border: 1px solid var(--g100);
          border-radius: 100px; padding: 4px 12px;
          font-size: 11px; font-weight: 500; color: var(--g700);
        }

        /* Modal */
        .ad-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 20px;
        }
        .ad-modal {
          background: var(--white);
          border-radius: 20px;
          max-width: 560px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0,0,0,0.2);
        }
        .ad-modal-inner { padding: 28px; }
        .ad-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px; padding-bottom: 18px;
          border-bottom: 1px solid var(--gray200);
        }
        .ad-modal-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; color: var(--gray900); margin: 0;
        }
        .ad-modal-close {
          background: var(--gray100); border: none; border-radius: 8px;
          padding: 8px; cursor: pointer; color: var(--gray600);
          display: flex; align-items: center;
          transition: background 0.15s;
        }
        .ad-modal-close:hover { background: var(--gray200); }
        .ad-form { display: flex; flex-direction: column; gap: 18px; }
        .ad-field { display: flex; flex-direction: column; gap: 6px; }
        .ad-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ad-label { font-size: 12px; font-weight: 600; color: var(--gray700); letter-spacing: 0.02em; }
        .ad-input, .ad-select, .ad-textarea {
          border: 1.5px solid var(--gray200);
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: var(--gray900); background: var(--gray100);
          outline: none; width: 100%;
          transition: border-color 0.18s, background 0.18s;
        }
        .ad-textarea { resize: vertical; min-height: 90px; }
        .ad-input:focus, .ad-select:focus, .ad-textarea:focus {
          border-color: var(--g500); background: var(--white);
          box-shadow: 0 0 0 3px rgba(46,139,87,0.1);
        }
        .ad-checkbox-row {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; border-radius: 8px;
          background: var(--g50); border: 1px solid var(--g100);
          cursor: pointer;
        }
        .ad-checkbox { width: 16px; height: 16px; accent-color: var(--g500); cursor: pointer; }
        .ad-checkbox-label { font-size: 13px; font-weight: 500; color: var(--g700); cursor: pointer; }
        .ad-modal-actions { display: flex; gap: 10px; margin-top: 4px; }
        .ad-submit-btn {
          flex: 1; background: var(--g700); color: #fff;
          border: none; border-radius: 8px; padding: 12px;
          font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.18s;
        }
        .ad-submit-btn:hover { background: var(--g900); }
        .ad-cancel-btn {
          flex: 1; background: var(--gray100); color: var(--gray700);
          border: 1.5px solid var(--gray200); border-radius: 8px; padding: 12px;
          font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.15s;
        }
        .ad-cancel-btn:hover { background: var(--gray200); }

        /* Green accent bar top of modal */
        .ad-modal-accent {
          height: 4px;
          background: linear-gradient(90deg, var(--g500), var(--g400));
          border-radius: 20px 20px 0 0;
        }

        @media (max-width: 900px) {
          .ad-stats { grid-template-columns: 1fr; }
          .ad-body { padding: 24px 16px 48px; }
          .ad-container { padding: 0 16px; }
          .ad-tabs { padding: 0 16px; }
        }
        @media (max-width: 640px) {
          .ad-field-row { grid-template-columns: 1fr; }
          .ad-order-head { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="ad-root">

        {/* ── Header ── */}
        <div className="ad-header">
          <div className="ad-container">
            <nav className="ad-breadcrumb">
              <Link to="/" className="ad-breadcrumb-link">
                Home
              </Link>
              <ChevronRight size={11} />
              <span className="ad-breadcrumb-active">Admin</span>
            </nav>
            <div className="ad-header-body">
              <div>
                <p className="ad-eyebrow"><Leaf size={12} /> Store Management</p>
                <h1 className="ad-title">Admin <em>Dashboard</em></h1>
              </div>
              <div className="ad-header-chips">
                <span className="ad-chip"><strong>{stats?.totalProducts || 0}</strong> Products</span>
                <span className="ad-chip"><strong>{stats?.totalOrders || 0}</strong> Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="ad-tabs-bar">
          <div className="ad-tabs">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`ad-tab ${activeTab === id ? 'active' : ''}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ad-body">

          {/* Overview */}
          {activeTab === 'dashboard' && (
            <div className="ad-stats">
              {[
                { label: 'Total Products', value: stats?.totalProducts || 0, iconBg: '#DCFCE7', iconColor: '#16A34A', Icon: Package, fill: '#16A34A', pct: '75%' },
                { label: 'Categories', value: stats?.totalCategories || 0, iconBg: '#DBEAFE', iconColor: '#2563EB', Icon: Filter, fill: '#2563EB', pct: '60%' },
                { label: 'Total Orders', value: stats?.totalOrders || 0, iconBg: '#F5F3FF', iconColor: '#7C3AED', Icon: ShoppingCart, fill: '#7C3AED', pct: '85%' },
              ].map(({ label, value, iconBg, iconColor, Icon, fill, pct }) => (
                <div key={label} className="ad-stat-card">
                  <div className="ad-stat-top">
                    <div className="ad-stat-icon" style={{ background: iconBg }}>
                      <Icon size={22} color={iconColor} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="ad-stat-num">{value}</div>
                      <div className="ad-stat-label">{label}</div>
                    </div>
                  </div>
                  <div className="ad-stat-bar">
                    <div className="ad-stat-fill" style={{ width: pct, background: fill }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div>
              <div className="ad-section-head">
                <div>
                  <h2 className="ad-section-title">Products</h2>
                  <p className="ad-section-sub">Manage your product inventory</p>
                </div>
                <button
                  className="ad-add-btn"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '', price: '', stock: '', category: '', image: null, featured: false });
                    setShowProductModal(true);
                  }}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="ad-prod-cell">
                            <img src={getImageUrl(product.image)} alt={product.name} className="ad-prod-img" />
                            <div>
                              <div className="ad-prod-name">{product.name}</div>
                              <div className="ad-prod-cat">{product.category?.name || 'Uncategorized'}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="ad-price">{formatPrice(product.price)}</span></td>
                        <td>
                          <span className={`ad-stock-badge ${
                            product.stock > 10 ? 'ad-stock-ok' :
                            product.stock > 0  ? 'ad-stock-low' : 'ad-stock-out'
                          }`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td>
                          <div className="ad-actions">
                            <button className="ad-action-btn ad-action-edit" onClick={() => handleEditProduct(product)} aria-label="Edit"><Edit size={15} /></button>
                            <button className="ad-action-btn ad-action-del" onClick={() => handleDeleteProduct(product._id)} aria-label="Delete"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div>
              <div className="ad-section-head">
                <div>
                  <h2 className="ad-section-title">Categories</h2>
                  <p className="ad-section-sub">Organize products by category</p>
                </div>
                <button className="ad-add-btn" onClick={() => setShowCategoryModal(true)}>
                  <Plus size={16} /> Add Category
                </button>
              </div>
              <div className="ad-cat-grid">
                {categories.map((category) => (
                  <div key={category._id} className="ad-cat-card">
                    <div className="ad-cat-img-wrap">
                      <img src={getImageUrl(category.image)} alt={category.name} className="ad-cat-img" />
                    </div>
                    <div className="ad-cat-body">
                      <div className="ad-cat-name">{category.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <div className="ad-section-head">
                <div>
                  <h2 className="ad-section-title">Orders</h2>
                  <p className="ad-section-sub">Track and manage customer orders</p>
                </div>
              </div>
              <div className="ad-order-list">
                {orders.map((order) => (
                  <div key={order._id} className="ad-order-card">
                    <div className="ad-order-head">
                      <div>
                        <div className="ad-order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                        <div className="ad-order-meta">
                          {new Date(order.createdAt).toLocaleString()} · {order.user?.email}
                        </div>
                      </div>
                      <div className="ad-order-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="ad-status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <span className="ad-order-amount">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                    <div className="ad-order-body">
                      <div className="ad-order-addr">
                        <strong>Shipping:</strong> {order.shippingAddress}
                      </div>
                      <div className="ad-order-items">
                        {order.items.map((item, index) => (
                          <span key={index} className="ad-order-item-badge">
                            {item.product?.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Product Modal ── */}
        {showProductModal && (
          <div className="ad-modal-overlay">
            <div className="ad-modal">
              <div className="ad-modal-accent" />
              <div className="ad-modal-inner">
                <div className="ad-modal-head">
                  <h2 className="ad-modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                  <button className="ad-modal-close" onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock: '', category: '', image: null, featured: false }); }}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleProductSubmit} className="ad-form">
                  <div className="ad-field">
                    <label className="ad-label">Product Name</label>
                    <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="ad-input" required />
                  </div>
                  <div className="ad-field">
                    <label className="ad-label">Description</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="ad-textarea" required />
                  </div>
                  <div className="ad-field-row">
                    <div className="ad-field">
                      <label className="ad-label">Price (₹)</label>
                      <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="ad-input" required />
                    </div>
                    <div className="ad-field">
                      <label className="ad-label">Stock</label>
                      <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="ad-input" required />
                    </div>
                  </div>
                  <div className="ad-field">
                    <label className="ad-label">Category</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="ad-select" required>
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ad-field">
                    <label className="ad-label">Product Image {editingProduct && '(leave blank to keep current)'}</label>
                    <input type="file" onChange={(e) => setProductForm({ ...productForm, image: e.target.files[0] })} className="ad-input" accept="image/*" required={!editingProduct} />
                  </div>
                  <label className="ad-checkbox-row">
                    <input type="checkbox" id="featured" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="ad-checkbox" />
                    <span className="ad-checkbox-label">Mark as Featured product</span>
                  </label>
                  <div className="ad-modal-actions">
                    <button type="submit" className="ad-submit-btn">{editingProduct ? 'Update' : 'Create'} Product</button>
                    <button type="button" className="ad-cancel-btn" onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock: '', category: '', image: null, featured: false }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Category Modal ── */}
        {showCategoryModal && (
          <div className="ad-modal-overlay">
            <div className="ad-modal">
              <div className="ad-modal-accent" />
              <div className="ad-modal-inner">
                <div className="ad-modal-head">
                  <h2 className="ad-modal-title">Add Category</h2>
                  <button className="ad-modal-close" onClick={() => { setShowCategoryModal(false); setCategoryForm({ name: '', image: null }); }}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleCategorySubmit} className="ad-form">
                  <div className="ad-field">
                    <label className="ad-label">Category Name</label>
                    <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="ad-input" required />
                  </div>
                  <div className="ad-field">
                    <label className="ad-label">Category Image</label>
                    <input type="file" onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.files[0] })} className="ad-input" accept="image/*" required />
                  </div>
                  <div className="ad-modal-actions">
                    <button type="submit" className="ad-submit-btn">Create Category</button>
                    <button type="button" className="ad-cancel-btn" onClick={() => { setShowCategoryModal(false); setCategoryForm({ name: '', image: null }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminDashboard;