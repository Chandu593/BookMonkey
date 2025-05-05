import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { context } from '../App';

function Myshopform({ isEditing, currentBook,onClose, setmybooks }) {
    const { register, handleSubmit, formState, setValue, reset } = useForm();
    const {profile,isLoggedIn}=useContext(context);
    const { errors } = formState;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    useEffect(() => {
        if (isEditing && currentBook) {
            // Pre-fill the form with the book details if editing
            Object.keys(currentBook).forEach(key => {
                setValue(key, currentBook[key]);
            });
        }
    }, [isEditing, currentBook, setValue]);
    const handleFormSubmit = async (data) => {
        if (isLoggedIn) {
        try {
            if (isEditing) {
                const response = await fetch("http://localhost:8000/myshop",{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...data,userId:profile.email}),
                })
                const result = await response.json();
                console.log("book updated",result);
                setmybooks(prev => prev.map(book => book.isbn === currentBook.isbn ?{...book,...data} : book));
                setSnackbarMessage('Book updated successfully!');
            } else {
                const response = await fetch('http://localhost:8000/myshop',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...data,userId:profile.email}),
                })
                const result = await response.json();
                if(response.status===200){
                    return alert('Book already exists,Try adding a new one');
                }
                console.log("book added",result)
                setmybooks(prev => [...prev, data]);
                setSnackbarMessage('Book added successfully!');
            }
            setSnackbarOpen(true);
            setTimeout(() => {
                onClose();
                reset();
            }, 1000);
        } catch (error) {
            console.log("error adding book to myshop",error.message);
        }}
        else{
            if (isEditing) {
                setmybooks(prev => prev.map(book => book.isbn === currentBook.isbn ?{...book,...data} : book));
                setSnackbarMessage('Book updated successfully!');
            } else {
                setmybooks(prev => [...prev, data]);
                setSnackbarMessage('Book added successfully!');
            }
            setSnackbarOpen(true);
            setTimeout(() => {
                onClose();
                reset();
            }, 1000);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    return (
        <>
            <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    {isEditing ? 'Edit book details' : 'Enter book detais'}
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Title"
                        {...register("title", { required: "Title is required" })}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Author"
                        {...register("author", { required: "Author is required" })}
                        error={!!errors.author}
                        helperText={errors.author?.message}
                        margin="normal"
                    />
                    <TextField
                    disabled={isEditing}
                        fullWidth
                        label="ISBN"
                        {...register("isbn", { required: "ISBN is required" })}
                        error={!!errors.isbn}
                        helperText={errors.isbn?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Genre"
                        {...register("genre", { required: "Genre is required" })}
                        error={!!errors.genre}
                        helperText={errors.genre?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Language"
                        {...register("language", { required: "Language is required" })}
                        error={!!errors.language}
                        helperText={errors.language?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        {...register("description")}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Cover Photo URL"
                        {...register('coverPhotoUrl')}
                        helperText="Leave this field empty if you don't have URL"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Rating"
                        {...register("avgrating", {
                            required: "Rating is required",
                            min: { value: 0, message: "Rating must be at least 0" },
                            max: { value: 5, message: "Rating must be at most 5" }
                        })}
                        error={!!errors.rating}
                        helperText={errors.rating?.message}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Price"
                        {...register("price", {
                            required: "Price is required",
                            min: { value: 10, message: "Price must be at least 10" }
                        })}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        margin="normal"
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: 'primary.main',
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            }}
                        >
                            {isEditing ? 'Save Changes' : 'Add Book'}
                        </Button>
                    </Box>
                </form>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default React.memo(Myshopform);
