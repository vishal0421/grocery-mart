# Grocery Mart Frontend

A modern, production-ready React frontend for the Grocery Mart e-commerce application.

## Features

- 🛒 Full shopping cart functionality
- 👤 User authentication (JWT)
- 📦 Product browsing and search
- 🎨 Premium UI with Tailwind CSS
- 📱 Fully responsive design
- 🔐 Admin dashboard for product/order management
- ⚡ Fast and smooth user experience

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CategoryCard.jsx
│   └── LoadingSpinner.jsx
├── context/         # Context providers
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── OrderSuccess.jsx
│   └── AdminDashboard.jsx
├── services/        # API services
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── cartService.js
│   ├── orderService.js
│   ├── wishlistService.js
│   ├── adminService.js
│   └── uploadService.js
├── utils/           # Utility functions
│   └── helpers.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend is fully integrated with the backend API:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`
- **Wishlist**: `/api/wishlist/*`
- **Admin**: `/api/admin/*`
- **Upload**: `/api/upload/*`

## Features Breakdown

### User Features
- Browse products with search and filters
- View product details
- Add to cart with quantity management
- Checkout with shipping address
- View order history
- Profile management

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Category management
- Order management with status updates

## Design System

- **Primary Color**: Green (#16a34a)
- **Background**: White / light gray
- **Font**: Inter
- **Style**: Modern, minimal, clean
- **Inspiration**: Zepto / Blinkit / BigBasket

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

## Notes

- Make sure the backend is running before starting the frontend
- Images are served from the backend at `/uploads`
- JWT tokens are stored in localStorage
- All protected routes require authentication
- Admin routes require admin role

## License

ISC
