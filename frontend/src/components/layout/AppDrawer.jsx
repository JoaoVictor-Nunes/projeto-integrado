import { useState } from 'react';
import { Box, Tooltip, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useDrawerItems } from '@/hooks/useDrawerItems';
import { colors, drawer, transitions } from '@/theme/tokens';

export const AppDrawer = ({ perfil, onLogout }) => {
  const itens = useDrawerItems(perfil);
  const [hovered, setHovered] = useState(false);
  const collapsed = !hovered;
  const largura = collapsed ? drawer.collapsedWidth : drawer.expandedWidth;

  return (
    <Box
      component="nav"
      aria-label="Menu principal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: largura,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.white,
        borderRight: `1px solid ${colors.restBorder}`,
        transition: `width ${transitions.sidebar}`,
        overflow: 'hidden',
      }}
    >
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          margin: 0,
          padding: '12px 8px 0',
          flex: 1,
        }}
      >
        {itens.map(({ label, path, Icon }) => (
          <Box component="li" key={path} sx={{ marginBottom: '4px' }}>
            <ItemDrawer
              label={label}
              path={path}
              Icon={Icon}
              collapsed={collapsed}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: colors.restBorder }} />

      <Box sx={{ padding: '8px' }}>
        <Box
          component="button"
          onClick={onLogout}
          aria-label="Sair"
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            color: colors.muted,
            transition: `background-color ${transitions.fast}, color ${transitions.fast}`,
            '&:hover': {
              backgroundColor: colors.tealGhost,
              color: colors.danger,
            },
            '&:focus-visible': {
              outline: `3px solid ${colors.tealLight}`,
              outlineOffset: '2px',
            },
          }}
        >
          <IconBox>
            <LogoutOutlinedIcon fontSize="small" />
          </IconBox>

          <Box
            component="span"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              opacity: collapsed ? 0 : 1,
              transition: `opacity ${transitions.sidebar}`,
            }}
          >
            Sair
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const IconBox = ({ children }) => (
  <Box
    sx={{
      width: 48,
      height: 40,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </Box>
);

const ItemDrawer = ({ label, path, Icon, collapsed }) => (
  <Tooltip title={collapsed ? label : ''} placement="right">
    <NavLink to={path} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 40,
            borderRadius: '10px',
            borderLeft: isActive
              ? `4px solid ${colors.tealPrimary}`
              : '4px solid transparent',
            backgroundColor: isActive
              ? colors.tealGhost
              : 'transparent',
            color: isActive ? colors.tealDeep : colors.muted,
            transition: `background-color ${transitions.fast}, color ${transitions.fast}`,
            '&:hover': {
              backgroundColor: colors.tealGhost,
              color: colors.tealDeep,
            },
            '&:focus-visible': {
              outline: `3px solid ${colors.tealLight}`,
              outlineOffset: '2px',
            },
          }}
        >
          <IconBox>
            <Icon fontSize="small" />
          </IconBox>

          <Box
            component="span"
            sx={{
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              whiteSpace: 'nowrap',
              opacity: collapsed ? 0 : 1,
              transition: `opacity ${transitions.sidebar}`,
            }}
          >
            {label}
          </Box>
        </Box>
      )}
    </NavLink>
  </Tooltip>
); 