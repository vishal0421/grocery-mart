import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We'll deliver your groceries soon.
        </p>

        <div className="space-y-4">
          <Link to="/Profile" className="btn-primary w-full inline-flex items-center justify-center gap-2">
            <ShoppingBag size={20} />
            
            View My Orders
          </Link>
          <Link to="/" className="btn-secondary w-full inline-flex items-center justify-center gap-2">
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
