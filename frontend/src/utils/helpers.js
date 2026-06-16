export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

export const getImageUrl = (filename) => {
  if (!filename) return '/placeholder.jpg';
  if (filename.startsWith('http')) return filename;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${filename}`;
};
