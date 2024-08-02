import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './SNavbar.css';

const drawerWidth = 240;

const SNavbar = () => {
  const location = useLocation();

  const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    backgroundImage: `url('https://images.pexels.com/photos/3772353/pexels-photo-3772353.jpeg?auto=compress&cs=tinysrgb&w=600')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    fontFamily: 'Cursive, Arial, sans-serif',
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: drawerStyle,
      }}
    >
      <div className="admin-logo">Super Admin</div>
      <List>

        <ListItem button component={Link} to="/home/products">
          <ListItemText primary="Products" />
        </ListItem>
        {location.pathname.includes('/home/products') && (
          <div className="sub-nav">
            <ListItem button component={Link} to="/home/products/insert">
              <ListItemText primary="Insert Products" />
            </ListItem>
            <ListItem button component={Link} to="/home/products/view">
              <ListItemText primary="View Products" />
            </ListItem>
          </div>
        )}
        <ListItem button component={Link} to="/home/orders">
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/home/invoice">
          <ListItemText primary="Invoice" />
        </ListItem>
        <ListItem button component={Link} to="/home/accounts">
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem button component={Link} to="/home/register">
          <ListItemText primary="Register" />
        </ListItem>
        <ListItem button component={Link} to="/home/users">
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/home/logout">
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
      <Divider />
      
    </Drawer>
  );
};

export default SNavbar;
