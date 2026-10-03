import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { passwordToggleSx, textFieldSx } from '@/styles/LoginForm.styles';

/** Campo de senha reutilizável para login, cadastro e confirmação. */
export const PasswordField = ({
  label = 'Senha',
  value,
  onChange,
  autoComplete = 'current-password',
  required = true,
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={label}
      aria-label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
      sx={textFieldSx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlinedIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button"
              aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={visible}
              onClick={() => setVisible((prev) => !prev)}
              edge="end"
              size="small"
              sx={passwordToggleSx}
            >
              {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};
