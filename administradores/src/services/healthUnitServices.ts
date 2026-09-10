import type { HealthUnit } from '../types/campaign';
import { healthUnitsMock } from '../mocks/healthUnits';

// Camada de serviço para unidades de saúde.
//
// Hoje ela só filtra o array mockado, mas a assinatura (função async que
// devolve uma Promise) já é a mesma que uma chamada HTTP teria. Quando a API
// existir, basta trocar o corpo de `searchHealthUnits` por algo como:
//
//   export async function searchHealthUnits(query: string): Promise<HealthUnit[]> {
//     const response = await fetch(`/health-units?search=${encodeURIComponent(query)}`);
//     return response.json();
//   }
//
// Nenhum componente que usa esse serviço precisa mudar.
const SIMULATED_LATENCY_MS = 300;

export function searchHealthUnits(query: string): Promise<HealthUnit[]> {
  const termo = query.trim().toLowerCase();

  return new Promise((resolve) => {
    setTimeout(() => {
      if (!termo) {
        resolve(healthUnitsMock);
        return;
      }

      resolve(
        healthUnitsMock.filter((unit) => unit.name.toLowerCase().includes(termo)),
      );
    }, SIMULATED_LATENCY_MS);
  });
}
