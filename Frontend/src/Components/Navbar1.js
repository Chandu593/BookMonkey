import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import StoreIcon from '@mui/icons-material/Store';
import { Badge, Tooltip, useMediaQuery } from '@mui/material';
import '../Global.css';
import { NavLink} from 'react-router-dom';
import { Button } from '@mui/material';
import { context } from '../App';
const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

export default function Navbar1() {
  const { isLoggedIn,cartBooks } = React.useContext(context);
  const open = false;
  const [Isdraweropen, setIsdraweropen] = React.useState(false);
  const isAbove600px = useMediaQuery('(min-width:600px)');
  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className='hop'>
          <div className='nav'>
            <div className='nav1'>
              <IconButton
                disableRipple
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                onClick={() => setIsdraweropen(true)}
              >
                <MenuIcon sx={{ fontSize: 30, color: 'black', marginLeft: -0.5, marginRight: -1 }} />
              </IconButton>
              <NavLink to='/' className='navlink' >
                <div className='nav1'>
                  <IconButton disableRipple>
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M480-60q-72-68-165-104t-195-36v-440q101 0 194 36.5T480-498q73-69 166-105.5T840-640v440q-103 0-195.5 36T480-60Zm0-104q63-47 134-75t146-37v-276q-73 13-143.5 52.5T480-394q-66-66-136.5-105.5T200-552v276q75 9 146 37t134 75Zm0-436q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-760q0-33-23.5-56.5T480-840q-33 0-56.5 23.5T400-760q0 33 23.5 56.5T480-680Zm0-80Zm0 366Z" /></svg>
                  </IconButton>
                  <Typography variant="h5" noWrap component="div" sx={{ paddingY: '15px', color: 'black', fontFamily: '"Leckerli One", serif', marginLeft: -1.1, '&:hover': { cursor: 'pointer' } }}>
                    BookMonkey<sup>TM</sup>
                  </Typography>
                </div>
              </NavLink>
            </div>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {isLoggedIn && <Box sx={{ display: 'flex',  gap: 1, justifyContent: 'end' }}>
                <Tooltip title='Profile' placement="bottom" arrow slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 5],
                        },
                      },
                    ],
                  },
                 }}>
                 {isAbove600px? <NavLink to='/profile' className='navlink'><Button startIcon={<AccountCircleIcon/>}variant='contained'sx={{borderRadius:50, border: '2px solid #ae275f',fontSize: {sm:12,md:14},width:{sm:95,md:100},color:'black',backgroundColor:'white',textTransform:'none' }}>Profile</Button></NavLink>
                  :<NavLink to='/profile' className='navlink'> <AccountCircleIcon sx={{ fontSize:29, cursor: 'pointer',color:'#24262b' }} /></NavLink>}
               </Tooltip>
                <Tooltip title='Dark Mode' placement="bottom" arrow slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 5],
                        },
                      },
                    ],
                  },
                }}>
                  {isAbove600px?<Button startIcon={<DarkModeIcon/>}variant='contained'sx={{borderRadius:50, border: '2px solid #ae275f',fontSize: {sm:12,md:14},width:{sm:125,md:132},color:'black',backgroundColor:'white',textTransform:'none' }}>Dark Mode</Button>
                    :<DarkModeIcon sx={{ fontSize:30, cursor: 'pointer', color: '#24262b' }} />}
                </Tooltip>
              </Box>}
              {!isLoggedIn && <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, marginTop: 0.2 }}>
                <NavLink to='/login' className='navlink'><Button
                  variant="contained"
                  sx={{ backgroundColor: '#ffffff', color: 'black', border: '3px solid #AE275F', borderRadius: 50, paddingY: 0.5 }}
                >
                  Login
                </Button>
                </NavLink>
                <NavLink to='/register' className='navlink'><Button
                  variant="contained"
                  sx={{ backgroundColor: '#AE275F', color: 'white', borderRadius: 50 }}
                >
                  Sign Up
                </Button>
                </NavLink>
              </Box>}
              <Tooltip title='Cart' placement="bottom" arrow slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 5],
                      },
                    },
                  ],
                },
              }}><NavLink to='/cart' className='navlink'>  <Badge badgeContent={cartBooks.length} overlap="circular" showZero color="error"><ShoppingCartIcon sx={{ fontSize: {xs:25,md:'30px'}, color: '#24262b', marginTop: {xs:0.2,md:0.6},marginLeft:-1,marginBottom:{xs:0,sm:-1}, height: 28 }} /></Badge></NavLink></Tooltip>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        anchor='left'
        open={Isdraweropen}
        onClose={() => setIsdraweropen(false)}
      >
        <DrawerHeader sx={{ display: 'flex', justifyContent: 'left', flexDirection: 'column' }}>
          <Box className='nav1' sx={{ marginLeft: -8, marginTop: 0.8 }}>
            <IconButton
              disableRipple
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              disableFocusRipple
              onClick={() => setIsdraweropen(false)}
            >
              <MenuOpenIcon sx={{ fontSize: 31, color: 'black', marginLeft: 8.5, marginRight: -1 }} />
            </IconButton>
            <NavLink to='/' className='navlink' onClick={() => setIsdraweropen(false)}>
              <Box className='nav1' sx={{ marginTop: 0.3 }}>
                <IconButton disableRipple>
                  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M480-60q-72-68-165-104t-195-36v-440q101 0 194 36.5T480-498q73-69 166-105.5T840-640v440q-103 0-195.5 36T480-60Zm0-104q63-47 134-75t146-37v-276q-73 13-143.5 52.5T480-394q-66-66-136.5-105.5T200-552v276q75 9 146 37t134 75Zm0-436q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-760q0-33-23.5-56.5T480-840q-33 0-56.5 23.5T400-760q0 33 23.5 56.5T480-680Zm0-80Zm0 366Z" /></svg>
                </IconButton>
                <Typography variant="h5" noWrap component="div" sx={{ paddingY: '8px', color: 'black', fontFamily: '"Leckerli One", serif', marginLeft: -1.1, '&:hover': { cursor: 'pointer' } }}>
                  BookMonkey<sup>TM</sup>
                </Typography>
              </Box>
            </NavLink>
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2, paddingInline: 2.7, marginLeft: -0.4 }}>
            {!isLoggedIn && <NavLink to='/login' className='navlink'><Button onClick={() => setIsdraweropen(false)}
              variant="contained"
              sx={{ backgroundColor: '#ffffff', color: 'black', border: '2px solid #AE275F', width: 215 }}
            >
              Login
            </Button>
            </NavLink>}
            {!isLoggedIn && <NavLink to='/register' className='navlink'><Button onClick={() => setIsdraweropen(false)}
              variant="contained"
              sx={{ backgroundColor: '#AE275F', color: 'white', width: 215 }}
            >
              Sign Up
            </Button>
            </NavLink>}
          </Box>
        </DrawerHeader>
        <Divider />
        <List component='div' sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <NavLink to='/' className='navlink' > <ListItem key='Home' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton >
              <ListItemIcon >
                <HomeIcon sx={{ fontSize: '30px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/bookpage' className='navlink' > <ListItem key='BookPage' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton >
              <ListItemIcon >
                <MenuBookIcon sx={{ fontSize: '30px',width: '28px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='Discover Books' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/orders' className='navlink' > <ListItem key='Orders' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton>
              <ListItemIcon>
                <Inventory2Icon sx={{ fontSize: '28px', color: 'black', marginLeft: 0.1 }} />
              </ListItemIcon>
              <ListItemText primary='Orders' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/wishlist' className='navlink' > <ListItem key='Wishlist' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton>
              <ListItemIcon>
                <FavoriteIcon sx={{ fontSize: '30px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='Wishlist' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/cart' className='navlink' > <ListItem key='Cart' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ fontSize: '30px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='Cart' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/myshop' className='navlink'> <ListItem key='MyShop' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton>
              <ListItemIcon>
                <StoreIcon sx={{ fontSize: '30px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='MyShop' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/exchange' className='navlink' > <ListItem key='Exchange' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton>
              <ListItemIcon>
                <SwapHorizIcon sx={{ fontSize: '30px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='Exchange' />
            </ListItemButton>
          </ListItem></NavLink>
          <NavLink to='/profile'className='navlink'> <ListItem key='Profile' disablePadding onClick={() => setIsdraweropen(false)} className='menuicons'>
            <ListItemButton >
              <ListItemIcon>
                <AccountCircleIcon sx={{ fontSize: '30px', color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary='Profile' />
            </ListItemButton>
          </ListItem></NavLink>
        </List>
      </Drawer>
      <DrawerHeader />
      <Main open={open} sx={{ background: 'rgb(245, 243, 241)' }}>
      </Main>
    </Box>
    </>
  );
}