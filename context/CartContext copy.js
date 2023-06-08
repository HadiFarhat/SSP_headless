import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_ENDPOINT = "http://localhost:8080";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const existingCartId = Cookies.get("cartId");
  }, []);

  //   const createCart = async (product) => {
  //     const { data } = await axios.post(`${API_ENDPOINT}/createCart`, {
  //         name: product.name,
  //         sku: product.sku,
  //         price: product.price,
  //       });
  //     Cookies.set('cartId', data.id, { expires: 7 });
  //   };

  const addToCart = async (product) => {
    let cartId = Cookies.get("cartId");

    if (cartId === "undefined" || typeof(cart) === undefined || !cartId) {
      console.log("hello");
      //console.log(parseFloat(product.price))
      const { data } = await axios.post(`${API_ENDPOINT}/createcart`, {
        custom_items:[{
        "name": product.name,
        "sku": product.sku,
        "list_price": parseFloat(product.price),
        "quantity": 1
    }]});
      var cartdata = JSON.parse(data.message).data;
      cartId = cartdata.id;
      Cookies.set("cartId", cartId, { expires: 7 });
      setCart(JSON.parse(data.message).data.line_items.custom_items);
      console.log(cart)
    } else {
      const { data } = await axios.post(`${API_ENDPOINT}/addtocart`, {
        id: Cookies.get("cartId"),
        name: product.name,
        sku: product.sku,
        list_price: parseFloat(product.price),
        quantity: 1,
      });
      setCart([data]);
      console.log(JSON.parse(data.status))
      //Cookies.set("cartId", JSON.stringify(JSON.parse(data.message).data), { expires: 7 });
      console.log(cart)
      //console.log(JSON.parse(data.message)) // append the new product to the existing cart
    }
  };

  const removeFromCart = async (product) => {
    const cartId = Cookies.get("cartId");
    const { data } = await axios.post(`${API_ENDPOINT}/removeFromCart`, {
      cartId,
      sku: product.sku,
    });
    setCart(cart.filter((item) => item.sku !== data.sku));
  };

  const updateCart = async (sku, quantity) => {
    const cartId = Cookies.get("cartId");
    const { data } = await axios.post(`${API_ENDPOINT}/updateCart`, {
      cartId,
      sku,
      quantity,
    });
    setCart(cart.map((item) => (item.sku === data.sku ? data : item)));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
