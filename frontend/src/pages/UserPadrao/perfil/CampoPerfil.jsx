import { useId, useState } from 'react';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { campoSx, rotuloCampoSx } from './perfil.styles';

/**
 * Campo com rótulo acima (como no modelo). Se `type="password"`, já inclui o
 * botão de mostrar/ocultar. `error` recebe a mensagem de erro (string).
 */
export const CampoPerfil = ({ label, icon, type = 'text', error, helperText, id, ...rest }) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visivel, setVisivel] = useState(false);
  const isSenha = type === 'password';

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="label" htmlFor={inputId} sx={rotuloCampoSx}>
        {label}
      </Typography>

      <TextField
        id={inputId}
        fullWidth
        variant="outlined"
        type={isSenha && visivel ? 'text' : type}
        error={Boolean(error)}
        helperText={error || helperText}
        sx={campoSx}
        slotProps={{
          input: {
            startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
            endAdornment: isSenha ? (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  size="small"
                  edge="end"
                  aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={visivel}
                  onClick={() => setVisivel((anterior) => !anterior)}
                  sx={{ color: 'inherit' }}
                >
                  {visivel ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        {...rest}
      />
    </Box>
  );
};

export default CampoPerfil;
