import { Box, Typography, Button, Stack, Modal } from '@mui/material'
import React, { useContext,useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import CartItem from './CartItem'
import { context } from '../App';

function Cart() {
    const { cartBooks,isLoggedIn, calculatePriceDetails, profile } = useContext(context);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 390,
        height: 'max-content',
        bgcolor: 'background.paper',
        border: '2px solid #f0f0f0',
        boxShadow: 24,
        p: 3,
    };
    const handlePlaceOrder = () => {
        if (!isLoggedIn) {
            setOpen(true);
        } else {
            navigate('/payment');
        };
    };
    const priceDetails = calculatePriceDetails();
    return (
        <Box sx={{
            p: 3,
            bgcolor: '#f1f3f6',
            minHeight: '100vh'
        }}>
            {cartBooks.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '85vh' }}>
                    <iframe width={370} height={370} src="https://lottie.host/embed/b7f04671-a24a-4447-8f76-1f9934fd5b4d/QxzaucKX4l.lottie" title='Cart empty' />
                    <h1 className='anim'>Your cart is empty</h1>
                    <NavLink to='/bookpage'>
                        <Typography variant='h6' mt={2} sx={{ fontSize: { xs: 18, md: 20 } }}>
                            Add some books to your cart
                        </Typography>
                    </NavLink>
                </Box>
            ) : (
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    maxWidth: 1200,
                    mx: 'auto'
                }}>
                    {/* Cart Items Container */}
                    <Box sx={{
                        flex: { xs: '1', md: '0.7' },
                        bgcolor: 'white',
                        borderRadius: 1,
                        p: 2,
                        paddingBottom: 0.5
                    }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, width: '100%', p: 2, border: '2px solid #e2d9d9', borderRadius: 1, fontSize: { md: 14, xs: 12 } }}>Deliver to:
                            <Box sx={{ fontWeight: 'bold', fontSize: { md: 15, xs: 12 } }}> {profile.address}, {profile.pincode}</Box></Box>
                        {cartBooks.map(item => (
                            <CartItem key={item.isbn} book={item} />
                        ))}
                        {console.log(cartBooks)}
                    </Box>

                    {/* Price Details Card */}
                    <Box sx={{
                        flex: { xs: '1', md: '0.3' },
                        bgcolor: 'white',
                        borderRadius: 1,
                        p: 2,
                        height: 'fit-content',
                        position: { md: 'sticky' },
                        top: { md: 70 }
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                pb: 2,
                                borderBottom: '1px solid #f0f0f0',
                                color: '#878787',
                                fontWeight: 500,
                                fontSize: '16px'
                            }}
                        >
                            PRICE DETAILS
                        </Typography>
                        <Box sx={{ py: 2, paddingBottom: 1 }}>
                            <Stack spacing={2}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography>Price ({cartBooks.length > 1 ? cartBooks.length + ' items' : cartBooks.length + ' item'})</Typography>
                                    <Typography>₹{priceDetails.totalMRP}</Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography>Discount</Typography>
                                    <Typography color="green">- ₹{priceDetails.totalDiscount}</Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography>Delivery Charges</Typography>
                                    {priceDetails.deliveryCharges === 0 ? (
                                        <Typography color="green" variant='subtitle1'>FREE</Typography>
                                    ) : (
                                        <Typography>₹{priceDetails.deliveryCharges}</Typography>
                                    )}
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderTop: '1px dashed #e0e0e0',
                                    borderBottom: '1px dashed #e0e0e0',
                                    py: 2,
                                    my: 1
                                }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>Total Amount</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>₹{priceDetails.totalAmount}</Typography>
                                </Box>
                                <Typography
                                    color="green"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: '14px'
                                    }}
                                >
                                    You will save ₹{priceDetails.totalDiscount} on this order
                                </Typography>
                            </Stack>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                bgcolor: '#fb641b',
                                py: 1.5,
                                fontWeight: 'bold'
                            }}
                            onClick={handlePlaceOrder}
                        >
                            Buy now
                        </Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="subtitle1" component="h2" color='gray'>
                                    Please login to place your order
                                </Typography>
                                <Stack direction='row' id="modal-modal-description" spacing={2} sx={{ mt: 2, display: 'flex' }}>
                                    <Button variant='contained' sx={{ textTransform: 'none', flex: 1 }} onClick={() => navigate('/login')}>Login</Button>
                                    <Button variant='outlined' sx={{ textTransform: 'none', flex: 1 }} onClick={() => navigate('/register')}>Register</Button>
                                </Stack>
                            </Box>
                        </Modal>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default React.memo(Cart);