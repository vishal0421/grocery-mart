import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";

import { productService } from "../services/productService";
import { formatPrice, getImageUrl } from "../utils/helpers";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { wishlistService } from "../services/wishlistService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProduct(id);
        setProduct(response.product);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    addToCart(product._id, quantity);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update wishlist"
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <Link
            to="/products"
            className="px-5 py-3 rounded-xl bg-emerald-600 text-white"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-4">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-gray-50 to-gray-100">

              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full aspect-square object-cover hover:scale-105 transition-all duration-500"
              />

              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-5 left-5 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
                  Only {product.stock} left
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          <div>

            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-gray-500 ml-2">(4.8 Rating)</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-4xl font-extrabold text-emerald-600 mb-6">
              {formatPrice(product.price)}
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">

              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-green-500 flex items-center justify-center mb-3">
                  <Truck className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold">Fast Delivery</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500 flex items-center justify-center mb-3">
                  <Shield className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold">Quality Assured</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500 flex items-center justify-center mb-3">
                  <RefreshCw className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold">Fresh Stock</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">

              <div className="flex items-center bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() =>
                    quantity > 1 && setQuantity(quantity - 1)
                  }
                  className="p-4 hover:bg-gray-50"
                >
                  <Minus size={18} />
                </button>

                <span className="px-6 font-bold text-lg">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    quantity < product.stock &&
                    setQuantity(quantity + 1)
                  }
                  className="p-4 hover:bg-gray-50"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 min-w-[220px] py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold shadow-lg"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Add To Cart
                </span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-500"
              >
                <Heart
                  size={22}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6">

              <h3 className="text-2xl font-bold mb-5">
                Product Details
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold">
                    {product.category?.name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Stock</span>
                  <span className="font-semibold text-emerald-600">
                    {product.stock} Available
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">SKU</span>
                  <span className="font-semibold">
                    GM-{product._id.slice(-6).toUpperCase()}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
