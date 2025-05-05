import { Box, Button, Typography, Tab, Tabs, Stack, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Bookpagecard from './Bookpagecard';
import '../Global.css';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ExchangeBookForm from './Exchangebookform';
import Myshopform from './Myshopform';
import Exchangebookcard from './Exchangebookcard';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { context } from '../App';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`shop-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Myshop() {
  const [bookToEdit, setBookToEdit] = useState(null);
  const handleCloseForm = () => {
    setShowExchangeForm(false);
    setBookToEdit(null);
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [mybooks, setmybooks] = useState([]);
  const [currentBook, setcurrentBook] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { isLoggedIn, profile } = useContext(context);
  const [myexchangeBooks, setmyexchangeBooks] = useState([]);
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [showmyshopForm, setShowmyshopForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [loading, setLoading] = useState(false);
// eslint-disable-next-line
  const [exchangeBookData, setExchangeBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    condition: '',
    ownerName: '',
    wantedBook: '',
    wantedAuthor: '',
    wantedisbn: '',
    wantedCondition: ''
  });

  useEffect(() => {
    const fetchMyshopbooks = async () => {
      if (isLoggedIn) {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/myshop?userId=${profile.email}`);
        const result = await response.json();
        setmybooks(result.myshopitems);
        setmyexchangeBooks(result.myexchangeitems);
        setLoading(false);
      }
    };
    fetchMyshopbooks();
  }, [isLoggedIn, profile.email]);

  const totalBooks = mybooks.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const paginatedBooks = mybooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (book) => {
    setcurrentBook(book);
    setShowmyshopForm(true);
  };

  const handleDelete = async (isbn) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:8000/myshop', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.email, bookId: isbn })
        });
        if (response.ok) {
          setmybooks(prev => prev.filter(book => book.isbn !== isbn));
        }
      } catch (error) {
        console.error('Error deleting book:', error.message);
      }
    } else {
      setmybooks(prev => prev.filter(book => book.isbn !== isbn));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteExchange = async (isbn) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:8000/bookexchange', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.email, bookId: isbn })
        });
        if (response.ok) {
          setmyexchangeBooks(prev => prev.filter(book => book.isbn !== isbn));
        }
      } catch (error) {
        console.error('Error deleting exchange book:', error.message);
      }
    } else {
      setmyexchangeBooks(prev => prev.filter(book => book.isbn !== isbn));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="shop tabs"
          centered
          variant={isSmallScreen ? 'fullWidth' : 'standard'}
          sx={{ '& .MuiTab-root': { flex: 1 } }}
        >
          <Tab icon={<AddIcon />} label="MY BOOKS" iconPosition="start" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
          <Tab icon={<SwapHorizIcon />} label="EXCHANGE BOOKS" iconPosition="start" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: { xs: '100%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!showmyshopForm && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                  onClick={() => setShowmyshopForm(true)}
                  variant="contained"
                  sx={{ borderRadius: '2rem', px: 4, background: 'linear-gradient(45deg, #1976d2, #42a5f5)', width: 'max-content' }}
                  startIcon={<AddCircleIcon />}
                >
                  <Typography variant="subtitle1">Add book</Typography>
                </Button>
              </Box>
            )}
            {showmyshopForm ? (
              <Myshopform
                isEditing={!!currentBook}
                currentBook={currentBook}
                setmybooks={setmybooks}
                onClose={() => {
                  setShowmyshopForm(false);
                  setcurrentBook(null);
                }}
              />
            ) : loading ? (
              <CircularProgress />
            ) : paginatedBooks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', height: '50vh' }}>
                <ErrorOutlineIcon sx={{ fontSize: '4rem', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6">No books listed in your shop yet</Typography>
                <Typography>Add books you'd like to sell to other readers</Typography>
              </Box>
            ) : (
              paginatedBooks.map((element) => (
                <Bookpagecard
                  key={element.isbn}
                  ismyshopcard={true}
                  coverPhotoUrl={element.coverPhotoUrl}
                  author={element.author}
                  avgrating={element.avgrating}
                  title={element.title}
                  description={element.description}
                  price={element.price}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isbn={element.isbn}
                  genre={element.genre}
                  language={element.language}
                />
              ))
            )}

            {totalBooks > booksPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                <Button
                        variant="contained"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          borderRadius: '1.5rem',
                          px: { xs: 2, sm: 2.5 },
                          py: { xs: 0.5, sm: 0.75 },
                          minWidth: { xs: '80px', sm: '100px' },
                          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(25, 118, 210, .2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                            boxShadow: '0 2px 4px rgba(25, 118, 210, .3)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)',
                            color: 'white',
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        Previous
                      </Button>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.5, sm: 0.75 },
                        borderRadius: '0.75rem',
                        background: 'rgba(25, 118, 210, 0.1)',
                        minWidth: { xs: '100px', sm: '120px' },
                        justifyContent: 'center'
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 'medium',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Page {currentPage} of {totalPages}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          borderRadius: '1.5rem',
                          px: { xs: 2, sm: 2.5 },
                          py: { xs: 0.5, sm: 0.75 },
                          minWidth: { xs: '80px', sm: '100px' },
                          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(25, 118, 210, .2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                            boxShadow: '0 2px 4px rgba(25, 118, 210, .3)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)',
                            color: 'white',
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        Next
                      </Button>
              </Box>
            )}
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {!showExchangeForm && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              size='large'
              onClick={() => { setShowExchangeForm(true); setExchangeBookData({ title: '', author: '', isbn: '', condition: '', wantedBook: '', wantedAuthor: '', wantedisbn: '', wantedCondition: '' }) }}
              sx={{ borderRadius: '2rem', px: 4, background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}
            >
              Add Book for Exchange
            </Button>
          </Box>
        )}

        {showExchangeForm ? (
          <ExchangeBookForm
            setmyexchangeBooks={setmyexchangeBooks}
            isEditing={!!bookToEdit}
            bookToEdit={bookToEdit}
            onClose={handleCloseForm}
          />
        ) : myexchangeBooks.length > 0 ? (
          <Stack spacing={3} sx={{ maxWidth: '800px', mx: 'auto', mt: 3, minHeight: '70vh' }}>
            {myexchangeBooks.map((book) => (
              <Exchangebookcard key={book.isbn} book={book} handleDeleteExchange={handleDeleteExchange} ismyexchange={true} setShowExchangeForm={setShowExchangeForm} setBookToEdit={setBookToEdit} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', height: '50vh' }}>
            <SwapHorizIcon sx={{ fontSize: '4rem', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No books listed for exchange yet</Typography>
            <Typography>Add books you'd like to exchange with other readers</Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
}

export default React.memo(Myshop);
