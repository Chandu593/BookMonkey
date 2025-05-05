import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import { useNavigate, useLocation } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  // Don't show back button on homepage
  if (location.pathname === '/') return null;
  return (
    <Tooltip title="Go back">
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: 'absolute',
          top: '70px',
          left: {xs:'7px',sm:'13px'},
          color:'black',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s ease',
          zIndex: 1000
        }}
      >
        <WestIcon sx={{fontSize:'1.8rem'}}/>
      </IconButton>
    </Tooltip>
  );
}
export default BackButton; 