// Tipos relacionados à tela "Campanhas e Alertas".
// Mantidos simples de propósito: a ideia é que, quando a API existir,
// esses mesmos tipos sirvam de contrato entre back-end e front-end.

/** Estado visual de uma campanha, calculado a partir das datas. */
export type CampaignStatus = 'ativa' | 'agendada' | 'encerrada';

/** Unidade de saúde (UBS/clínica) que pode ser vinculada a uma campanha. */
export interface HealthUnit {
  id: number;
  name: string;
  address?: string;
  region?: string;
}

/**
 * Campanha já "pronta para exibição": inclui o status calculado.
 * É o formato que a página e os componentes de listagem consomem.
 */
export interface Campaign {
  id: number;
  title: string;
  description: string;
  /** Data-URL (preview local) ou URL vinda de uma futura API. `null` = sem imagem. */
  image: string | null;
  /**
   * Data em que a campanha fica visível para os usuários, no formato ISO
   * (yyyy-mm-dd). Definida no formulário: hoje = publicação imediata,
   * data futura = campanha "agendada" até lá.
   */
  publishedAt: string;
  /** Data de encerramento no formato ISO (yyyy-mm-dd). */
  endDate: string;
  locations: HealthUnit[];
  status: CampaignStatus;
}

/**
 * Dados brutos de uma campanha, como ficam armazenados no mock/"banco".
 * Não inclui `status` porque ele é sempre calculado (ver `campaignStatus.ts`),
 * o que deixa fácil substituir esse cálculo por um campo vindo da API no futuro.
 */
export type CampaignRecord = Omit<Campaign, 'status'> & {
  /**
   * Status definido manualmente pelo administrador via botão na tela de
   * Campanhas. Quando presente, tem prioridade sobre o cálculo automático
   * por data (ver `calculateCampaignStatus`). `null`/ausente = volta a
   * calcular pelo `publishedAt`/`endDate` normalmente.
   */
  statusOverride?: CampaignStatus | null;
};

/** Dados enviados pelo formulário de criação/edição de campanha. */
export interface CampaignFormData {
  title: string;
  description: string;
  image: string | null;
  publishedAt: string;
  endDate: string;
  locations: HealthUnit[];
}