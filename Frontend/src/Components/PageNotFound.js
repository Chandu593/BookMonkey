import { Button,Box } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PageNotFound = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="d-flex flex-column justify-content-center align-items-center"sx={{minHeight:'90vh'}}>
      <iframe  height={400}width={400} src="https://lottie.host/embed/ee3f1f03-671d-4c60-b612-0baef2627615/QOuEJE7tz9.lottie"title='404 page not found' />
      <Button
        variant="contained"
        onClick={handleBack}
        startIcon={<ArrowBackIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
        sx={{m:2,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          borderRadius: '1.5rem',
          px: { xs: 2, sm: 2.5 },
          py: { xs: 0.5, sm: 0.75 },
          minWidth: { xs: '80px', sm: '100px' },
          boxShadow: '0 2px 4px rgba(25, 118, 210, .2)',
          background: 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)',
          color: 'white',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default PageNotFound;
