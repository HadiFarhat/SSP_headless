import EuroIcon from "@mui/icons-material/Euro";
import CategoryIcon from "@mui/icons-material/Category";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { CartContext } from "../context/CartContext";
import React, { useState, useContext } from 'react';


export default function ProductCard({ product }) {

  // Access addToCart from CartContext
  const { addToCart } = useContext(CartContext);

  // Function to generate random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Use the function to generate a random color
  const randomColor = getRandomColor();

  return (
    <div
      className="product-card d-flex flex-column bg-white rounded-xl shadow-lg overflow-hidden position-relative"
      style={{ borderRadius: "20px" }}
    >
      <div className="d-flex flex-column justify-content-between p-3 h-100">
        <div className="mb-3" style={{ height: "50px" }}>
          <p className="h4 font-weight-bold text-dark mb-2">{product.name}</p>
          <p className="small font-weight-bold text-muted mb-0">
            Reference: {product.sku}
          </p>
        </div>
        <div style={{ height: "100px" }}>
          <p
            className="text-muted"
            style={{ maxHeight: "100px", overflow: "hidden" }}
          >
            {product.description}
          </p>
        </div>
        <div className="d-flex flex-column justify-content-between align-items-start mt-3">
          <div className="flex-shrink-0 mb-2">
            {/* Apply random color as background */}
            <span
              className="small text-white p-1 rounded"
              style={{ backgroundColor: randomColor }}
            >
              {product.adjective}
            </span>
          </div>
          <div className="d-flex justify-content-between w-100 mb-2">
            <p className="h5 font-weight-bold text-primary mb-1 d-flex align-items-center">
              <EuroIcon className="mr-2" /> {product.price}
            </p>
            <Button
              variant="contained"
              color="primary"
              style={{
                minWidth: "40px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
              onClick={() => addToCart(product)} // Add product to cart on click
            >
              <AddShoppingCartIcon />
            </Button>
          </div>
          <div className="d-flex text-muted small align-items-center engrave-effect">
            <CategoryIcon className="mr-2" />
            <time dateTime="2020-03-16">{product.material}</time>
          </div>
        </div>
      </div>
    </div>
  );
}
