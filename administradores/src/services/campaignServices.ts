import type { Campaign, CampaignFormData, CampaignRecord, CampaignStatus } from '../types/campaign';
import { campaignsMock } from '../mocks/campaigns';
import { calculateCampaignStatus } from '../utils/campaignStatus';

const SIMULATED_LATENCY_MS = 400;

let campaignRecords: CampaignRecord[] = campaignsMock.map((campaign) => ({ ...campaign }));

function toCampaign(record: CampaignRecord): Campaign {
  return {
    ...record,
    status: calculateCampaignStatus(record),
  };
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export function getCampaigns(): Promise<Campaign[]> {
  return delay(campaignRecords.map(toCampaign));
}

export function getCampaignById(id: number): Promise<Campaign | undefined> {
  const record = campaignRecords.find((campaign) => campaign.id === id);
  return delay(record ? toCampaign(record) : undefined);
}

/**
 * Cria uma campanha. `publishedAt` vem do formulário: se for a data de
 * hoje, a campanha nasce "ativa"; se for uma data futura, nasce
 * "agendada" até lá (ver `calculateCampaignStatus`).
 */
export function createCampaign(data: CampaignFormData): Promise<Campaign> {
  const novaCampanha: CampaignRecord = {
    id: Date.now(),
    title: data.title,
    description: data.description,
    image: data.image,
    publishedAt: data.publishedAt,
    endDate: data.endDate,
    locations: data.locations,
  };

  campaignRecords = [novaCampanha, ...campaignRecords];
  return delay(toCampaign(novaCampanha));
}

/**
 * Atualiza uma campanha existente, incluindo `publishedAt` (o formulário
 * só permite editá-la enquanto a campanha ainda estiver "agendada").
 * Qualquer `statusOverride` manual é limpo aqui, para o status voltar a
 * ser calculado pelas novas datas.
 */
export function updateCampaign(id: number, data: CampaignFormData): Promise<Campaign | undefined> {
  let atualizada: CampaignRecord | undefined;

  campaignRecords = campaignRecords.map((campaign) => {
    if (campaign.id !== id) return campaign;

    atualizada = {
      ...campaign,
      title: data.title,
      description: data.description,
      image: data.image,
      publishedAt: data.publishedAt,
      endDate: data.endDate,
      locations: data.locations,
      statusOverride: null,
    };
    return atualizada;
  });

  return delay(atualizada ? toCampaign(atualizada) : undefined);
}

/**
 * Define um status manual para a campanha (override), sobrepondo o
 * cálculo automático por data. Usado pelo seletor de status no card.
 */
export function updateCampaignStatus(id: number, status: CampaignStatus): Promise<Campaign | undefined> {
  let atualizada: CampaignRecord | undefined;

  campaignRecords = campaignRecords.map((campaign) => {
    if (campaign.id !== id) return campaign;

    atualizada = { ...campaign, statusOverride: status };
    return atualizada;
  });

  return delay(atualizada ? toCampaign(atualizada) : undefined);
}

export function deleteCampaign(id: number): Promise<void> {
  campaignRecords = campaignRecords.filter((campaign) => campaign.id !== id);
  return delay(undefined);
}