import type { CampaignStatus, CampaignRecord } from '../types/campaign';
import { getTodayISO } from './date';

/**
 * Calcula o status de uma campanha.
 *
 * Prioridade:
 * 1. `statusOverride`, se definido manualmente pelo administrador.
 * 2. Cálculo automático por data:
 *    - "agendada"  -> a publicação ainda está no futuro
 *    - "encerrada" -> a data de encerramento já passou
 *    - "ativa"     -> os demais casos
 *
 * IMPORTANTE: quando a API existir, tanto o status quanto o override podem
 * passar a vir prontos do back-end.
 */
export function calculateCampaignStatus(
  campaign: Pick<CampaignRecord, 'publishedAt' | 'endDate' | 'statusOverride'>,
  referenceDateISO: string = getTodayISO(),
): CampaignStatus {
  if (campaign.statusOverride) {
    return campaign.statusOverride;
  }

  if (campaign.publishedAt > referenceDateISO) {
    return 'agendada';
  }

  if (campaign.endDate < referenceDateISO) {
    return 'encerrada';
  }

  return 'ativa';
}