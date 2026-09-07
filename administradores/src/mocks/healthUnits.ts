import type { HealthUnit } from '../types/campaign';

// Dados fictícios de unidades de saúde, usados apenas para demonstrar o
// componente de busca/autocomplete enquanto não existe uma API real.
// Ver `services/healthUnitService.ts` para a função que "busca" esses dados.
export const healthUnitsMock: HealthUnit[] = [
  { id: 1, name: 'UBS Alvorada', address: 'Rua das Acácias, 120', region: 'Zona Norte' },
  { id: 2, name: 'UBS Jardim Aliança', address: 'Av. Aliança, 45', region: 'Zona Leste' },
  { id: 3, name: 'UBS Vila Aliança', address: 'Rua Vila Aliança, 300', region: 'Zona Leste' },
  { id: 4, name: 'UBS Jardim São João', address: 'Rua São João, 88', region: 'Centro' },
  { id: 5, name: 'UBS Centro', address: 'Praça Central, 10', region: 'Centro' },
  { id: 6, name: 'UBS Vila Galvão', address: 'Rua Galvão, 512', region: 'Zona Sul' },
  { id: 7, name: 'UBS Bela Vista', address: 'Rua Bela Vista, 77', region: 'Zona Oeste' },
  { id: 8, name: 'UBS Parque das Flores', address: 'Av. das Flores, 900', region: 'Zona Sul' },
];
