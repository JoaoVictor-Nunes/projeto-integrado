import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { colors } from '@/theme/tokens';
import { botaoPrimarioSx, botaoSecundarioSx } from './perfil.styles';

const TAMANHO_MAX_FOTO = 2 * 1024 * 1024; // 2 MB

/**
 * Avatar + identificação do usuário + botões de foto.
 *
 * A foto é apenas uma PRÉVIA local (não é enviada ao servidor), porque a API
 * ainda não tem endpoint de upload. Quando existir, é só enviar `file` dentro
 * de `handleFoto` e guardar a URL retornada.
 */
export const CabecalhoPerfil = ({ nome, perfilLabel, matricula, onErroFoto }) => {
  const inputRef = useRef(null);
  const [fotoUrl, setFotoUrl] = useState(null);

  // Libera a URL temporária da prévia anterior (ao trocar ou desmontar).
  useEffect(
    () => () => {
      if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    },
    [fotoUrl],
  );

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite escolher o mesmo arquivo de novo
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onErroFoto?.('Escolha um arquivo de imagem (JPG, PNG ou WEBP).');
      return;
    }
    if (file.size > TAMANHO_MAX_FOTO) {
      onErroFoto?.('A foto deve ter no máximo 2 MB.');
      return;
    }
    setFotoUrl(URL.createObjectURL(file));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
        <Avatar
          src={fotoUrl ?? undefined}
          alt={nome ? `Foto de ${nome}` : 'Foto do perfil'}
          sx={{
            width: 76,
            height: 76,
            fontSize: '1.8rem',
            fontWeight: 600,
            bgcolor: colors.tealPrimary,
            color: colors.white,
          }}
        >
          {nome?.charAt(0)?.toUpperCase()}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: colors.ink, overflowWrap: 'anywhere' }}>
            {nome}
          </Typography>
          <Typography sx={{ fontSize: '0.92rem', color: colors.tealMid, fontWeight: 500 }}>
            {perfilLabel}
          </Typography>
          {matricula && (
            <Typography sx={{ fontSize: '0.8rem', color: colors.muted }}>
              Matrícula {matricula}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          aria-label="Escolher foto do perfil"
          onChange={handleFoto}
        />
        <Button
          type="button"
          variant="contained"
          disableElevation
          onClick={() => inputRef.current?.click()}
          sx={botaoPrimarioSx}
        >
          Enviar nova foto
        </Button>
        <Button
          type="button"
          variant="outlined"
          disabled={!fotoUrl}
          onClick={() => setFotoUrl(null)}
          sx={botaoSecundarioSx}
        >
          Remover foto
        </Button>
      </Box>
    </Box>
  );
};

export default CabecalhoPerfil;
