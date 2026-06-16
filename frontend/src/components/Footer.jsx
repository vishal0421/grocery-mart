import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ background: 'linear-gradient(135deg, #0d2b1a 0%, #1a3d2b 60%, #0f2318 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <span className="text-white font-extrabold text-lg leading-tight block">Grocery Mart</span>
                <span className="text-emerald-400 text-xs tracking-wide">Fresh • Fast • Premium</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for fresh groceries and organic products. Quality you can trust, delivered fast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-5 text-xs uppercase tracking-widest text-emerald-400">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-600 group-hover:bg-emerald-400 transition-colors"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-5 text-xs uppercase tracking-widest text-emerald-400">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-emerald-400" />
                </div>
                <span>support@grocerymart.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-emerald-400" />
                </div>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-emerald-400" />
                </div>
                <span>123 Grocery Street, City</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold mb-5 text-xs uppercase tracking-widest text-emerald-400">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Facebook size={17} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Twitter size={17} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Instagram size={17} />
              </a>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/50">
              <p className="text-emerald-300 text-xs font-semibold mb-1">🌿 100% Fresh Guarantee</p>
              <p className="text-gray-400 text-xs">Farm to doorstep in under 30 mins</p>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; 2024 Grocery Mart. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-500 text-xs">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;