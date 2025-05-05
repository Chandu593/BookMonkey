import React, { useContext, useState } from 'react';
import { Box, TextField, Card, Typography, Button, Modal, CircularProgress } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { context } from '../App';

function Paymentpage() {
    const navigate = useNavigate();
    const { cartBooks, setcartBooks, setorders, calculatePriceDetails, isLoggedIn, profile } = useContext(context);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const priceDetails = calculatePriceDetails();
    const totalAmount = priceDetails.totalAmount || 0;
    const handleChange = (field) => (event) => {
        let value = event.target.value;

        // Format card number with spaces
        if (field === 'number') {
            value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
        }

        // Format expiry date
        if (field === 'expiry') {
            value = value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            value = value.substring(0, 5); // Limit to MM/YY format
        }

        // Limit CVV to 3 digits
        if (field === 'cvv') {
            value = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardDetails(prev => ({ ...prev, [field]: value }));
    };
    const handlePayment = async () => {
        if (isLoggedIn) {
            try {
                const response = await fetch('http://localhost:8000/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: profile.email,
                        items: cartBooks.map(item => ({
                            ...item,
                            orderDate: new Date().toISOString(),
                            status: "Not delivered",
                            expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            }),

                            // title: item.title,
                            // price: item.price,
                            // quantity: item.quantity
                            // coverphotourl, author, avgrating, title, price, isbn,
                        }))
                    }),
                });
                const result = await response.json();
                console.log("my orders", result);
                if (response.status === 201) {
                    setLoading(true);
                    setOpenModal(true);
                    // Simulate payment processing
                    setTimeout(() => {
                        setLoading(false);
                        // Show success animation for 2.5 seconds before redirecting
                        setTimeout(() => {
                            setOpenModal(false);
                            // Handle successful payment
                            const newOrders = cartBooks.map(item => ({
                                item: item,
                                orderDate: new Date().toLocaleDateString('en-GB', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                }).replace(/ (\d{4})$/, ',$1'),
                                status: "Not delivered",
                                expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                }),
                            }));
                            console.log(newOrders)
                            setorders(prevOrders => [...prevOrders, ...newOrders]);
                            setcartBooks([]);
                            navigate('/orders');
                        }, 2500);
                    }, 3500);
                }
            } catch (error) {
                console.log("error placing your order: " + error)
            }
        }
        else {
            setLoading(true);
            setOpenModal(true);
            // Simulate payment processing
            setTimeout(() => {
                setLoading(false);
                // Show success animation for 2.5 seconds before redirecting
                setTimeout(() => {
                    setOpenModal(false);
                    // Handle successful payment
                    const newOrders = cartBooks.map(item => ({
                        item: item,
                        orderDate: new Date().toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        }).replace(/ (\d{4})$/, ',$1'),
                        status: "Not delivered",
                        expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        }),
                    }));
                    setorders(prevOrders => [...prevOrders, ...newOrders]);
                    setcartBooks([]);
                    navigate('/orders');
                }, 2500);
            }, 3500); // Processing time
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            p: 3
        }}>
            <Box sx={{ maxWidth: 600, width: '100%' }}>
                {/* Credit Card Display */}
                <Box sx={{
                    mb: 4,
                    perspective: '1000px',
                    height: 230,
                    position: 'relative'
                }}>
                    <Box
                        onMouseEnter={() => setIsCardFlipped(true)}
                        onMouseLeave={() => setIsCardFlipped(false)}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.8s',
                            transformStyle: 'preserve-3d',
                            transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            cursor: 'pointer'
                        }}
                    >
                        {/* Front of Card */}
                        <Card sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            p: 3
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}>
                                <CreditCardIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6">VISA</Typography>
                            </Box>

                            <Box sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Typography variant="h5" sx={{
                                    letterSpacing: 4,
                                    textAlign: 'left',
                                    mb: 3
                                }}>
                                    {cardDetails.number || '•••• •••• •••• ••••'}
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end'
                                }}>
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            Card Holder
                                        </Typography>
                                        <Typography>
                                            {cardDetails.name || 'YOUR NAME'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            Expires
                                        </Typography>
                                        <Typography>
                                            {cardDetails.expiry || 'MM/YY'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>

                        {/* Back of Card */}
                        <Card sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: 'linear-gradient(135deg, #1557b0 0%, #1a73e8 100%)',
                            color: 'white'
                        }}>
                            <Box sx={{
                                width: '100%',
                                height: '50px',
                                bgcolor: '#111',
                                mt: 3
                            }} />
                            <Box sx={{ p: 3 }}>
                                <Box sx={{
                                    bgcolor: '#fff',
                                    height: '40px',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    px: 2,
                                    mt: 2,
                                    color: '#000',
                                    position: 'relative'
                                }}>
                                    <Typography sx={{
                                        position: 'absolute',
                                        left: 10,
                                        color: '#666',
                                        fontSize: '0.8rem'
                                    }}>
                                        CVV
                                    </Typography>
                                    <Typography sx={{ fontFamily: 'monospace' }}>
                                        {cardDetails.cvv || '•••'}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{
                                    display: 'block',
                                    mt: 2,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '0.7rem',
                                    textAlign: 'justify'
                                }}>
                                    This card is property of Wherever Bank. Misuse is criminal offense.
                                    If found, please return to Wherever Bank or to the nearest bank with
                                    MasterCard logo.
                                </Typography>
                            </Box>
                        </Card>
                    </Box>
                </Box>

                {/* Payment Form */}
                <Card sx={{ p: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', sm: '1.3rem' } }}>
                            Payment Details
                        </Typography>
                        <Box sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            py: 1,
                            px: 2,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', sm: '1.3rem' } }}>
                                Total Amount:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: { xs: '0.9rem', sm: '1.3rem' } }}>
                                ₹{totalAmount.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            value={cardDetails.number}
                            onChange={handleChange('number')}
                            placeholder="1234 5678 9012 3456"
                            autoComplete='true'
                            name='cardnumber'
                            slotProps={{
                                input: {
                                    startAdornment: <CreditCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Cardholder Name"
                            value={cardDetails.name}
                            onChange={handleChange('name')}
                            autoComplete='true'
                            name='cardholdername'
                            placeholder="John Doe"
                            slotProps={{
                                input: {
                                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Expiry Date"
                                value={cardDetails.expiry}
                                onChange={handleChange('expiry')}
                                autoComplete='true'
                                name='expirydate'
                                placeholder="MM/YY"
                                sx={{ width: '50%' }}
                                slotProps={{
                                    input: {
                                        startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }
                                }}
                            />
                            <TextField
                                label="CVV"
                                value={cardDetails.cvv}
                                onChange={handleChange('cvv')}
                                autoComplete='true'
                                name='cvv'
                                sx={{ width: '50%' }}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                placeholder="123"
                                slotProps={{
                                    input: {
                                        startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }
                                }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handlePayment}
                            sx={{
                                mt: 2,
                                bgcolor: '#1a73e8',
                                '&:hover': { bgcolor: '#1557b0' }
                            }}
                        >
                            Pay ₹{totalAmount.toFixed(2)}
                        </Button>
                    </Box>
                </Card>
            </Box>

            {/* Payment Processing Modal */}
            <Modal open={openModal} aria-labelledby="payment-processing-title" aria-describedby="payment-processing-description">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    bgcolor: 'background.paper',
                    p: 4
                }}>
                    {loading ? (
                        <>
                            <CircularProgress size={60} thickness={4} sx={{ color: '#1a73e8' }} />
                            <Typography variant="h5" sx={{ mt: 3, fontWeight: 'bold' }}>
                                Processing Payment...
                            </Typography>
                        </>
                    ) :
                        <>
                            <iframe
                                width={300}
                                height={300}
                                src="https://lottie.host/embed/eebbb687-2340-4063-a905-0abdd8e09ae6/iTxm5xZUqT.lottie"
                                title='Order placed'
                            />
                            <Typography variant='h5' sx={{ mt: -2, fontWeight: 'bold' }}>
                                Payment Successful!
                            </Typography>
                        </>}
                </Box>
            </Modal>
        </Box>
    );
}

export default React.memo(Paymentpage);