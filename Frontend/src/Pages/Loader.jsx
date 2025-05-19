import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const HospitalLoader = () => {
  // Prevent scrolling while loader is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed', // cover entire screen
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: '#f0f4f8',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <Typography variant="h6" color="text.secondary">
        Please wait...
      </Typography>

      {/* CSS for animation */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default HospitalLoader;
