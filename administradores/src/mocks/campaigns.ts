import type { CampaignRecord } from '../types/campaign';
import { healthUnitsMock } from './healthUnits';

const ubsAlvorada = healthUnitsMock[0];
const ubsCentro = healthUnitsMock[4];
const ubsJardimSaoJoao = healthUnitsMock[3];
const ubsVilaGalvao = healthUnitsMock[5];

// Dados fictícios apenas para reproduzir a interface visual e permitir
// testar busca, edição e os três estados de status (ativa/agendada/encerrada).
// Datas escolhidas em torno da data atual para que os três estados apareçam.
export const campaignsMock: CampaignRecord[] = [
  {
    id: 1,
    title: 'Campanha de vacinação contra a Gripe',
    description: 'Vacine-se e proteja você e sua família.',
    image: null,
    publishedAt: '2026-08-10',
    endDate: '2026-12-09',
    locations: [ubsAlvorada],
  },
  {
    id: 2,
    title: 'Multivacinação infantil',
    description: 'Atualize a caderneta de vacinação das crianças da região.',
    image: null,
    publishedAt: '2026-10-01',
    endDate: '2026-10-31',
    locations: [ubsCentro, ubsJardimSaoJoao],
  },
  {
    id: 3,
    title: 'Campanha contra a Dengue',
    description: 'Ação de conscientização e vacinação contra a dengue.',
    image: null,
    publishedAt: '2026-01-15',
    endDate: '2026-03-15',
    locations: [ubsVilaGalvao],
  },
];
