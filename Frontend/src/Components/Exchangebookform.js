import React, { useContext, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import {context} from '../App';
const ExchangeBookForm = ({ isEditing, bookToEdit, onClose, setmyexchangeBooks}) => {
  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;
  const {isLoggedIn,profile,setGlobalexchangeBooks}=useContext(context);
  useEffect(() => {
    if (isEditing && bookToEdit) {
      // Pre-fill the form with the book details if editing
      Object.keys(bookToEdit).forEach(key => {
        setValue(key, bookToEdit[key]);
    });
    }
  }, [isEditing, bookToEdit, setValue]);
  const onSubmit = async(data) => {
    if(isLoggedIn){
      try {
          if (isEditing) {
            // Update existing book
            const response= await fetch("http://localhost:8000/bookexchange",{
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({...data,userId:profile.email}),
            })
            const result = await response.json();
            console.log("book updated",result);
            setGlobalexchangeBooks(prevBooks =>
              prevBooks.map(book => book.isbn === bookToEdit.isbn ? { ...book, ...data } : book)
            );
            setmyexchangeBooks(prevBooks =>
              prevBooks.map(book => book.isbn === bookToEdit.isbn ? { ...book, ...data } : book)
            );
            onClose();
          } 
          else {
            // Add new book
            const response = await fetch("http://localhost:8000/bookexchange",{
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({...data,userId:profile.email}),
            });
            if(response.status===200){
              return alert('Book already in exchange,Try adding a new one');
          }
            const result = await response.json();
            console.log(result);
            setGlobalexchangeBooks(prev=>[...prev,result.bookdata])
            setmyexchangeBooks(prevBooks => [...prevBooks, data]);
            onClose();
          }
      } catch (error) {
        console.log("Error adding the exchange book",error.message);
      }
    }
    else{
    if (isEditing) {
      // Update existing book
      setmyexchangeBooks(prevBooks =>
        prevBooks.map(book => book.isbn === bookToEdit.isbn ? { ...book, ...data } : book)
      );
    } else {
      // Add new book
      setmyexchangeBooks(prevBooks => [...prevBooks, data]);
    }
    onClose();
  }
  };
  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {isEditing ? 'Edit Exchange Book' : 'Add Book for Exchange'}
          </Typography>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h6">Your Book Details:</Typography>
              <Typography variant="subtitle1">Book Title</Typography>
              <TextField
                type="text"
                autoFocus
                {...register("title", { required: { value: true, message: 'Title required' }, pattern: { value: /^[A-Za-z0-9\s.,:;!?'"()-]+$/, message: 'Invalid title' } })}
                id="title"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
              <Typography variant="subtitle1">Author</Typography>
              <TextField
                type="text"
                {...register("author", { required: { value: true, message: 'Author required' }, pattern: { value: /^[A-Za-z\s.]+(?: [A-Za-z\s.]+)*$/, message: 'Invalid name' } })}
                id="author"
                error={!!errors.author}
                helperText={errors.author?.message}
              />
              <Typography variant="subtitle1">ISBN</Typography>
              <TextField
              disabled={isEditing}
                type="text"
                {...register("isbn", { required: { value: true, message: 'ISBN required' }, pattern: { value: /^(?=[0-9]{13}$|[0-9]{10}$)(?:[0-9]{9}[0-9X]|[0-9]{13})$/, message: 'Invalid ISBN' } })}
                id="isbn"
                error={!!errors.isbn}
                helperText={errors.isbn?.message}
              />
              <Typography variant="subtitle1">Condition</Typography>
              <TextField
                type="text"
                {...register("condition", { required: { value: true, message: 'Condition required' } })}
                id="condition"
                error={!!errors.condition}
                helperText={errors.condition?.message}
              />
              <Typography variant="h6" mt={2}>
                Book You Want:
              </Typography>
              <Typography variant="subtitle1">Title</Typography>
              <TextField
                type="text"
                {...register("wantedBook", { required: { value: true, message: 'Wanted Book required' }, pattern: { value: /^[A-Za-z0-9\s.,:;!?'"()-]+$/, message: 'Invalid title' } })}
                id="wantedBook"
                error={!!errors.wantedBook}
                helperText={errors.wantedBook?.message}
              />
              <Typography variant="subtitle1">Author</Typography>
              <TextField
                type="text"
                {...register("wantedAuthor", { required: { value: true, message: 'Wanted Author required' }, pattern: { value: /^[A-Za-z\s.]+(?: [A-Za-z\s.]+)*$/, message: 'Invalid name' } })}
                id="wantedAuthor"
                error={!!errors.wantedAuthor}
                helperText={errors.wantedAuthor?.message}
              />
              <Typography variant="subtitle1">ISBN</Typography>
              <TextField
                type="text"
                {...register("wantedisbn", { required: { value: true, message: 'Wanted ISBN required' }, pattern: { value: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9]{13}$|[0-9]{10}$)(?:[0-9]{9}[0-9X]|[0-9]{13})$/, message: 'Invalid ISBN' } })}
                id="wantedisbn"
                error={!!errors.wantedisbn}
                helperText={errors.wantedisbn?.message}
              />
              <Typography variant="subtitle1">Minimum Condition Required</Typography>
              <TextField
                type="text"
                {...register("wantedCondition", { required: { value: true, message: 'Condition required' } })}
                id="wantedCondition"
                error={!!errors.wantedCondition}
                helperText={errors.wantedCondition?.message}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
                  {isEditing ? 'Save Changes' : 'Add Book for Exchange'}
                </Button>

              </Box>
            </Box>

          </form>
    </Box>
  );
};

export default React.memo(ExchangeBookForm);