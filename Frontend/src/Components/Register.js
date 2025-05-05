import React, { useContext, useState } from 'react';
import '../Global.css';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from 'react-hook-form';
import { context } from '../App';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
function Register() {
  const { profile, setprofile } = useContext(context);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState, watch, setError } = useForm();
  const { errors } = formState;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const password = watch('password')
  const passwordMatch = (value) => value === password ? undefined : 'Passwords do not match'
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const onsubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("response:", JSON.stringify(result));
      if (response.status === 400) {
        if (result.emailExists) {
          setError('email', { type: 'manual', message: 'Email already exists' });
        }
        if (result.mobileExists) {
          setError('mobile', { type: 'manual', message: 'Mobile number already exists' });
        }
        return;
      }
      if (response.status === 201) {
        setIsLoading(true);
        setTimeout(() => {
          setprofile({ ...profile, ...data });
          setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
              navigate('/login');
            }, 2000);   
          }, 1000);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
    }
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: { xs: 1, sm: -1 } }}>
        <div className="logincard">
          <form className="form" onSubmit={handleSubmit(onsubmit)} action='/register' method='POST' noValidate>
            <div className="title">Sign Up</div>
            <Typography className="label_input" htmlFor="firstname-input">
              First Name
            </Typography>
            <TextField
              variant="outlined"
              type="text"
              autoFocus
              {...register('firstname', {
                required: {
                  value: true,
                  message: 'First name required'
                }, pattern: {
                  value
                    : /^([A-Za-z]+(?: [A-Za-z]+)*)$/, message: 'Only letters are allowed'
                }
              })}
              id="firstname-input"
              size='small'
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
            />
            <Typography className="label_input" htmlFor="lastname-input">
              Last Name
            </Typography>
            <TextField
              variant="outlined"
              type="text"
              {...register('lastname', {
                required: {
                  value: true,
                  message: 'Last name required'
                }, pattern: {
                  value
                    : /^([A-Za-z]+(?: [A-Za-z]+)*)$/, message: 'Only letters are allowed'
                }
              })}
              id="lastname-input"
              size='small'
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
            />

            <Typography className="label_input" htmlFor="email-input">
              Email
            </Typography>
            <TextField
              variant="outlined"
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email required"
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})$/,
                  message: 'Enter a valid email address'
                }
              })}
              id="email-input"
              size='small'
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Typography className="label_input" htmlFor="address-input">
              Address
            </Typography>
            <TextField
              variant="outlined"
              type="text"
              {...register('address', {
                required: {
                  value: true,
                  message: 'Address required'
                }
              })}
              id="address-input"
              size='small'
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <Typography className="label_input" htmlFor="mobile-input">
              Mobile Number
            </Typography>
            <TextField
              variant="outlined"
              type="text"
              {...register('mobile', {
                required: {
                  value: true,
                  message: "Mobile number required"
                },
                pattern: {
                  value: /^[789]\d{9}$/,
                  message: 'Invalid mobile number'
                }
              })}
              id="mobile-input"
              size='small'
              inputProps={{ maxLength: 10 }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                },
              }}
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
            />

            <Typography className="label_input" htmlFor="password-input">
              Password
            </Typography>
            <TextField
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              name="password"
              {...register('password', { required: { value: true, message: 'Password is required' }, pattern: { value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[^\s]{8,}$/, message: 'Password must be of min length 8 with atleast one number and a special character' } })}
              id="password-input"
              size='small'
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {!showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
            <Typography className="label_input" htmlFor="confirm-password-input">
              Confirm Password
            </Typography>
            <TextField
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', { required: { value: true, message: 'Confirm your password' }, validate: passwordMatch })}
              id="confirm-password-input"
              size='small'
              fullWidth autoComplete='true'
              sx={{ mb: 1 }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {!showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}

            />
           <Button type="submit" className='submit' variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </form>
          <Snackbar open={isSuccess} autoHideDuration={3000}>
            <Alert severity="success">Registered successfully!</Alert>
          </Snackbar>
          <svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#000000"><path d="M480-60q-72-68-165-104t-195-36v-440q101 0 194 36.5T480-498q73-69 166-105.5T840-640v440q-103 0-195.5 36T480-60Zm0-104q63-47 134-75t146-37v-276q-73 13-143.5 52.5T480-394q-66-66-136.5-105.5T200-552v276q75 9 146 37t134 75Zm0-436q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-760q0-33-23.5-56.5T480-840q-33 0-56.5 23.5T400-760q0 33 23.5 56.5T480-680Zm0-80Zm0 366Z" /></svg>
          <Typography variant='h6' sx={{ fontWeight: 'bold', fontFamily: '"Leckerli One", serif' }}>BookMonkey<sup>TM</sup></Typography>
        </div>
      </Box>
    </>
  )
}

export default React.memo(Register);
