import { InputBase, Box } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { colors, radius, transitions } from '@/theme/tokens';

export const SearchField = ({
  value,
  onChange,
  placeholder = 'Buscar por título, autor ou ISBN...',
  ...rest
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      height: 44,
      width: '100%',
      maxWidth: 480,
      padding: '0 16px',
      backgroundColor: colors.rest,
      border: `1px solid ${colors.restBorder}`,
      borderRadius: radius.field,
      transition: `border-color ${transitions.normal}, box-shadow ${transitions.normal}`,
      '&:focus-within': {
        borderColor: colors.tealPrimary,
        boxShadow: `0 0 0 3px ${colors.tealLight}66`,
        backgroundColor: colors.white,
      },
    }}
  >
    <SearchOutlinedIcon
      sx={{
        color: colors.muted,
        fontSize: 20,
      }}
    />

    <InputBase
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth
      inputProps={{ 'aria-label': placeholder }}
      sx={{
        fontSize: '0.95rem',
        color: colors.ink,
        '& input::placeholder': {
          color: colors.muted,
          opacity: 1,
        },
      }}
      {...rest}
    />
  </Box>
);