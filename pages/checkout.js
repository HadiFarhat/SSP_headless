import { useEffect, useState, useContext, useRef } from 'react';
import { Box, Typography, Card, CardContent } from "@mui/material";
import Header from "../components/header.js";
import { CartContext, CartProvider } from "../context/CartContext.js";

const Checkout = () => {
  const { storefrontCart } = useContext(CartContext);
  const [companyname, setCompanyName] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const iframeRef = useRef(null);

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

  useEffect(() => {
    const resizeIframe = () => {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
      }
    };

    const handleLoad = () => {
      resizeIframe();
    };

    window.addEventListener('resize', resizeIframe);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('resize', resizeIframe);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

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
            ref={iframeRef}
            title="Checkout iframe"
            src={iframeSrc}
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
