import React, { memo, useState, useEffect } from 'react';
import {
  Box, Typography, Avatar, Paper, Divider, Stack, Skeleton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const { ownerId } = useParams();

  useEffect(() => {
    const url = `http://localhost:8000/userprofile/${ownerId}`;
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTimeout(() =>
        setUser(data),1000);
      } catch (error) {
        console.log('error fetching owner data', error);
      }
    };
    fetchData();
  }, [ownerId]);

  const SkeletonContent = () => (
    <Paper sx={{
      padding: 3,
      borderRadius: '1rem',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      width: '100%'
    }}>
      <Skeleton variant="circular" width={120} height={120} sx={{ margin: '0 auto' }} />
      <Skeleton variant="text" width="60%" sx={{ fontSize: '2rem', margin: '1rem auto' }} />
      <Divider sx={{ my: 3 }} />
      <Stack spacing={2} sx={{ width: '100%' }}>
        {[...Array(4)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
            <Skeleton variant="text" width="80%" height={30} />
          </Box>
        ))}
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{
      p: { xs: '1rem', sm: '2rem', md: '3rem' },
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: {xs:'70vh',md:'90vh'},
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
    }}>
      {!user ? <SkeletonContent /> : (
        <Paper sx={{
          padding: 3,
          borderRadius: '1rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 120, height: 120, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            {user.firstname}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 2 }}>
            {user.firstname} {user.lastname}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2} sx={{ textAlign: 'left', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{user.firstname + user.lastname}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{user.mobile}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1">{user.address}</Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default memo(UserProfile);
