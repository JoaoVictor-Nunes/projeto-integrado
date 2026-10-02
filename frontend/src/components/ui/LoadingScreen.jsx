import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingScreen = ({ message = 'Carregando...' }) => (
  <Box
    sx={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default',
      gap: 2,
    }}
  >
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress color="primary" />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  </Box>
);