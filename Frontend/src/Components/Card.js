import * as React from 'react';
import {Typography, Button, Stack, IconButton, Rating, Card, CardContent, CardMedia, CardActionArea, CardActions } from '@mui/material'
import '../Global.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { context } from '../App';

function MultiActionAreaCard({ coverPhotoUrl, author, avgrating, title, price, isbn }) {
  const { handleAddToCart, handleIncrement, handleDecrement, getisaddedtocart, getQuantity, handlelike, handleunlike, getliked } = React.useContext(context);
  const isliked = getliked(isbn);
  return (
    <Card sx={{ '&:hover': { boxShadow: '5px 5px 5px rgb(190, 176, 196)', cursor: 'pointer' }, height: '310px', display: 'flex', placeItems: 'center', flexDirection: 'column', marginBottom: 1 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          loading='lazy'
          image={coverPhotoUrl}
          alt={title}
          sx={{ backgroundColor: '#c1d545' }}
        />
        <CardContent sx={{ marginY: -1.5, display: 'flex', placeItems: 'center', flexDirection: 'column', fontWeight: 'bold' }}>
          <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: 13, md: 14.5 } }} >
            {author.split(',')[0]}
          </Typography>
          <Rating sx={{fontSize:"1.2rem"}} name="size-medium" defaultValue={2} value={avgrating} precision={0.5} readOnly />
          <Typography variant='subtitle1' sx={{ marginBottom: -1.6,fontSize:"0.8rem" }}>₹{price}</Typography>
        </CardContent>
      </CardActionArea>
      {!isliked && <IconButton sx={{ position: 'absolute', right: '10px', top: '10px', color: 'red', backgroundColor: 'white', border: '1px solid rgb(235, 195, 195)', '&:hover': { backgroundColor: 'white' } }} onClick={() => handlelike({ coverPhotoUrl, author, avgrating, title, price, isbn, })}><FavoriteBorderIcon /></IconButton>}
      {isliked && <IconButton sx={{ position: 'absolute', right: '10px', top: '10px', color: 'red', backgroundColor: 'white', border: '1px solid rgb(235, 195, 195)', '&:hover': { backgroundColor: 'white' } }} onClick={() => handleunlike({ coverPhotoUrl, author, avgrating, title, price, isbn, })}><FavoriteIcon className='liked' /></IconButton>}
      <CardActions>
        {getisaddedtocart(isbn) ? <Stack
          direction="row"
          alignItems="center"
          spacing={0.1}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 0.1,
            width: 'max-content',
          }}
        >
          <IconButton
            onClick={() => handleDecrement(isbn)}
            size="small"
            sx={{ color: '#2874f0' }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{
            px: 1,
            minWidth: '40px',
            textAlign: 'center'
          }}>
            {getQuantity(isbn)}
          </Typography>
          <IconButton
            onClick={() => handleIncrement(isbn)}
            size="small"
            sx={{ color: '#2874f0' }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
          : <Button size="medium" variant='contained'sx={{fontSize:"0.8rem"}} onClick={() =>{
              handleAddToCart({ coverPhotoUrl, author, avgrating, title, price, isbn, isaddedtocart: true });
          }}>
            Add to cart
          </Button>}
      </CardActions>
    </Card>
  );
}
export default React.memo(MultiActionAreaCard);