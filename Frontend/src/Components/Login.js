import React, { useContext, useState } from 'react'
import '../Global.css'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { context } from '../App';
import { useForm } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updatelogin,profile,setprofile} = useContext(context)
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, formState, handleSubmit, setError } = useForm();
  const { errors } = formState;
  const onsubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json();
      if (response.status === 401) {
        console.log("result: " + JSON.stringify(result));
        if (!result.emailExists) {
          return setError("email", { type: "manual", message: "Email is not registered" })
        }
        if (!result.passwordMatch) {
          setError("password", { type: "manual", message: "Incorrect password" });
        }
        return;
      }
      if (response.status === 200) {
        setprofile({...profile,...result.userDetails})
        localStorage.setItem("userProfile", JSON.stringify(result.userDetails));
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsSuccess(true);
          setTimeout(() => {
            updatelogin(true);
            navigate('/');
          }, 1500);
        }, 1500);
      }
    }
    catch (err) {
      console.log("Error while logging in: ", err.message);
    }
  }
  const Alert = React.forwardRef(function Alert(props,ref) {
    return <MuiAlert elevation={6}ref={ref} {...props} variant="filled"/>;
  });
  return (
    <>
      <Box sx={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="logincard">
          <form className="form" onSubmit={handleSubmit(onsubmit)} noValidate>
            <div className="title">Sign In</div>
            <Typography className="label_input" htmlFor="email-input">
              Email
            </Typography>
            <TextField
              autoComplete='true'
              autoFocus
              variant="outlined"
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: 'Email is required'
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})$/,
                  message: 'Enter a valid email address'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              id="email-input"
              size='small'
              fullWidth
              sx={{ mb: 2 }}
            />
            <Typography className="label_input" htmlFor="password-input">
              Password
            </Typography>
            <TextField
              autoComplete='true'
              variant="outlined"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: {
                  value: true,
                  message: 'Password required'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              id="password-input"
              size='small'
              fullWidth
              sx={{ mb: 2 }}
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
              {isLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
          <Snackbar  open={isSuccess} autoHideDuration={3000}>
            <Alert severity="success" sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>Login successful!</Alert>
          </Snackbar>
          <svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#000000"><path d="M480-60q-72-68-165-104t-195-36v-440q101 0 194 36.5T480-498q73-69 166-105.5T840-640v440q-103 0-195.5 36T480-60Zm0-104q63-47 134-75t146-37v-276q-73 13-143.5 52.5T480-394q-66-66-136.5-105.5T200-552v276q75 9 146 37t134 75Zm0-436q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-760q0-33-23.5-56.5T480-840q-33 0-56.5 23.5T400-760q0 33 23.5 56.5T480-680Zm0-80Zm0 366Z" /></svg>
          <Typography variant='h6' sx={{ fontWeight: 'bold', fontFamily: '"Leckerli One", serif' }}>BookMonkey<sup>TM</sup></Typography>
        </div>
      </Box>
    </>
  )
}

export default React.memo(Login);
