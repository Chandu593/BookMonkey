import React, { useContext } from 'react';
import { Box, Typography, Avatar, Modal, Button, Stack, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { context } from '../App';
import ChatIcon from '@mui/icons-material/Chat';
import Tooltip from '@mui/material/Tooltip';
import { NavLink } from 'react-router-dom';
function Exchangebookcard({ book, handleDeleteExchange, ismyexchange, isexchangehistory, setShowExchangeForm, setBookToEdit }) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogClose = () => setDialogOpen(false);
    const { setGlobalexchangeBooks, setExchangeHistory, GlobalexchangeBooks, exchangeHistory, isLoggedIn, profile } = useContext(context);
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
    const handleConfirmExchange = async (book) => {
        if (!isLoggedIn) {
            setLoading(true);
            setDialogOpen(false);
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setGlobalexchangeBooks(GlobalexchangeBooks.filter(b => b.isbn !== book.isbn));
                    setExchangeHistory([...exchangeHistory, {
                        title: book.title,
                        author: book.author,
                        ownerName: book.ownerName,
                        isbn: book.isbn,
                        ownerId: book.ownerId,
                        condition: book.condition,
                        wantedBook: book.wantedBook,
                        wantedAuthor: book.wantedAuthor,
                        wantedisbn: book.wantedisbn,
                        wantedCondition: book.wantedCondition,
                    }]);
                }, 1000);
            }, 2000);
        } else {
            try {
                setLoading(true);
                setDialogOpen(false);
                const response = await fetch('http://localhost:8000/exchangehistory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: profile.email,
                        ownerId: book.ownerId,
                        bookId: book.isbn,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to confirm exchange');
                }
                const result = await response.json();
                setTimeout(() => {
                    setLoading(false);
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                        setGlobalexchangeBooks(prevBooks =>
                            prevBooks.filter(b => b.isbn !== book.isbn)
                        );
                        setExchangeHistory(prevHistory => [
                            ...prevHistory,
                            result.exchangedBook
                        ]);
                    }, 1000)
                }, 2000);
            } catch (error) {
                console.error('Error confirming exchange:', error);
                setLoading(false);
            }
        }
    };
    return (
        <>
            <Card
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: '1rem',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
                }}
                className='animate'
            >
                {!ismyexchange ? <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, borderBottom: '3px solid rgb(90, 164, 230)', pb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" color='text.secondary' sx={{ marginLeft: 0.3 }}>{isexchangehistory ? 'Exchanged with:' : 'Exchange with:'}</Typography>
                        <Tooltip title="View profile" placement="right" arrow>
                            <NavLink className='navlink' to={`/userprofile/${book.ownerId}`}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }}>
                                    <Avatar size='small' icon={<PersonIcon />} />
                                    <Typography variant="h6">{book.ownerName || 'Unknown'}</Typography>
                                </Stack></NavLink>
                        </Tooltip>
                    </Box>
                    {isexchangehistory ?
                        <Button startIcon={<ChatIcon />} variant="contained" size='small' sx={{ height: 'fit-content', fontSize: { xs: '0.7rem', sm: '1rem' } }}>
                            Chat
                        </Button>
                        :
                        <Button variant="contained" color='success' size='small' onClick={() => setDialogOpen(true)} disabled={loading || success} sx={{ height: 'fit-content', fontSize: { xs: '0.7rem', sm: '1rem' }, mb: { xs: 0.7, sm: 0 } }}>
                            {loading ? <CircularProgress size={30} /> : success ? <CheckCircleIcon color="success" sx={{ fontSize: 30 }} /> : 'Confirm Exchange'}
                        </Button>}
                </Box> :
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => {
                                setBookToEdit(book);
                                setShowExchangeForm(true);
                            }}
                            sx={{
                                minWidth: 'auto',
                                mr: 1,
                                color: 'primary.main',
                            }}
                        >
                            <EditIcon />
                        </Button>
                        <Button
                            onClick={() => setOpen(true)}
                            sx={{
                                minWidth: 'auto',
                                color: 'error.main',
                            }}
                        >
                            <DeleteIcon />
                        </Button>
                    </Box>}

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    divider={
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: { xs: '100%', sm: '2px' },
                                height: { xs: '2px', sm: 'auto' },
                                bgcolor: 'primary.main',
                                opacity: 0.3,
                                my: { xs: 2, sm: 0 },
                                mx: { xs: 0, sm: 2 }
                            }}
                        />
                    }
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                            Book to Exchange:
                        </Typography>
                        <Stack spacing={1}>
                            <Typography><strong>Title:</strong> {book.title}</Typography>
                            <Typography><strong>Author:</strong> {book.author}</Typography>
                            <Typography><strong>ISBN:</strong> {book.isbn}</Typography>
                            <Typography><strong>Condition:</strong> {book.condition}</Typography>
                        </Stack>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                            Wanted in Return:
                        </Typography>
                        <Stack spacing={1}>
                            <Typography><strong>Title:</strong> {book.wantedBook}</Typography>
                            <Typography><strong>Author:</strong> {book.wantedAuthor}</Typography>
                            <Typography><strong>ISBN:</strong> {book.wantedisbn}</Typography>
                            <Typography><strong>Minimum Condition:</strong> {book.wantedCondition}</Typography>
                        </Stack>
                    </Box>
                </Stack>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Remove Book</Typography>
                        <Typography id="modal-modal-title" variant="subtitle1" component="h2" color='gray' sx={{ fontSize: '1rem' }}>
                            Are you sure that you want to remove this book?
                        </Typography>
                        <Stack direction='row' id="modal-modal-description" spacing={2} sx={{ mt: 2, display: 'flex' }}>
                            <Button variant='contained' sx={{ textTransform: 'none', flex: 1 }} onClick={() => handleDeleteExchange(book.isbn)}>Remove</Button>
                            <Button variant='outlined' sx={{ textTransform: 'none', flex: 1 }} onClick={handleClose}>Cancel</Button>
                        </Stack>
                    </Box>
                </Modal>
                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="confirm-exchange-dialog-title"
                    aria-describedby="confirm-exchange-dialog-description"
                >
                    <DialogTitle id="confirm-exchange-dialog-title">Confirm Exchange</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-exchange-dialog-description">
                            Are you sure you want to exchange "{book?.title}" with {book?.ownerName}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleConfirmExchange(book)} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </>
    )
}
export default React.memo(Exchangebookcard);

