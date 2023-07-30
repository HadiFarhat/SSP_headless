import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { useRouter } from 'next/router';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { customer, setCustomer, setCustomerCategories, fetchCustomerCategories, initialCategories } = useContext(CustomerContext);
  const isLoggedIn = Boolean(customer);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setCustomer(null);
    Cookies.remove('cartId');
    Cookies.remove('customer');
    Cookies.remove('pathToEntityId');
    //setCustomerCategories(initialCategories);
    handleClose();
    //router.replace(router.asPath)
  }

  const handleLogin = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
  
    if (data.data.login.result == "success") {
        const customerData = data.data.login.customer;
        setCustomer(customerData);
        Cookies.set('customer', JSON.stringify(customerData));
        //fetchCustomerCategories(customerData);
        //router.replace(router.asPath);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick} color="inherit">
        <AccountCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isLoggedIn ? (
          <>
            <MenuItem disabled>{`Logged in as ${customer.firstName}`}</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <form onSubmit={event => {
            event.preventDefault();
            handleLogin(event.target.email.value, event.target.password.value);
          }}>
            <MenuItem>
              <TextField type="email" name="email" placeholder="Email" required fullWidth />
            </MenuItem>
            <MenuItem>
              <TextField type="password" name="password" placeholder="Password" required fullWidth />
            </MenuItem>
            <MenuItem>
              <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
            </MenuItem>
          </form>
        )}
      </Menu>
    </div>
  );
}

export default UserMenu;
