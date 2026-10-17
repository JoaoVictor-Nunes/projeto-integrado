import { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BookCover } from './BookCover';
import { colors } from '@/theme/tokens';

/**
 * Carrossel horizontal de capas, com scroll-snap (funciona por toque,
 * mouse e teclado) e botões de seta para desktop.
 */
export const BookCarousel = ({ books }) => {
  const trackRef = useRef(null);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  const arrowSx = {
    backgroundColor: colors.white,
    border: `1px solid ${colors.restBorder}`,
    color: colors.ink,
    '&:hover': { backgroundColor: colors.tealGhost },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <IconButton aria-label="Ver obras anteriores" onClick={() => scrollByPage(-1)} sx={arrowSx}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton aria-label="Ver próximas obras" onClick={() => scrollByPage(1)} sx={arrowSx}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        ref={trackRef}
        role="list"
        aria-label="Obras em destaque"
        tabIndex={0}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          pb: 3,
          px: 0.5,
          '&:focus-visible': { outline: `3px solid ${colors.tealLight}`, outlineOffset: '2px' },
        }}
      >
        {books.map((book) => (
          <Box key={book.id} role="listitem" sx={{ scrollSnapAlign: 'start' }}>
            <BookCover titulo={book.titulo} autor={book.autor} bg={book.bg} width={170} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};