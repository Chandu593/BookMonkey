import React, { useState } from 'react'
import { Button, Rating, Typography, Box, Stack, IconButton, Snackbar, Alert, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../Global.css';
import { useContext } from 'react';
import { context } from '../App';
import { useNavigate } from 'react-router-dom';
function Bookpagecard({ coverPhotoUrl, author, avgrating, title, price, ismyshopcard, description, onEdit, onDelete, isbn, quantity = 1, liked = false, iswishlist = false, genre, language }) {
    const { handleAddToCart, handleIncrement, handleDecrement, getQuantity, getisaddedtocart, handlelike, handleunlike, getliked, setwishlistitems, isLoggedIn } = useContext(context);
    const isliked = getliked(isbn);
    const navigate = useNavigate();
    const isaddedtocart = getisaddedtocart(isbn);
    const handleEdit = () => {
        onEdit({ isbn, title, author, description, avgrating, genre, language, price });
    };
    const handleDelete = () => {
        onDelete(isbn);
    };
    const [Snackbaropen, setSnackbaropen] = useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbaropen(false);
    };
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [wishlistopen, setwishlistopen] = useState(false);
    const handlewishlistClose = () => setwishlistopen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 390,
        height: 130,
        bgcolor: 'background.paper',
        border: '2px solid #f0f0f0',
        boxShadow: 24,
        p: 3,
    };
    const handleMoveToCart = () => {
        if (!isLoggedIn) {
            setwishlistopen(true);
        }
        else {
            setwishlistitems(prev => prev.filter(item => item.isbn !== isbn));
            handleAddToCart({ isbn, title, author, price, coverPhotoUrl, avgrating, isaddedtocart:true, quantity });
            navigate('/cart');
        }
    }
    return (
        <>
            <Box sx={{ width: { xs: '95%', sm: '90%', md: '70%', lg: '60%' }, display: 'flex', flexDirection: 'row', flexWrap: { xs: 'wrap', sm: 'nowrap' }, border: '2px solid #e2d9d9', '&:hover': { boxShadow: '5px 5px 5px rgb(190, 176, 196)' } }} className="card mb-3">
                <Box sx={{ flexShrink: 0, flexBasis: { xs: '100%', sm: 'inherit' }, display: 'flex', placeContent: 'center' }} className="bookcardimg">
                    <img src={coverPhotoUrl ? coverPhotoUrl : 'https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180'} className="img-fluid rounded-start" alt={title} loading='lazy' />
                    {!isliked && !ismyshopcard && <IconButton sx={{ position: 'absolute', right: '10px', top: '10px', color: 'red', backgroundColor: 'white', border: '1px solid rgb(235, 195, 195)', '&:hover': { backgroundColor: 'white' } }} onClick={() => handlelike({ coverPhotoUrl, author, avgrating, title, price, isbn, liked,description })}><FavoriteBorderIcon /></IconButton>}
                    {isliked && !ismyshopcard && <IconButton sx={{ position: 'absolute', right: '10px', top: '10px', color: 'red', backgroundColor: 'white', border: '1px solid rgb(235, 195, 195)', '&:hover': { backgroundColor: 'white' } }} onClick={() => handleunlike({ coverPhotoUrl, author, avgrating, title, price, isbn, liked,description })}><FavoriteIcon className='liked' /></IconButton>}
                </Box>
                <Box sx={{ flexShrink: 2 }} className="card-body">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h5'sx={{fontSize:'1.3rem'}}>{title}</Typography>
                        {ismyshopcard && <Stack direction='row' spacing={1}>
                            <IconButton sx={{
                                minWidth: 'auto',
                                mr: 1,
                                color: 'primary.main',
                            }} onClick={handleEdit}><EditIcon /></IconButton>
                            <IconButton sx={{
                                minWidth: 'auto',
                                color: 'error.main',
                            }} onClick={handleOpen}><DeleteIcon /></IconButton>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="subtitle1" component="h2">
                                        Are you sure you want to delete the book?
                                    </Typography>
                                    <Stack direction='row' id="modal-modal-description" spacing={2} sx={{ mt: 2, position: 'absolute', right: '20px' }}>
                                        <Button variant='contained' sx={{ textTransform: 'none', borderRadius: 10 }} onClick={handleDelete}>Yes</Button>
                                        <Button variant='outlined' sx={{ textTransform: 'none', borderRadius: 10 }} onClick={handleClose}>No</Button>
                                    </Stack>
                                </Box>
                            </Modal>
                        </Stack>}
                    </Box>
                    <Typography variant='body1'my={0.1}>by {author}</Typography>
                    <Typography variant='subtitle2' className="card-text"color='text.secondary' sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
                        {description || 'No description available '}</Typography>
                    <p className="card-text" style={{ marginBlock: 8,fontSize:"0.96rem" }}>&#x20B9;{price}</p>
                    <Rating name="size-medium" defaultValue={2} value={avgrating} precision={0.5} readOnly sx={{ mb: 1.5,fontSize:"1.3rem" }} /><br />
                    {!ismyshopcard && !iswishlist && (!isaddedtocart ? <Button sx={{fontSize:"0.8rem"}} size="medium" variant='contained' onClick={() => {
                            handleAddToCart({ isbn, title, author, price, coverPhotoUrl, avgrating, isaddedtocart, quantity });
                            setSnackbaropen(true);
                    }} >
                        Add to cart
                    </Button> : <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            py: 0.2,
                            px: 0.5,
                            width: 'max-content'
                        }}
                    >
                        <IconButton
                            onClick={() => {
                                handleDecrement(isbn);
                                if (getQuantity(isbn) === 1) { setSnackbaropen(true); }
                            }}
                            size="small"
                            sx={{ color: '#2874f0' }}
                        >
                            <RemoveIcon />
                        </IconButton>
                        <Typography sx={{
                            px: 2,
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
                    </Stack>)
                    }
                    {iswishlist && <Button variant='contained' size='medium' onClick={handleMoveToCart}>Move to cart</Button>}
                    {iswishlist && <Modal
                        open={wishlistopen}
                        onClose={handlewishlistClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="subtitle1" component="h2" color='gray'>
                                Please login to move to cart
                            </Typography>
                            <Stack direction='row' id="modal-modal-description" spacing={2} sx={{ mt: 2, display: 'flex' }}>
                                <Button variant='contained' sx={{ textTransform: 'none', flex: 1 }} onClick={() => navigate('/login')}>Login</Button>
                                <Button variant='outlined' sx={{ textTransform: 'none', flex: 1 }} onClick={() => navigate('/register')}>Register</Button>
                            </Stack>
                        </Box>
                    </Modal>}
                    <Snackbar open={Snackbaropen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                        <Alert
                            onClose={handleSnackbarClose}
                            severity={'success'}
                            variant="filled"
                        >
                            {!isaddedtocart ? 'Book added to cart' : 'Book removed from cart'}
                        </Alert>
                    </Snackbar>
                </Box>
            </Box>
        </>
    )
}

export default React.memo(Bookpagecard);
