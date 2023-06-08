import { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent } from "@mui/material";
import Header from "../components/Header";
import { CartProvider } from "../context/CartContext";


const Checkout = () => {
  const { storefrontcart } = useContext(CartProvider);
  const [companyname, setCompanyName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('companyname');
      setCompanyName(name);
    }
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
      <CartProvider>
        <Header name={companyname}/>
      </CartProvider>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Checkout
      </Typography>
      <Card variant="outlined" sx={{ backgroundColor: "#fafafa" }}>
        <CardContent>
          <iframe
            title="Checkout iframe"
            src={storefrontcart()}
            style={{ width: "100%", height: "500px", border: "none" }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Checkout;
