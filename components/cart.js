import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { CartContext } from "../context/CartContext";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Card, CardContent, Grid } from "@mui/material";
import Link from "next/link";
import Button from "@mui/material/Button";

const Cart = ({ handleClose }) => {
  const { cart, removeFromCart, updateCart } = useContext(CartContext);

  // Function to calculate total cart value
  const calculateTotal = () => {
    return cart.reduce(
      (total, product) => total + product.list_price * product.quantity,
      0
    );
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxHeight: "60vh",
        overflowY: "auto",
        fontSize: "0.8rem",
      }}
    >
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        Shopping Cart
      </Typography>
      <Grid item sm={1}>
        {cart.map((product, index) => (
          <Grid spacing={5}>
            <Card variant="outlined" sx={{ backgroundColor: "#fafafa" }}>
              <CardContent>
                <Typography variant="h6" component="div" color="primary">
                  {product.name}
                </Typography>
                <Typography color="textSecondary">
                  Price: ${product.list_price.toFixed(2)}
                </Typography>
                <Typography color="textSecondary">
                  Quantity: {product.quantity}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 2 }}
                >
                  <IconButton
                    onClick={() => removeFromCart(product)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      updateCart(product, product.sku, product.quantity + 1)
                    }
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      updateCart(product, product.sku, product.quantity - 1)
                    }
                    color="secondary"
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" component="div" sx={{ marginTop: "20px" }}>
        Total: ${calculateTotal().toFixed(2)}
      </Typography>
      <IconButton
        onClick={handleClose}
        sx={{ marginTop: "20px" }}
        color="secondary"
      >
        <CloseIcon />
      </IconButton>
      <Button
        component={Link}
        href="/checkout"
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px" }}
        disabled={cart.length === 0} // this disables the button when the cart is empty
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default Cart;
