import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

function SplashScreen({ onComplete }) {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        // Start animation after component mounts
        setAnimate(true);
        // Trigger onComplete after animation
        const timer = setTimeout(() => {
            onComplete();
        }, 2500); // Total animation duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: '#ae275f', // or your brand color
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: animate ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    animation: animate ? 'zoomInRotate 1.5s ease-out' : 'none',
                    '@keyframes zoomInRotate': {
                        '0%': {
                            transform: 'scale(0) rotate(-180deg)',
                            opacity: 0
                        },
                        '50%': {
                            transform: 'scale(1.2) rotate(0deg)',
                            opacity: 0.7
                        },
                        '100%': {
                            transform: 'scale(1) rotate(0deg)',
                            opacity: 1
                        }
                    }
                }}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="100px" 
                    viewBox="0 -960 960 960" 
                    width="100px" 
                    fill="#ffffff"
                >
                    <path d="M480-60q-72-68-165-104t-195-36v-440q101 0 194 36.5T480-498q73-69 166-105.5T840-640v440q-103 0-195.5 36T480-60Zm0-104q63-47 134-75t146-37v-276q-73 13-143.5 52.5T480-394q-66-66-136.5-105.5T200-552v276q75 9 146 37t134 75Zm0-436q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-760q0-33-23.5-56.5T480-840q-33 0-56.5 23.5T400-760q0 33 23.5 56.5T480-680Zm0-80Zm0 366Z" />
                </svg>
            </Box>
            <Typography
                variant="h3"
                sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mt: 2,
                    opacity: animate ? 1 : 0,
                    transform: animate ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease-out 0.8s',
                    fontFamily: '"Leckerli One", serif'
                }}
            >
                BookMonkey<sup>TM</sup>
            </Typography>
        </Box>
    );
}

export default React.memo(SplashScreen); 