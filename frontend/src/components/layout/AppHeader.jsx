import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { SearchField } from '@/components/ui/SearchField';
import { colors, header } from '@/theme/tokens';

export const AppHeader = ({ user, searchValue, onSearchChange }) => {
  const navigate = useNavigate();

  return (
    <Box
      component="header"
      sx={{
        height: header.height,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '0 24px',
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.restBorder}`,
      }}
    >
      {/* Logo + nome da biblioteca */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: colors.tealPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuBookIcon sx={{ color: colors.white, fontSize: 20 }} />
        </Box>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            color: colors.ink,
            whiteSpace: 'nowrap',
          }}
        >
          Biblioteca Virtual
        </Typography>
      </Box>

      {/* Busca de livros, centralizada */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <SearchField
          value={searchValue}
          onChange={onSearchChange}
        />
      </Box>

      {/* Acesso ao perfil (ou convite para entrar, se não houver sessão) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          role="button"
          tabIndex={0}
          onClick={() => navigate(user ? '/perfil' : '/login')}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            navigate(user ? '/perfil' : '/login')
          }
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '6px 10px 6px 6px',
            borderRadius: '999px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: colors.tealGhost,
            },
            '&:focus-visible': {
              outline: `3px solid ${colors.tealLight}`,
              outlineOffset: '2px',
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.9rem',
              bgcolor: user ? colors.tealPrimary : colors.rest,
              color: user ? colors.white : colors.muted,
            }}
          >
            {user ? (
              user.nome?.charAt(0)?.toUpperCase()
            ) : (
              <PersonOutlineOutlinedIcon fontSize="small" />
            )}
          </Avatar>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              lineHeight: 1.1,
            }}
          >
            {user ? (
              <>
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: colors.ink,
                  }}
                >
                  {user.nome}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    color: colors.muted,
                  }}
                >
                  {user.perfil}
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: colors.ink,
                }}
              >
                Entrar
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};