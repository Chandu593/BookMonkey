import React, { useEffect} from 'react';
import { Box, Typography, Card, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { context } from '../App';
import Bookpagecard from './Bookpagecard';

function Wishlist() {
    const navigate = useNavigate();
    const { wishlistitems,setwishlistitems,profile,isLoggedIn,wishlistFetched,setWishlistFetched } = React.useContext(context);

  useEffect(() => {
    if (isLoggedIn &&!wishlistFetched ) {
      const fetchWishlist = async () => {
        try {
          const response = await fetch(`http://localhost:8000/like?userId=${profile.email}`);
          const result = await response.json();
          console.log(result.wishlist.items);
          setwishlistitems(result.wishlist.items);
          setWishlistFetched(true);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };
      fetchWishlist();
    }
// eslint-disable-next-line
  }, [setwishlistitems,wishlistFetched]);
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'column', marginTop: 10, mb: 5 }}>
            <Box sx={{ width: { xs: '95%', sm: '90%', md: '70%' }, marginBottom: 3, marginTop: -6 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    My Wishlist ({wishlistitems.length} {wishlistitems.length === 1 ? 'item' : 'items'})
                </Typography>
            </Box>
            {/* Wishlist Items */}
            {wishlistitems.length > 0 ?
                wishlistitems.map((item) => (
                    <Bookpagecard key={Math.random()}
                        coverPhotoUrl={item.coverPhotoUrl}
                        author={item.author}
                        avgrating={item.avgrating}
                        title={item.title}
                        price={item.price}
                        isbn={item.isbn}
                        description={item.description}
                        iswishlist={true} />
                ))
                : (
                    // Empty Wishlist
                    <Card sx={{ p: 4, textAlign: 'center', width: { xs: '95%', sm: '90%', md: '70%', minHeight: '450px' } }}>
                        <iframe src="https://lottie.host/embed/acce3c01-770b-4446-af64-2815288320c0/WaPGwWHbqo.lottie" title="Empty Wishlist" width="200" height="200" />



                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Empty Wishlist
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            You have no items in your wishlist. Start adding!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/bookpage')}
                            sx={{
                                bgcolor: '#2874f0',
                                '&:hover': { bgcolor: '#1c5ab0' }
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Card>
                )}
        </Box>
    );
}

export default React.memo(Wishlist);