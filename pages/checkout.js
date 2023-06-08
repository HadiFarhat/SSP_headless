import { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent } from "@mui/material";
import Header from "../components/header.js";
import { CartContext, CartProvider } from "../context/CartContext.js";

const Checkout = () => {
  const { storefrontCart } = useContext(CartContext);
  const [companyname, setCompanyName] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('companyname');
      setCompanyName(name);
    }

    // Call storefrontCart async function and update iframeSrc state
    const fetchStorefrontCart = async () => {
      const src = await storefrontCart();
      setIframeSrc(src);
    };

    fetchStorefrontCart();
  }, [storefrontCart]);

  return (
    <Box
      sx={{
        padding: 2,
        maxHeight: "60vh",
        overflowY: "auto",
        fontSize: "0.8rem",
      }}
    >
      <Header name={companyname}/>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Checkout
      </Typography>
      <Card variant="outlined" sx={{ backgroundColor: "#fafafa" }}>
        <CardContent>
          <iframe
            title="Checkout iframe"
            src={iframeSrc}  // Updated iframe src
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

const WrappedCheckout = () => (
  <CartProvider>
    <Checkout />
  </CartProvider>
);

export default WrappedCheckout;
