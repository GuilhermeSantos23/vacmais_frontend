const COMMON_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    verifyTwoFactor: '/auth/2fa/verificar',
    resendTwoFactor: '/auth/2fa/reenviar',
    logout: '/auth/logout',
  },
  account: {
    me: '/conta/eu',
    changePassword: '/conta/senha',
    configureTwoFactor: '/conta/dois-fatores',
    devices: '/conta/dispositivos',
  },
  campaigns: {
    active: '/campanhas/ativas',
  },
  notifications: {
    list: '/notificacoes',
    count: '/notificacoes/contagem',
    markAllRead: '/notificacoes/lidas',
    markRead: (notificationId: number) => `/notificacoes/${notificationId}/lida`,
  },
  catalogs: {
    vaccines: '/vacinas',
    vaccineDiseases: (vaccineId: number) => `/vacinas/${vaccineId}/doencas`,
    diseases: '/doencas',
    calendar: '/calendario',
    conditions: '/condicoes-catalogo',
    vaccineRestrictions: '/condicoes-catalogo/restricoes',
    specialProfessions: '/profissoes-especiais',
    healthInformation: '/informativos',
    nearbyUnits: '/unidades/proximas',
  },
  outbreaks: {
    alerts: '/surtos/alertas',
  },
} as const;


export const ENDPOINTS = {
  ...COMMON_ENDPOINTS,
  dashboard: {
    employees: '/dashboard/unidade/funcionarios',
    applicationsThisMonth: '/dashboard/unidade/aplicacoes-mes-atual',
    alerts: '/dashboard/unidade/alertas',
    campaigns: '/dashboard/unidade/campanhas',
  },
  unit: {
    me: '/unidade',
    updateContact: '/unidade/contato',
  },
  team: {
    list: '/equipe/profissionais',
    create: '/equipe/profissionais',
    updateStatus: (professionalId: number) => `/equipe/profissionais/${professionalId}/status`,
    confirmCoren: (professionalId: number) => `/equipe/profissionais/${professionalId}/coren`,
  },
  stock: {
    summary: '/estoque/resumo',
    shipments: '/estoque/remessas',
    shipmentBalance: (shipmentId: number) => `/estoque/remessas/${shipmentId}/baixa`,
    adjustments: '/estoque/ajustes',
    movements: '/estoque/movimentacoes',
  },
  campaignsManagement: {
    list: '/campanhas',
    create: '/campanhas',
    update: (campaignId: number) => `/campanhas/${campaignId}`,
  },
  history: {
    events: '/historico/eventos',
    patients: '/historico/pacientes',
    lots: '/historico/lotes',
    lotApplications: (lotId: number) => `/historico/lotes/${lotId}/aplicacoes`,
  },
} as const;
