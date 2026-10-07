import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';

/**
 * Itens disponíveis para ALUNO e PROFESSOR (usuário "simples").
 * Guardamos o componente do ícone (não a instância <Icon />) para que
 * cada consumidor decida como renderizá-lo (tamanho, cor do estado ativo).
 */
const ITENS_BASE = [
  { label: 'Início', path: '/home', Icon: HomeOutlinedIcon },
  { label: 'Acervo', path: '/acervo', Icon: LibraryBooksOutlinedIcon },
  { label: 'Meus Livros', path: '/meus-livros', Icon: MenuBookOutlinedIcon },
  { label: 'Histórico', path: '/historico', Icon: HistoryOutlinedIcon },
  { label: 'Favoritos', path: '/favoritos', Icon: FavoriteBorderOutlinedIcon },
];

/** Itens extras, visíveis somente para ADMINISTRADOR. */
const ITENS_ADMIN = [
  { label: 'Central de Admin', path: '/admin/dashboard', Icon: AdminPanelSettingsOutlinedIcon },
  { label: 'Gerenciar Usuários', path: '/admin/usuarios', Icon: GroupOutlinedIcon },
  { label: 'Gerenciar Livros', path: '/admin/livros', Icon: CollectionsBookmarkOutlinedIcon },
];

/**
 * Retorna a lista de itens do drawer de acordo com o perfil do usuário.
 * ALUNO/PROFESSOR veem só o essencial; ADMINISTRADOR vê tudo.
 *
 * @param {string} perfil - 'ALUNO' | 'PROFESSOR' | 'ADMINISTRADOR'
 */
export function useDrawerItems(perfil) {
  if (perfil === 'ADMINISTRADOR') {
    return [...ITENS_BASE, ...ITENS_ADMIN];
  }
  return ITENS_BASE;
}