import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_ENDPOINT = "https://ssp-middleware.vercel.app";
//const API_ENDPOINT = "http://localhost:8080";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  let isMasterProduct = true;

  const createCart = async (product) => {
    const customerCookie = Cookies.get("customer");
    let customer = null;

    if (customerCookie) {
      customer = JSON.parse(customerCookie);
    }

    let productdata = JSON.parse(product);
    if (productdata.ventityId) {
      isMasterProduct = false;
    }
    let lineitems;
    if (isMasterProduct) {
      lineitems = [
        {
          quantity: 1,
          product_id: productdata.entityId,
        },
      ];
    } else {
      lineitems = [
        {
          quantity: 1,
          product_id: productdata.entityId,
          variant_id: productdata.ventityId,
        },
      ];
    }
    if (customer) {
      lineitems[0]["customer"] = customer.entityId;
    }
    const { data } = await axios.post(`${API_ENDPOINT}/createcart`, {
      line_items: lineitems,
    });
    console.log(data.message);
    var cartdata = JSON.parse(data.message).data;
    const cartId = cartdata.id;
    Cookies.set("cartId", cartId, { expires: 7 });
    return data;
  };

  const addToExistingCart = async (product) => {
    const customerCookie = Cookies.get("customer");
    let customer = null;

    if (customerCookie) {
      customer = JSON.parse(customerCookie);
    }
    let productdata = JSON.parse(product);
    if (productdata.ventityId) {
      isMasterProduct = false;
    }
    let lineitems;
    if (isMasterProduct) {
      lineitems = [
        {
          quantity: 1,
          product_id: productdata.entityId,
        },
      ];
    } else {
      lineitems = [
        {
          quantity: 1,
          product_id: productdata.entityId,
          variant_id: productdata.ventityId,
        },
      ];
    }
    if (customer) {
      lineitems[0]["customer"] = customer.entityId;
    }
    const cartId = Cookies.get("cartId");
    const { data } = await axios.post(`${API_ENDPOINT}/addtocart`, {
      id: cartId,
      line_items: lineitems,
    });
    console.log(JSON.stringify(data.message));
    Cookies.set("cartId", JSON.parse(data.message).data.id, { expires: 7 });
    return data;
  };

  const addToCart = (product) => {
    let cartId = Cookies.get("cartId");
    if (!cartId) {
      setCurrentProduct({ product: product, action: createCart });
    } else {
      setCurrentProduct({ product: product, action: addToExistingCart });
    }
  };

  useEffect(() => {
    if (currentProduct) {
      (async () => {
        const data = await currentProduct.action(currentProduct.product);
        const updatedCart = JSON.parse(data.message).data.line_items
          .physical_items;
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
      setCart(JSON.parse(data.message).data.line_items.physical_items);
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
      //console.log(cartId)
      const response = await axios.get(`${API_ENDPOINT}/getcart`, {
        params: {
          id: cartId,
        },
      });
      if (response) {
        const { data } = response;
        if (JSON.parse(data.status) === 400) {
          // If status is 400 and cartId cookie is present, remove the cartId cookie
          Cookies.remove("cartId");
        } else {
          const updatedCart = JSON.parse(data.message).data.line_items
            .physical_items;
          setCart(updatedCart);
        }
      }
    }
  };

  const storefrontCart = async () => {
    const cartId = Cookies.get("cartId");
    const customerCookie = Cookies.get("customer");
    let customer = 0;

    if (customerCookie) {
      customer = JSON.parse(customerCookie).entityId;
    }
    if (cartId) {
      console.log(cartId);
      const { data } = await axios.get(`${API_ENDPOINT}/getstorefrontcart`, {
        params: {
          id: cartId,
          customerId:customer
        },
      });
      if (data) {
        //console.log(data)
        return data.message;
      }
    }
  };

  // Call this function when the provider is first loaded
  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCart,
        loadCart,
        storefrontCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
