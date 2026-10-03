import { TextField, InputAdornment } from '@mui/material';
import { textFieldSx } from '@/styles/LoginForm.styles';

/** Campo de texto reutilizável com o visual dos inputs originais. */
export const TextInput = ({ icon, placeholder, label, ...rest }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder={placeholder ?? label}
    aria-label={label ?? placeholder}
    sx={textFieldSx}
    InputProps={{
      startAdornment: icon ? (
        <InputAdornment position="start">{icon}</InputAdornment>
      ) : undefined,
    }}
    {...rest}
  />
);
