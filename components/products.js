// Products.js
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function Products({ selectedAttributes }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/searchproducts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAttributes }),
      });

      const data = await res.json();
      setProducts(data.products);
    };

    fetchProducts();
  }, [selectedAttributes]);

  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}
