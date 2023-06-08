import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_ENDPOINT = "https://carts-middleware.vercel.app";
//const API_ENDPOINT = "http://localhost:8080";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  const createCart = async (product) => {
    const { data } = await axios.post(`${API_ENDPOINT}/createcart`, {
      custom_items: [
        {
          name: product.name,
          sku: product.sku,
          list_price: parseFloat(product.price),
          quantity: 1,
        },
      ],
    });
    var cartdata = JSON.parse(data.message).data;
    const cartId = cartdata.id;
    Cookies.set("cartId", cartId, { expires: 7 });
    return data;
  };

  const addToExistingCart = async (product) => {
    const cartId = Cookies.get("cartId");
    const { data } = await axios.post(`${API_ENDPOINT}/addtocart`, {
      id: cartId,
      name: product.name,
      sku: product.sku,
      list_price: parseFloat(product.price),
      quantity: 1,
    });
    console.log(JSON.stringify(data.message));
    Cookies.set("cartId", JSON.parse(data.message).data.id, { expires: 7 });
    return data;
  };

  const addToCart = (product) => {
    let cartId = Cookies.get("cartId");
    if (!cartId) {
      setCurrentProduct({ product, action: createCart });
    } else {
      setCurrentProduct({ product, action: addToExistingCart });
    }
  };

  useEffect(() => {
    if (currentProduct) {
      (async () => {
        const data = await currentProduct.action(currentProduct.product);
        const updatedCart = JSON.parse(data.message).data.line_items
          .custom_items;
        setCart(updatedCart);
        console.log(cart);
      })();
    }
  }, [currentProduct]);

  const removeFromCart = async (product) => {
    const cartId = Cookies.get("cartId");
    const { data } = await axios.post(`${API_ENDPOINT}/removefromcart`, {
      id: cartId,
      itemId: findItemById(cart, product.sku),
    });
    const updatedCart = cart.filter((item) => item.sku !== product.sku);
    setCart(updatedCart);

    // if cart is empty, remove the cookie
    if (updatedCart.length === 0) {
      Cookies.remove("cartId");
    }
  };

  const updateCart = async (product, sku, quantity) => {
    if (quantity > 0) {
      const cartId = Cookies.get("cartId");
      const { data } = await axios.put(`${API_ENDPOINT}/updatecart`, {
        id: cartId,
        item: findItemById(cart, sku),
        quantity: quantity,
      });
      setCart(JSON.parse(data.message).data.line_items.custom_items);
    } else {
      removeFromCart(product);
    }
  };

  function findItemById(items, sku) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].sku === sku) {
        return items[i].id;
      }
    }
    return null;
  }

  const loadCart = async () => {
    const cartId = Cookies.get("cartId");
    if (cartId) {
      console.log(cartId)
      const response = await axios.get(`${API_ENDPOINT}/getcart`, {
        params: {
          id: cartId
        }
      });
      if (response) {
        const { data } = response;
        if (data.message.status === 400) {
          // If status is 400 and cartId cookie is present, remove the cartId cookie
          Cookies.remove("cartId");
        } else {
          const updatedCart = JSON.parse(data.message).data.line_items.custom_items;
          setCart(updatedCart);
        }
      }
    }
  };
  

  const storefrontCart = async () => {
    const cartId = Cookies.get("cartId");
    if (cartId) {
      console.log(cartId)
      const { data } = await axios.get(`${API_ENDPOINT}/getstorefrontcart`, {
        params: {
          id: cartId
        }
      });
      if (data) {
        //console.log(data)
        return JSON.parse(data.message).data.embedded_checkout_url
        //return "https://www.google.com"
      }
    }
  };

  // Call this function when the provider is first loaded
  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCart, loadCart, storefrontCart, }}
    >
      {children}
    </CartContext.Provider>
  );
};
