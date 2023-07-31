import { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent, Link } from "@mui/material";
import Header from "../components/header.js";
import { CartContext, CartProvider } from "../context/CartContext.js";
import { CustomerContext } from '../context/CustomerContext'; // import the CustomerContext
import QRCode from "react-qr-code";

const Checkout = () => {
  const { storefrontCart } = useContext(CartContext);
  const [checkoutUrl, setCheckoutUrl] = useState(''); // New state variable

  useEffect(() => {
    const fetchStorefrontCart = async () => {
      const src = await storefrontCart();
      setCheckoutUrl(src); // Store the checkout URL in state instead of redirecting
    };

    fetchStorefrontCart();
  }, [storefrontCart]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" 
    padding={2} 
    style={{ 
      border: "5px solid black", 
      borderRadius: "25px", 
      height: "90vh", 
      maxWidth: "500px",
      margin: "auto",
      marginTop: "5vh",
      backgroundColor: "#fafafa",
    }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Scan the QR code or click the link below to checkout:</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginTop={2}>
            <QRCode value={checkoutUrl} />
            <Link href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: '10px' }}>Go to Checkout</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const WrappedCheckout = () => {
  const { setCustomer } = useContext(CustomerContext); // Use setCustomer from CustomerContext

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "20px",
        border: "5px solid black",
        borderRadius: "15px",
        boxShadow: "5px 10px 8px #888888",
        background: "lightgray",
        width: "900px",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          height: "100%",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <CartProvider>
          <Header name={"Kiosk Web App"} onUserChange={setCustomer}/>
          <Checkout />
        </CartProvider>
      </div>
    </div>
  )
};

export default WrappedCheckout;
