import { Box, Typography, Card, CardMedia, IconButton, Stack, Button, Modal } from '@mui/material'
import React, { useContext, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Accordion from '@mui/material/Accordion';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { context } from '../App';

const CartItem = ({ book, isorder }) => {
    const { getQuantity, setcartBooks,isLoggedIn,profile } = useContext(context);
    const [open, setOpen] = useState(false);
    const handleRemoveFromCart = async (isbn) => {
        if (isLoggedIn) {
          try {
            const response = await fetch(`http://localhost:8000/cart/remove?userId=${profile.email}&isbn=${isbn}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              setcartBooks(prevItems => prevItems.filter(item => item.isbn !== isbn));
            }
          } catch (error) {
            console.error("Error removing book from cart:", error);
          }
        } else {
          // Remove from local state only if user is not logged in
          setcartBooks(prevItems => prevItems.filter(item => item.isbn !== isbn));
        }
        handleClose();
      };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 390,
        height: 200,
        bgcolor: 'background.paper',
        border: '2px solid #f0f0f0',
        boxShadow: 24,
        p: 3,
    };
    const { handleIncrement, handleDecrement } = useContext(context);
    const steps = [
        'ordered',
        'shipped',
        'out for delivery',
        'delivered'
    ];
    return (
        <>
        <Card sx={{
            display: 'flex',
            mb: 2,
            width: '100%',
            flexDirection: { xs: 'column'},
            p: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            '&:hover': { boxShadow: '3px 3px 3px rgb(190, 176, 196)' },
            border: '2px solid #e2d9d9'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%'
            }}>
                {/* Left section with image */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: { xs: '140px', sm: '160px' },
                    mr: 2,
                    cursor: 'pointer'
                }}>
                    <CardMedia
                        component="img"
                        sx={{
                            width: { xs: '120px', sm: '140px' },
                            height: { xs: '170px', sm: '180px' },
                            objectFit: 'fill'
                        }}
                        image={book.coverPhotoUrl}
                        alt={book.title}
                    />
                </Box>
                {/* Right section with details */}
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#212121',
                            mb: 0.5
                        }}
                    >
                        {book.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#878787',
                            mb: 1,
                            marginRight:{xs:'0',lg:'10px'}
                        }}
                    >
                        by {book.author}
                    </Typography>
                    {/* Price section */}
                        <Typography variant="body2" sx={{ fontWeight: 600,my:1 }}>
                            ₹{book.price}
                        </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <LocalShippingOutlinedIcon sx={{ color: '#878787', fontSize: 20 }} />
                        <Typography variant="body2" color="#878787" sx={{ fontSize: { xs: '10px', sm: '14px',lg:'13px' },marginRight:'10px' }}>
                            Delivery by {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Stack>
                    {/* Desktop Actions */}
                    {!isorder && <Box sx={{
                        mt: 2,
                        display: { xs: 'none', sm: 'flex' },
                        gap: 2
                    }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                p: 0.5
                            }}
                        >
                            <IconButton
                                onClick={() => handleDecrement(book.isbn)}
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
                                {getQuantity(book.isbn)}
                            </Typography>
                            <IconButton
                                onClick={() => handleIncrement(book.isbn)}
                                size="small"
                                sx={{ color: '#2874f0' }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Stack>
                        <Button
                            onClick={handleOpen}
                            startIcon={<DeleteOutlineIcon />}
                            sx={{
                                color: '#2874f0',
                                '&:hover': {
                                    background: 'transparent'
                                }
                            }}
                        >
                            REMOVE
                        </Button>
                    </Box>}
                </Box>
            </Box>
            {/* Mobile Actions */}
            {!isorder && <Box sx={{
                display: { xs: 'flex', sm: 'none' },
                gap: 2,
                mt: 2,
                borderTop: '1px solid #e0e0e0',
                pt: 2
            }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 0.5,
                        flex: 1,
                        justifyContent: 'center'
                    }}
                >
                    <IconButton
                        onClick={() => handleDecrement(book.isbn)}
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
                        {getQuantity(book.isbn)}
                    </Typography>
                    <IconButton
                        onClick={() => handleIncrement(book.isbn)}
                        size="small"
                        sx={{ color: '#2874f0' }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
                <Button
                    onClick={handleOpen}
                    startIcon={<DeleteOutlineIcon />}
                    sx={{
                        color: '#2874f0',
                        '&:hover': {
                            background: 'transparent'
                        },
                        flex: 1,
                        justifyContent: 'center'
                    }}
                >
                    REMOVE
                </Button>
            </Box>}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Remove Book</Typography>
                    <Typography id="modal-modal-title" variant="subtitle1" component="h2" color='gray'>
                        Are you sure that you want to remove this book?
                    </Typography>
                    <Stack direction='row' id="modal-modal-description" spacing={2} sx={{ mt: 2, display: 'flex' }}>
                        <Button variant='contained' sx={{ textTransform: 'none', flex: 1 }} onClick={() => handleRemoveFromCart(book.isbn)}>Remove</Button>
                        <Button variant='outlined' sx={{ textTransform: 'none', flex: 1 }} onClick={handleClose}>Cancel</Button>
                    </Stack>
                </Box>
            </Modal>
            {isorder && <Box sx={{marginTop:2,mx:1.4}}>
                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">Track you order</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stepper activeStep={1} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel><Typography variant='body1'>{label}</Typography></StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </AccordionDetails>
                </Accordion>
            </Box>}
        </Card>
        </>
    );
};

export default React.memo(CartItem);