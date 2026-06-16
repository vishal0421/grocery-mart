import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/products?category=${category._id}`} className="block">
      <div className="card overflow-hidden group">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={getImageUrl(category.image)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-base sm:text-lg">{category.name}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
