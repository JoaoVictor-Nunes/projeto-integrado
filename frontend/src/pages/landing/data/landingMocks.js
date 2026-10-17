import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { colors } from '@/theme/tokens';

/**
 * Dados MOCK da landing page. Quando a API estiver conectada, basta
 * substituir estes arrays por chamadas de serviço — os componentes
 * de seção só dependem do formato dos objetos.
 * (Números e títulos abaixo são fictícios.)
 */

export const NAV_LINKS = [
  { label: 'A plataforma', target: 'sobre' },
  { label: 'Para instituições', target: 'instituicoes' },
  { label: 'Acervo', target: 'acervo' },
];

export const PLATFORM_HIGHLIGHTS = [
  {
    Icon: DevicesOutlinedIcon,
    title: 'Acesso de qualquer lugar',
    text: 'Entre pelo computador, tablet ou celular e continue a leitura de onde parou, sem filas nem horário de funcionamento.',
  },
  {
    Icon: ChromeReaderModeOutlinedIcon,
    title: 'Leitura online',
    text: 'Leia no próprio navegador, com marcação de páginas e favoritos, sem precisar instalar nada.',
  },
  {
    Icon: AccessibilityNewOutlinedIcon,
    title: 'Pensada para todos',
    text: 'Interface com alto contraste, navegação por teclado e compatibilidade com leitores de tela.',
  },
];

export const STATS = [
  { value: '+12 mil', label: 'títulos no acervo' },
  { value: '24h', label: 'acesso todos os dias' },
  { value: '100%', label: 'digital e online' },
];

export const AUDIENCES = [
  {
    Icon: AutoStoriesOutlinedIcon,
    title: 'Ensino Médio',
    text: 'Materiais didáticos, apostilas e obras de preparação para vestibulares e ENEM, sempre à mão do estudante.',
    tags: ['Didáticos', 'Vestibular', 'Literatura'],
  },
  {
    Icon: SchoolOutlinedIcon,
    title: 'Ensino Superior',
    text: 'Artigos, periódicos e bibliografias acadêmicas para apoiar disciplinas, projetos e trabalhos de conclusão.',
    tags: ['Periódicos', 'Artigos', 'Bibliografia'],
  },
  {
    Icon: InsightsOutlinedIcon,
    title: 'Gestão Escolar',
    text: 'Relatórios de uso e indicadores de engajamento em um painel, para acompanhar a leitura na instituição.',
    tags: ['Relatórios', 'Dashboard', 'Engajamento'],
  },
];

export const CATEGORIES = [
  { Icon: MenuBookOutlinedIcon, name: 'Literatura', count: '2.400 títulos' },
  { Icon: CalculateOutlinedIcon, name: 'Exatas', count: '1.850 títulos' },
  { Icon: PublicOutlinedIcon, name: 'Humanas', count: '2.100 títulos' },
  { Icon: MemoryOutlinedIcon, name: 'Tecnologia', count: '1.600 títulos' },
  { Icon: BiotechOutlinedIcon, name: 'Ciências da Vida', count: '1.300 títulos' },
  { Icon: PaletteOutlinedIcon, name: 'Artes e Cultura', count: '900 títulos' },
];

export const FEATURED_BOOKS = [
  { id: 1, titulo: 'Fundamentos de Cálculo', autor: 'A. Ribeiro', bg: colors.tealDeep },
  { id: 2, titulo: 'Histórias do Sertão', autor: 'M. Andrade', bg: colors.tealPrimary },
  { id: 3, titulo: 'Introdução à Programação', autor: 'L. Torres', bg: colors.info },
  { id: 4, titulo: 'Biologia Celular', autor: 'C. Mendes', bg: colors.tealMid },
  { id: 5, titulo: 'Filosofia para Jovens', autor: 'R. Duarte', bg: colors.ink },
  { id: 6, titulo: 'Química em Ação', autor: 'T. Farias', bg: colors.tealSoft },
  { id: 7, titulo: 'Arte e Sociedade', autor: 'P. Guedes', bg: colors.tealDeep },
  { id: 8, titulo: 'Redação Nota Mil', autor: 'S. Lacerda', bg: colors.tealPrimary },
];