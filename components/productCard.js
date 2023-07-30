import EuroIcon from "@mui/icons-material/Euro";
import CategoryIcon from "@mui/icons-material/Category";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CartContext } from "../context/CartContext";
import React, { useContext, useState } from 'react';

export default function ProductCard({ product }) {
  // Access addToCart from CartContext
  const { addToCart } = useContext(CartContext);

  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState(product);

  // Handle variant click
  const handleVariantClick = (variant) => {
    setSelectedVariant(prevState => ({
      ...prevState,
      name: variant.name,
      ventityId: variant.entityId,
      sku: variant.sku,
      defaultImage: variant.defaultImage,
      prices: variant.prices,
    }));
  }

  return (
    <div
      className="product-card d-flex flex-column bg-white rounded-xl shadow-lg overflow-hidden position-relative"
      style={{ borderRadius: "20px" }}
    >
      <img src={selectedVariant.defaultImage?.url || product.defaultImage.urlOriginal} alt={selectedVariant.name || product.name} style={{ height: '200px', objectFit: 'contain' }} />
      <div className="d-flex flex-column justify-content-between p-3 h-100">
        <div className="mb-3">
          <p className="h4 font-weight-bold text-dark mb-2">{selectedVariant.name || product.name}</p>
          <p className="small font-weight-bold text-muted mb-0">
            SKU: {selectedVariant.sku || product.sku}
          </p>
          <p className="h5 font-weight-bold text-primary mb-1 d-flex align-items-center">
            {selectedVariant.prices?.price.value || product.prices.price.value} {selectedVariant.prices?.price.currencyCode || product.prices.price.currencyCode}
          </p>
        </div>
        <div className="d-flex flex-row flex-nowrap overflow-auto mb-2">
          {product.variants.edges.map(variant => (
            <div key={variant.node.entityId} onClick={() => handleVariantClick(variant.node)} style={{ marginRight: '10px', flex: 'none' }}>
              <img src={variant.node.defaultImage?.url || product.defaultImage.urlOriginal} alt={variant.node.sku} style={{ height: '50px', width: '50px', objectFit: 'contain' }} />
              {variant.node.options.edges.map(option => (
                <p>{option.node.values.edges[0].node.label}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between w-100 mb-2">
          <Button
            variant="contained"
            color="primary"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
            onClick={() => addToCart(JSON.stringify(selectedVariant))} // Add selected variant to cart on click
          >
            <AddShoppingCartIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
