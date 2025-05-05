import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Box, Tabs, Tab, Typography, Card, CardContent, useMediaQuery, TextField, Button, Paper, CircularProgress, InputAdornment } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import { useTheme } from '@mui/material/styles';
import Exchangebookcard from './Exchangebookcard';
import { context } from '../App';
import '../Global.css'
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`exchange-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
function ExchangePage() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { GlobalexchangeBooks, setGlobalexchangeBooks, exchangeHistory, profile, setExchangeHistory } = useContext(context);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const fetchBooks = useCallback(async (query = '', page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/search-books?query=${encodeURIComponent(query)}&page=${page}&userId=${profile?.email || ''}`);
      const data = await response.json();
      if (response.ok) {
        setGlobalexchangeBooks(data.books);
        setExchangeHistory(data.exchangeHistory);
        setTotalPages(data.totalPages);
        setTotalBooks(data.total);
        setCurrentPage(data.currentPage);
      } else {
        setError('Failed to fetch books');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  }, [setGlobalexchangeBooks, profile?.email, setExchangeHistory]);
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchBooks(searchQuery, 1);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchBooks(searchQuery, newPage);
  };
  const chatMessages = []; // Replace with actual data

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="exchange tabs"
        centered
        variant={isSmallScreen ? 'fullWidth' : 'standard'}
        sx={{ '& .MuiTab-root': { flex: 1 } }}
      >
        <Tab
          icon={<SwapHorizIcon sx={{ fontSize: '1.7rem' }} />}
          label={isSmallScreen ? '' : 'Available Exchanges'}
          sx={{
            fontSize: { sm: '0.8rem', md: '1rem' }
          }}
        />
        <Tab
          icon={<HistoryIcon sx={{ fontSize: '1.7rem' }} />}
          label={isSmallScreen ? '' : 'Exchange History'}
          sx={{
            fontSize: { sm: '0.8rem', md: '1rem' }
          }}
        />
        <Tab
          icon={<ChatIcon sx={{ fontSize: '1.7rem' }} />}
          label={isSmallScreen ? '' : 'Chat'}
          sx={{
            fontSize: { sm: '0.8rem', md: '1rem' }
          }}
        />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ p: 2, maxWidth: 1200, margin: '0 auto' }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: '1rem'
            }}
          >
            <form onSubmit={handleSearch}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by title, author, or wanted book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: '0.75rem',
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                    }
                  }}
                >
                  Search
                </Button>
              </Box>
            </form>
          </Paper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
              {error}
            </Typography>
          ) : GlobalexchangeBooks.length === 0 ? (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                borderRadius: '1rem'
              }}
            >
              <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary">
                No books found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search query
              </Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '800px', mx: 'auto' }}>
                {GlobalexchangeBooks.map((book) => (
                  <Exchangebookcard book={book} key={book.isbn} />
                ))}
              </Box>

              {totalBooks > 8 && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 4,
                  gap: { xs: 1, sm: 2 },
                  position: 'relative',
                  minHeight: '50px',
                  flexWrap: 'wrap'
                }}>
                  {loading ? (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Loading...
                      </Typography>
                    </Box>
                  ) : (
                    <>
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
                    </>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {exchangeHistory.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '800px', mx: 'auto', minHeight: '100vh' }}>
            {exchangeHistory.map((book) => (
              <Exchangebookcard book={book} key={book.isbn} isexchangehistory={true} />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', minHeight: { xs: '50vh', md: '60vh' }, display: 'block', alignContent: 'center' }}>
            <HistoryIcon sx={{ fontSize: '4rem', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No exchange history</Typography>
            <Typography>Complete exchanges to see your history here</Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {chatMessages.length > 0 ? (
          chatMessages.map((message, index) => (
            <Card key={index} sx={{ mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '1rem' }}>
              <CardContent>
                <Typography variant="body1">{message.text}</Typography>
                <Typography variant="body2" color="text.secondary">
                  From: {message.senderName}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary', minHeight: { xs: '50vh', md: '60vh' }, display: 'block', alignContent: 'center' }}>
            <ChatIcon sx={{ fontSize: '4rem', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No chat messages</Typography>
            <Typography>Start a conversation to see messages here</Typography>
          </Box>
        )}
      </TabPanel>
    </Box>
  );
}

export default React.memo(ExchangePage); 