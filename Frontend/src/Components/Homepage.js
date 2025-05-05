import { Box, Button, Typography } from '@mui/material';
import Carousel1 from './Carousel1';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Homepage() {
  return (
    <>
      <Box component='div' className='home1'sx={{backgroundColor: '#f0f0f0',paddingY: {xs:5,sm:8,md:10},px:3,flexWrap:{xs:'wrap-reverse',md:'nowrap'}}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: {xs:'center'}, alignItems: {xs:'center',md:'flex-start'}, maxWidth: { xs: '650px', sm: '750px', md: '530px', lg: '590px' },paddingTop:{xs:1.5,md:0},gap:1 }}>
          <Typography variant='h2' sx={{    fontFamily: 'FlechaM', fontWeight: 'bold', fontSize: { xs: 26,sm:40, md: 60,lg:65 }, textAlign: { xs: 'center', sm: 'center', md: 'left', lg: 'left' } }}className='maintxt' >Discover Your Next Great Read</Typography>
          <Typography variant='h6' color='text.secondary' sx={{ textAlign: { xs: 'center', md: 'left', lg: 'left' },fontSize:{xs:13,sm:16,md:17,lg:18} }}>Uncover captivating stories, enriching knowledge, and endless<br /> inspiration in our curated collection of books.</Typography>
          <NavLink to='/bookpage'>
            <Button variant='contained' sx={{ backgroundColor: '#AE275F', color: 'white', borderRadius: 50, width:{xs:'190px',sm:'220px',md:'240px'}, fontSize: { xs: '16px',sm:'20px', md: '22px' }, textTransform: 'none',mt:1, '&:hover': { backgroundColor: '#f0f0f0', transition: 'background-color 0.6s ease', color: 'black', border: '3px solid #AE275F', paddingY: 0.5 } }}>
              Discover Books
            </Button>
          </NavLink>
        </Box>
        <img src='https://img.freepik.com/free-vector/online-library-isometric-composition-with-conceptual-images-opened-book-computer-windows-small-people-characters_1284-32385.jpg?ga=GA1.1.1405116162.1717250122&semt=ais_hybrid' alt='bookstore'  />
      </Box>
      <Carousel1 for='books' />
      <Carousel1 for='language' />
    </>
  );
}

export default React.memo(Homepage);
