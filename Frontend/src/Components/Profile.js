import React, { useContext, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Paper, Divider, Snackbar, Alert, TextField, styled, Stack, Button, Card, CardContent, CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { context } from '../App';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Logout from '@mui/icons-material/Logout';


// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '1rem',
  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: '0.5rem',
  backgroundColor: 'rgba(25, 118, 210, 0.05)',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  border: '4px solid white',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.75rem',
    transition: 'transform 0.2s ease',
  }
}));

function Profile() {
  const { profile, setprofile,isLoggedIn,updatelogin } = useContext(context);
  const navigate=useNavigate();
  const [editMode, setEditMode] = useState({
    avatarImage: false,
    personalInfo: false,
    contactInfo: false,
    addressInfo: false
  });
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      mobile: profile.mobile,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
    }
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleEdit = (section) => {
    setEditMode({ ...editMode, [section]: true });
  };

  const handleSave = (section) => {
    handleSubmit(async (data) => {
      try {
        const updatedProfile = { ...profile, ...data };
        setprofile(updatedProfile); // Update the profile state
        const response = await fetch('http://localhost:8000/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProfile)
        });
        const result = await response.json();
        console.log(result);
        if (response.status === 500) {
          setSnackbar({
            open: true,
            message: 'Failed to update profile. Please try again later.',
            severity: 'error'
          });
          return;
        }
        if (response.status === 200) {
          setEditMode({ ...editMode, [section]: false });
          if(section==='avatarImage'){
            setSnackbar({
              open: true,
              message: 'Profile photo updated successfully!',
              severity:'success'
            });
          }
          else{
          setSnackbar({
            open: true,
            message: 'Profile updated successfully!',
            severity: 'success'
          });
        }
        }
      } catch (error) {
        console.log('Failed to update profile: ', error);
      }
    })();
  };

  const handleCancel = (section) => {
    setEditMode({ ...editMode, [section]: false });
    // Reset form fields to original values
    Object.keys(profile).forEach(key => {
      setValue(key, profile[key]);
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const updatedProfile = { ...profile, avatar: reader.result };
          setprofile(updatedProfile);
          
          // Save to database
          const response = await fetch('http://localhost:8000/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile)
          });

          if (response.ok) {
            setSnackbar({
              open: true,
              message: 'Profile photo updated successfully!',
              severity: 'success'
            });
          } else {
            throw new Error('Failed to update profile photo');
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error updating profile photo:', error);
        setSnackbar({
          open: true,
          message: 'Failed to update profile photo. Please try again.',
          severity: 'error'
        });
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await new Promise(resolve => setTimeout(resolve, 1500));      
      setSnackbar({
        open: true,
        message: 'Logged out successfully!',
        severity: 'success'
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem("userProfile");
      setprofile({});
      updatelogin(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setSnackbar({
        open: true,
        message: 'Error during logout. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <>
      {isLoggedIn ?
        <Box sx={{
          p: { xs: '1rem', sm: '2rem', md: '3rem' },
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          minHeight: '100vh'

        }}>
          <StyledPaper>
            {/* Profile Header */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              mb: '2rem',
              gap: '2rem',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  right: '-10px',
                  bottom: '-10px',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  borderRadius: '50%',
                  zIndex: -1,
                  opacity: 0.1
                }
              }}>
                <StyledAvatar src={profile.avatar}>
                  {profile.firstname}
                </StyledAvatar>
                <input
                  accept="image/*"
                  type="file"
                  id="avatar-upload"
                  hidden
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'scale(1.1)'
                      },
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {profile.firstname} {profile.lastname}
              </Typography>
            </Box>
            <Divider sx={{ mb: '2rem', opacity: 0.5 }} />

            {/* Personal Information */}
            <Box sx={{ mb: '2rem' }}>
              <SectionHeader>
                <PersonIcon />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Personal Information</Typography>
                {!editMode.personalInfo ? (
                  <IconButton
                    onClick={() => handleEdit('personalInfo')}
                    color="primary"
                    sx={{
                      '&:hover': { transform: 'rotate(15deg)' },
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Box>
                    <IconButton onClick={() => handleSave('personalInfo')} color="success">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCancel('personalInfo')} color="error">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </SectionHeader>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ width: '100%' }}
              >
                <Controller
                  name="firstname"
                  control={control}
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      autoComplete='true'
                      label="First Name"
                      error={!!errors.firstname}
                      helperText={errors.firstname?.message}
                      disabled={!editMode.personalInfo}
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  name="lastname"
                  control={control}
                  rules={{ required: 'Last name is required' }}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      autoComplete='true'
                      label="Last Name"
                      error={!!errors.lastname}
                      helperText={errors.lastname?.message}
                      disabled={!editMode.personalInfo}
                      variant="outlined"
                    />
                  )}
                />
              </Stack>
            </Box>

            {/* Contact Information */}
            <Box sx={{ mb: '2rem' }}>
              <SectionHeader>
                <EmailIcon />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Contact Information</Typography>
                {!editMode.contactInfo ? (
                  <IconButton
                    onClick={() => handleEdit('contactInfo')}
                    color="primary"
                    sx={{
                      '&:hover': { transform: 'rotate(15deg)' },
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Box>
                    <IconButton onClick={() => handleSave('contactInfo')} color="success">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCancel('contactInfo')} color="error">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </SectionHeader>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ width: '100%' }}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      autoComplete='true'
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={true}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  )}
                />
                <Controller
                  name="mobile"
                  control={control}
                  rules={{
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[789]\d{9}$/,
                      message: "Invalid phone number"
                    }
                  }}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      autoComplete='true'
                      label="Phone"
                      error={!!errors.mobile}
                      helperText={errors.mobile?.message}
                      disabled={!editMode.contactInfo}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  )}
                />
              </Stack>
            </Box>

            {/* Address Information */}
            <Box sx={{ mb: '1rem' }}>
              <SectionHeader>
                <LocationOnIcon />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Address Information</Typography>
                {!editMode.addressInfo ? (
                  <IconButton
                    onClick={() => handleEdit('addressInfo')}
                    color="primary"
                    sx={{
                      '&:hover': { transform: 'rotate(15deg)' },
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Box>
                    <IconButton onClick={() => handleSave('addressInfo')} color="success">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={() => handleCancel('addressInfo')} color="error">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
              </SectionHeader>

              <Stack
                direction="column"
                spacing={3}
                sx={{ width: '100%' }}
              >
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: 'Address is required' }}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      fullWidth
                      autoComplete='true'
                      label="Address"
                      rows={2}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      disabled={!editMode.addressInfo}
                      InputProps={{
                        startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  )}
                />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  sx={{ width: '100%' }}
                >
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required' }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        autoComplete='true'
                        label="City"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        disabled={!editMode.addressInfo}
                      />
                    )}
                  />
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: 'State is required' }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        autoComplete='true'
                        label="State"
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        disabled={!editMode.addressInfo}
                      />
                    )}
                  />

                  <Controller
                    name="pincode"
                    control={control}
                    rules={{
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Invalid pincode"
                      }
                    }}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        fullWidth
                        autoComplete='true'
                        label="Pincode"
                        error={!!errors.pincode}
                        helperText={errors.pincode?.message}
                        disabled={!editMode.addressInfo}
                      />
                    )}
                  />
                </Stack>
              </Stack>
            </Box>

          </StyledPaper>
            {/* Logout Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mt: 2,
                // mb:-4
              }}
            >
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                startIcon={
                  isLoggingOut ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Logout sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                  )
                }
                sx={{
                  color: 'white',
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 3, sm: 4 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #ff4444 30%, #ff6b6b 90%)',
                  borderRadius: '50px',
                  boxShadow: '0 4px 12px rgba(255, 68, 68, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(255, 68, 68, 0.4)',
                    background: 'linear-gradient(45deg, #ff3333 30%, #ff5555 90%)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(45deg, #ff9999 30%, #ffbbbb 90%)',
                    color: 'white',
                  }
                }}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </Box>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={handleSnackbarClose}
              sx={{
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box> : <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            padding: 3,
          }}
        >
          <Card
            sx={{
              maxWidth: 500,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '1rem',
              p: 3,
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Welcome to Our Platform
              </Typography>
              <Typography variant="body1" color='text.secondary' sx={{ mb: 3, fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                Please log in to access your profile and enjoy personalized features.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <NavLink to="/login"><Button
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{
                    background: 'linear-gradient(45deg, #1976d2,rgb(61, 164, 249))',
                  }}

                >
                  Log In
                </Button>
                </NavLink>
                <NavLink to="/register"><Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      color: 'primary.dark',
                    },
                  }}
                >
                  Sign Up
                </Button>
                </NavLink>
              </Box>
            </CardContent>
          </Card>

        </Box>}
    </>
  );
}


export default React.memo(Profile); 