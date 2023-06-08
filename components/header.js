import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Cart from "./cart";
import { CartContext } from "../context/CartContext";
import Link from 'next/link';

const Header = (props) => {
  const { cart } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // calculate total number of items in cart
  const totalItemsInCart = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );

  return (
    <AppBar position="static" style={{ borderRadius: "15px" }}>
      <Toolbar style={{ justifyContent: "space-between" }}>
      <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: 'none', color: 'white' }}>
  {props.name}
</Typography>
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={totalItemsInCart} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "10%",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Cart handleClose={handleClose} />
          </Box>
        </Modal>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
