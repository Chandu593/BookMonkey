import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Card, Stack, Chip, Button, Modal, Stepper, Step, StepLabel, useTheme, useMediaQuery, Divider } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { context } from '../App';
import { NavLink } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import HomeIcon from '@mui/icons-material/Home';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Orders() {
    const { orders, profile, setorders, isLoggedIn, ordersFetched, setordersFetched } = useContext(context);
    const [open, setOpen] = useState(false);
    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);
    const handleClose = () => setOpen(false);
    const handleRating = () => {
        setOpen(true);
    }
    const labels = {
        1: 'Useless',
        2: 'Poor',
        3: 'Ok',
        4: 'Good',
        5: 'Excellent',
    };
    useEffect(() => {
        if (isLoggedIn && !ordersFetched) {
            const fetchOrders = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/orders?userId=${profile.email}`);
                    const result = await response.json();
                    console.log(result.orders?.items)
                    setorders(result.orders?.items || []);
                    setordersFetched(true);
                } catch (error) {
                    console.log("error fetching orders:", error.message);
                }
            };
            fetchOrders();
        }
        // eslint-disable-next-line
    }, [setorders]);

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 400 },
        height: 180,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
    };
    const modalBackdropStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Light white background
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = [
        {
            label: 'Ordered',
            icon: <InventoryIcon sx={{ fontSize: "2rem" }} />,
            date: '20 Mar 2024'
        },
        {
            label: 'Shipped',
            icon: <LocalShippingIcon sx={{ fontSize: "2rem" }} />,
            date: '21 Mar 2024'
        },
        {
            label: 'Out for Delivery',
            icon: <DeliveryDiningIcon sx={{ fontSize: "2rem" }} />,
            date: '22 Mar 2024'
        },
        {
            label: 'Delivered',
            icon: <HomeIcon sx={{ fontSize: "2rem" }} />,
            date: '22 Mar 2024'
        }
    ];

    const getActiveStep = (status) => {
        switch (status) {
            case 'ordered': return 0;
            case 'shipped': return 1;
            case 'out_for_delivery': return 2;
            case 'delivered': return 3;
            default: return 0;
        }
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f1f3f6', minHeight: '100vh' }}>
            <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    My Orders ({orders.length})
                </Typography>

                {/* Filters*/}
                <Stack
                    direction='row'
                    spacing={2}
                    sx={{ mb: 3, }}
                >
                    <Button variant="outlined" size="small" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>All Orders</Button>
                    <Button variant="outlined" size="small" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Not Yet Shipped</Button>
                    <Button variant="outlined" size="small" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Cancelled</Button>
                </Stack>

                {/* Orders List */}
                <Stack spacing={2}>
                    {/* Order orderItem.items */}
                    {orders.map((orderItem) => (
                        <Card key={orderItem.isbn} sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box
                                        component="img"
                                        src={orderItem.coverPhotoUrl}
                                        alt={orderItem.title}
                                        sx={{
                                            width: 100,
                                            height: 150,
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontSize: "0.9rem" }} >
                                            {orderItem.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }} >
                                            by {orderItem.author}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: "0.8rem", mt: 0.5 }}>
                                            ₹{orderItem.price}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontSize: "0.8rem" }}>
                                            Ordered On : {orderItem.orderedDate}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontSize: "0.8rem" }} >
                                            Quantity : {orderItem.quantity}
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            sx={{ mt: 1 }}
                                        >
                                            <LocalShippingOutlinedIcon
                                                sx={{ color: '#878787', fontSize: 20 }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                                                {orderItem.status === "Delivered"
                                                    ? `Delivered on ${orderItem.expectedDeliveryDate}`
                                                    : `Expected delivery by ${orderItem.expectedDeliveryDate}`
                                                }
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Box>
                                <Stack spacing={1} alignItems='center' sx={{ flex: { xs: '1 1', sm: 0 } }}>
                                    <Chip
                                        label={orderItem.status}
                                        color={orderItem.status === "Delivered" ? "success" : "primary"}
                                        size="small"
                                        sx={{ width: { xs: '100%', sm: 120 } }}
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<StarBorderIcon />}
                                        onClick={handleRating}
                                        sx={{ width: { xs: '100%', sm: 120 } }}
                                    >
                                        Rate
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ width: { xs: '100%', sm: 120 } }}
                                    >
                                        Return
                                    </Button>
                                </Stack>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    slotProps={{ backdrop: { style: modalBackdropStyle } }} // Add this line
                                >
                                    <Box sx={style}>
                                        <Typography variant='h6' textAlign='center' sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} mb={1}>How much would you rate this book?</Typography>
                                        <Rating
                                            size='large'
                                            name="hover-feedback"
                                            value={value}
                                            sx={{ fontSize: 50 }}
                                            getLabelText={getLabelText}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                            onChangeActive={(event, newHover) => {
                                                setHover(newHover);
                                            }}
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                        {value !== null && (
                                            <Box sx={{ textAlign: 'center', width: 350, fontSize: 20, mt: 1 }}>{labels[hover !== -1 ? hover : value]}</Box>
                                        )}
                                    </Box>
                                </Modal>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    <Typography component="span">Track Order</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ py: 1, px: 0 }}>
                                    <Stepper
                                        activeStep={getActiveStep(orderItem.status)}
                                        alternativeLabel={true}
                                        orientation={'horizontal'}
                                        sx={{
                                            '& .MuiStepLabel-label': {
                                                mt: isMobile ? 0 : 1,
                                            },
                                        }}
                                    >
                                        {steps.map((step, index) => (
                                            <Step key={step.label}>
                                                <StepLabel
                                                    StepIconComponent={() => (
                                                        <Box
                                                            sx={{
                                                                width: '2.4rem',
                                                                height: '2.4rem',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: index <= getActiveStep(orderItem.status)
                                                                    ? 'primary.main'
                                                                    : 'grey.300',
                                                                color: index <= getActiveStep(orderItem.status)
                                                                    ? 'white'
                                                                    : 'grey.600',
                                                            }}
                                                        >
                                                            {step.icon}
                                                        </Box>
                                                    )}
                                                >
                                                    <Box >
                                                        <Typography variant="body2" color="text.primary" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                                                            {step.label}
                                                        </Typography>
                                                    </Box>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </AccordionDetails>
                            </Accordion>
                        </Card>
                    ))}
                </Stack>

                {/* Empty State */}
                {orders.length === 0 && (
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                        <ErrorOutlineIcon sx={{ fontSize: 60, color: '#878787', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            No orders yet
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            When you place your first order, it will appear here
                        </Typography>
                        <NavLink to="/bookpage">
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#2874f0',
                                    '&:hover': { bgcolor: '#1c5ab0' }
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </NavLink>
                    </Card>
                )}
            </Box>
        </Box>
    );
}

export default React.memo(Orders);
