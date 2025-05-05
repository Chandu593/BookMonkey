import React, { useContext, useEffect, useState, useCallback } from 'react';
import { context } from '../App';
// eslint-disable-next-line 
import { Box, Button, Skeleton, Stack, Typography, TextField, InputAdornment, IconButton, Chip, Paper, Pagination } from '@mui/material';
import Bookpagecard from './Bookpagecard';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import '../Global.css'
import { NavLink } from 'react-router-dom';

function Bookspage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { data, isloading, profile,selectedFilters, setSelectedFilters } = useContext(context);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const [totalBooks, setTotalBooks] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const itemsPerPage = 10;
    const fetchFilteredBooks = useCallback(async () => {
        try {
            setIsSearching(true);
            const params = new URLSearchParams({
                searchQuery: searchQuery.trim(),
                genre: selectedFilters.genre,
                language: selectedFilters.language,
                subject: selectedFilters.subject,
                page: currentPage,
                limit: itemsPerPage,
                userId: profile.email
            });
            const response = await fetch(`http://localhost:8000/books/search-filter?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            if (result.success) {
                setFilteredBooks(result.books);
                // setTotalPages(result.totalPages);
                // setTotalBooks(result.totalBooks);
            }
        } catch (error) {
            console.error('Error fetching filtered books:', error);
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery, selectedFilters, currentPage, profile.email]);
    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(handler);
        }, [value, delay]);
        return debouncedValue;
    }
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    useEffect(() => {
        if (debouncedSearchQuery.trim() || selectedFilters.genre ||  selectedFilters.language ||  selectedFilters.subject ) {
            setCurrentPage(1); // Reset to first page on new search/filter
            fetchFilteredBooks();
        } else {
            setFilteredBooks([]);
        }
    }, [debouncedSearchQuery, selectedFilters, fetchFilteredBooks]);
    const handleSearch = () => {
        setCurrentPage(1);
        fetchFilteredBooks();
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handleFilterChange = (type, value) => {
       setSelectedFilters(prev => {
            // If selecting a genre, clear subject and vice versa
            if (type === 'genre') {
                return {
                    ...prev,genre: value,subject: '' // Clear subject when selecting genre
                };
            } else if (type === 'subject') {
                return {
                    ...prev,subject: value,genre: '' // Clear genre when selecting subject
                };
            }
            else if(type==='language'){
                return {
                    ...prev,language:value,
                }
            }
             else {
                return {
                    ...prev,[type]: value
                };
            }
        });
    };
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedFilters({genre: '',language: '',subject: ''});
        setCurrentPage(1);
    };
    // const handlePageChange = (event, newPage) => {
    //     setCurrentPage(newPage);
    //     window.scrollTo(0, 0);
    //     fetchFilteredBooks(); // This should trigger a new API call with the updated page
    //   };
    const handle_genre_click = (e) => {
        const genre = e.target.textContent.trim();
        handleFilterChange('genre', genre);
    };
    const handle_language_click = (e) => {
        const language = e.target.textContent.trim();
        handleFilterChange('language', language);
    };
    const handle_subject_click = (e) => {
        const subject = e.target.textContent.trim();
        handleFilterChange('subject', subject);
    };
    const handleToggleDropdown = (event, dropdownName) => {
        if (window.innerWidth <= 1024) {
            event.preventDefault();
            event.stopPropagation();
            setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
        }
    };
    const handleMouseEnter = (event, dropdownName) => {
        if (window.innerWidth > 1024) {
            setActiveDropdown(dropdownName);
        }
    };
    const handleMouseLeave = () => {
        if (window.innerWidth > 1024) {
            setActiveDropdown(null);
        }
    };
    const displayBooks = searchQuery.trim() || selectedFilters.genre || selectedFilters.language || selectedFilters.subject
        ? filteredBooks
        : data;
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'column', marginTop: 10 }}>
                <Box
                    className="dropdown"
                    sx={{
                        width: { xs: '95%', sm: '90%', md: '70%', lg: '60%' },
                        marginBottom: 3,
                        marginTop: { xs: -2, md: -6 },
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 3,
                        alignItems: { xs: 'flex-start', sm: 'center' },
                    }}
                >
                    <Button size='large'
                        sx={{
                            padding: '30px 20px',
                            height: '45px',
                            textTransform: 'none',
                            color: 'white',
                            backgroundImage: 'linear-gradient(to right, #B2183A, #ED4A69)',
                            borderRadius: '8px',
                            alignSelf: { xs: 'flex-start', sm: 'center' },
                            '&:hover': {
                                backgroundImage: 'linear-gradient(to right, #ED4A69, #B2183A)'
                            }
                        }}
                        startIcon={<FilterAltIcon sx={{ marginRight: -0.8, marginTop: -0.2 }} />}
                        className="btn btn-danger dropdown-toggle"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <Typography variant="subtitle1">Filter</Typography>
                    </Button>
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: '70%' },
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            background: 'linear-gradient(to right, #ffffff, #f5f5f5)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Search books by title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            variant="standard"
                            sx={{
                                ml: 1,
                                flex: 1,
                                '& .MuiInputBase-root': {
                                    '&:before': { borderBottom: 'none' },
                                    '&:after': { borderBottom: 'none' },
                                    fontSize: '1.1rem',
                                    padding: '8px 0'
                                },
                                '& .MuiInputBase-input': {
                                    padding: '8px 0'
                                }
                            }}
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {searchQuery && (
                                            <IconButton 
                                                onClick={() => setSearchQuery('')}
                                                sx={{ 
                                                    color: '#EB1165',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(235, 17, 101, 0.1)'
                                                    }
                                                }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        )}
                                        <IconButton disableRipple 
                                            onClick={handleSearch}
                                            sx={{ 
                                                color: '#EB1165',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(235, 17, 101, 0.1)'
                                                }
                                            }}
                                        >
                                            <SearchIcon sx={{ color: '#EB1165', ml: 2, fontSize: '2rem'}}/>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Paper>
                    {/* Active Filters Display */}
                    {(searchQuery.trim() || selectedFilters.genre || selectedFilters.language || selectedFilters.subject) && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%', mt: 2 }}>
                            {searchQuery.trim() && (
                                <Chip
                                    label={`Search: ${searchQuery.trim()}`}
                                    onDelete={() => setSearchQuery('')}
                                    sx={{ 
                                        background: 'linear-gradient(to right, #B2183A, #ED4A69)', 
                                        color: 'white',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'white',
                                            '&:hover': {
                                                color: '#ffcdd2'
                                            }
                                        }
                                    }}
                                />
                            )}
                            {selectedFilters.genre && (
                                <Chip
                                    label={`Genre: ${selectedFilters.genre}`}
                                    onDelete={() => handleFilterChange('genre', '')}
                                    sx={{ 
                                        background: 'linear-gradient(to right, #B2183A, #ED4A69)', 
                                        color: 'white',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'white',
                                            '&:hover': {
                                                color: '#ffcdd2'
                                            }
                                        }
                                    }}
                                />
                            )}
                            {selectedFilters.subject && (
                                <Chip
                                    label={`Subject: ${selectedFilters.subject}`}
                                    onDelete={() => handleFilterChange('subject', '')}
                                    sx={{ 
                                        background: 'linear-gradient(to right, #B2183A, #ED4A69)', 
                                        color: 'white',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'white',
                                            '&:hover': {
                                                color: '#ffcdd2'
                                            }
                                        }
                                    }}
                                />
                            )}
                            {selectedFilters.language && (
                                <Chip
                                    label={`Language: ${selectedFilters.language}`}
                                    onDelete={() => handleFilterChange('language', '')}
                                    sx={{ 
                                        background: 'linear-gradient(to right, #B2183A, #ED4A69)', 
                                        color: 'white',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'white',
                                            '&:hover': {
                                                color: '#ffcdd2'
                                            }
                                        }
                                    }}
                                />
                            )}
                            <Button
                                variant="text"
                                onClick={clearFilters}
                                sx={{ 
                                    color: '#B2183A', 
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(235, 17, 101, 0.1)'
                                    }
                                }}
                            >
                                Clear All
                            </Button>
                        </Box>
                    )}

                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {/* Genre Dropdown */}
                        <li
                            className="dropdown-submenu"
                            onMouseEnter={(e) => handleMouseEnter(e, 'genre')}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleToggleDropdown(e, 'genre')}
                        >
                            <Typography variant="subtitle1" className="dropdown-item dropdown-toggle">
                                Genre
                            </Typography>
                            <ul className={`dropdown-menu ${activeDropdown === 'genre' ? 'show' : ''}`}>
                                {['Fiction', 'Fantasy', 'Horror', 'Adventure', 'Romance', 'Mystery'].map((genre) => (
                                    <li key={genre}>
                                        <NavLink
                                            to="/bookpage"
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handle_genre_click(e);
                                            }}
                                        >
                                            {genre}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        {/* Subject Dropdown */}
                        <li
                            className="dropdown-submenu"
                            onMouseEnter={(e) => handleMouseEnter(e, 'subject')}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleToggleDropdown(e, 'subject')}
                        >
                            <Typography variant="subtitle1" className="dropdown-item dropdown-toggle">
                                Subject
                            </Typography>
                            <ul className={`dropdown-menu ${activeDropdown === 'subject' ? 'show' : ''}`}>
                                {['Science', 'Maths', 'Arts', 'History', 'Philosophy', 'Biography'].map((subject) => (
                                    <li key={subject}>
                                        <NavLink
                                            to="/bookpage"
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handle_subject_click(e);
                                            }}
                                        >
                                            {subject}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        {/* Language Dropdown */}
                        <li
                            className="dropdown-submenu"
                            onMouseEnter={(e) => handleMouseEnter(e, 'language')}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleToggleDropdown(e, 'language')}
                        >
                            <Typography variant="subtitle1" className="dropdown-item dropdown-toggle">
                                Language
                            </Typography>
                            <ul className={`dropdown-menu ${activeDropdown === 'language' ? 'show' : ''}`}>
                                {['English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Marathi', 'Kannada'].map((lang) => (
                                    <li key={lang}>
                                        <NavLink
                                            to="/bookpage"
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handle_language_click(e);
                                            }}
                                        >
                                            {lang}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </Box>

                {displayBooks.length === 0 && !isloading && !isSearching ? (
                    <iframe
                        width={420}
                        height={500}
                        title='books not found'
                        src="https://lottie.host/embed/3acd255f-9b7b-4df1-9dbd-5610c70ed75b/AJXKsZJ4Ur.lottie"
                    />
                ) : isloading || isSearching ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: { xs: '95%', sm: '90%', md: '70%', lg: '60%' },
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                border: '2px solid #e2d9d9',
                                marginBottom: 2,
                                '&:hover': { boxShadow: '5px 5px 5px rgb(190, 176, 196)' },
                            }}
                            className="card mb-3"
                        >
                            <Box
                                sx={{
                                    flexShrink: 1,
                                    flexBasis: { xs: '100%', sm: 'inherit' },
                                    display: 'flex',
                                    placeContent: 'center',
                                }}
                                className="bookcardimg"
                            >
                                <Skeleton
                                    animation="wave"
                                    variant="rectangular"
                                    sx={{ width: { xs: '50%', sm: '180px', md: '186px', lg: '206px' }, height: '280px' }}
                                />
                            </Box>
                            <Box sx={{ flexShrink: 2 }} className="card-body">
                                <Skeleton animation="wave" variant="text" width="60%" height={45} />
                                <Skeleton animation="wave" variant="text" width="40%" height={27} />
                                <Box sx={{ marginBlock: 1 }}>
                                    <Skeleton animation="wave" variant="text" width="90%" />
                                    <Skeleton animation="wave" variant="text" width="60%" />
                                </Box>
                                <Box sx={{ marginBlock: 1, display: 'flex', gap: 0.4 }}>
                                    <Skeleton animation="wave" variant="text" width="40px" />
                                    <Skeleton animation="wave" variant="text" width="35px" height={25} sx={{ marginTop: 0.3 }} />
                                </Box>
                                <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} animation="wave" variant="circular" width={20} height={20} />
                                    ))}
                                </Stack>
                                <Skeleton animation="wave" variant="rounded" width={130} height={35} />
                            </Box>
                        </Box>
                    ))
                ) : (
                    displayBooks.map((element) => (
                        <Bookpagecard
                            key={Math.random()}
                            coverPhotoUrl={element.coverPhotoUrl || 'https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180'}
                            author={element.author || "Unknown"}
                            avgrating={element.avgrating}
                            title={element.title || "Untitled"}
                            price={element.price}
                            description={element.description}
                            isbn={element.isbn}
                        />
                    ))
                )}
                {/* {displayBooks.length > 0 && (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        width: { xs: '95%', sm: '90%', md: '70%', lg: '60%' },
                        marginY: 2,
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Button
                                size='large'
                                variant='contained'
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(null, setCurrentPage(prev=>prev - 1))}
                                sx={{
                                    textTransform: 'none',
                                    backgroundImage: 'linear-gradient(to right, #EB1165, #FF6347)',
                                    boxShadow: '',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(to right, #FF6347, #EB1165)'
                                    }
                                }}
                                startIcon={<WestIcon />}
                            >
                                Previous
                            </Button>
                            <Button
                                size='large'
                                variant='contained'
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(null,setCurrentPage(prev=>prev + 1))}
                                sx={{
                                    textTransform: 'none',
                                    backgroundImage: 'linear-gradient(to right, #EB1165, #FF6347)',
                                    boxShadow: '',
                                    '&:hover': {
                                        backgroundImage: 'linear-gradient(to right, #FF6347, #EB1165)'
                                    }
                                }}
                                endIcon={<EastIcon />}
                            >
                                Next
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: '#EB1165',
                                        '&.Mui-selected': {
                                            backgroundColor: '#EB1165',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#FF6347'
                                            }
                                        }
                                    }
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} books
                            </Typography>
                        </Box>
                    </Box>
                )} */}
            </Box>
        </>
    );
}
export default React.memo(Bookspage);
