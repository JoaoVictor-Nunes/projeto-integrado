import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BookCover } from '../components/BookCover';
import { FEATURED_BOOKS } from '../data/landingMocks';
import { scrollToSection } from '../utils/scrollToSection';
import { colors } from '@/theme/tokens';

// Três capas sobrepostas e levemente inclinadas, só no desktop.
const HERO_BOOKS = FEATURED_BOOKS.slice(0, 3);
const POSES = [
  { transform: 'rotate(-8deg) translateY(24px)', zIndex: 1 },
  { transform: 'rotate(0deg) translateY(-16px)', zIndex: 3 },
  { transform: 'rotate(8deg) translateY(24px)', zIndex: 2 },
];

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      aria-labelledby="hero-titulo"
      sx={{
        color: colors.white,
        background: `linear-gradient(135deg, ${colors.tealDeep} 0%, ${colors.tealMid} 100%)`,
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Box>
          <Typography
            id="hero-titulo"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.1rem', md: '3rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Todo o conhecimento da sua instituição, a um clique de distância.
          </Typography>
          <Typography sx={{ mt: 3, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.6, opacity: 0.92, maxWidth: 520 }}>
            Acesso unificado a livros, apostilas e artigos digitais, para estudar e pesquisar de onde estiver.
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: colors.white,
                color: colors.tealDeep,
                borderRadius: '9999px',
                px: 4,
                py: 1.5,
                '&:hover': { backgroundColor: colors.tealGhost },
              }}
            >
              Explorar Acervo
            </Button>
            <Button
              onClick={() => scrollToSection('sobre')}
              sx={{
                color: colors.white,
                border: '1.5px solid rgba(255,255,255,0.9)',
                borderRadius: '9999px',
                px: 4,
                py: 1.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
              }}
            >
              Conheça a Plataforma
            </Button>
          </Box>
        </Box>

        {/* Decorativo: escondido de leitores de tela e do mobile */}
        <Box
          aria-hidden="true"
          sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', ml: -4 }}
        >
          {HERO_BOOKS.map((book, i) => (
            <BookCover
              key={book.id}
              titulo={book.titulo}
              autor={book.autor}
              bg={book.bg}
              width={170}
              sx={{ ...POSES[i], ml: i === 0 ? 0 : -5, border: '1px solid rgba(255,255,255,0.18)' }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};