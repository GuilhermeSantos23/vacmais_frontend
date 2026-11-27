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
  unit: {
    me: '/unidade',
  },
  citizens: {
    searchByCpf: '/cidadaos/busca',
    validateSearch: '/cidadaos/pesquisa',
    createSimplified: '/cidadaos/cadastro-simplificado',
    createWithBooklet: '/cidadaos',
    byId: (citizenId: number) => `/cidadaos/${citizenId}`,
    update: (citizenId: number) => `/cidadaos/${citizenId}`,
    bookletCards: (citizenId: number) => `/cidadaos/${citizenId}/caderneta/cards`,
    registerBooklet: (citizenId: number) => `/cidadaos/${citizenId}/caderneta/registrar`,
    booklet: (citizenId: number) => `/cidadaos/${citizenId}/caderneta`,
    bookletAssembly: (citizenId: number) => `/cidadaos/${citizenId}/caderneta/montagem`,
    confirmBooklet: (citizenId: number) => `/cidadaos/${citizenId}/caderneta/confirmar`,
    completeBooklet: (citizenId: number) => `/cidadaos/${citizenId}/caderneta/completa`,
    vaccinationStatus: (citizenId: number) => `/cidadaos/${citizenId}/situacao`,
    conditions: (citizenId: number) => `/cidadaos/${citizenId}/condicoes`,
  },
  vaccinations: {
    applications: (citizenId: number) => `/cidadaos/${citizenId}/aplicacoes`,
    history: (citizenId: number) => `/cidadaos/${citizenId}/historico`,
    notPerformed: (citizenId: number) => `/cidadaos/${citizenId}/nao-realizadas`,
    updateRecord: (recordId: number) => `/registros/${recordId}`,
    cancelRecord: (recordId: number) => `/registros/${recordId}/anular`,
  },
  citizenConditions: {
    create: (citizenId: number) => `/cidadaos/${citizenId}/condicoes`,
    update: (conditionId: number) => `/condicoes/${conditionId}`,
  },
  stock: {
    availableShipments: '/remessas-disponiveis',
  },
  history: {
    events: '/historico/eventos',
    patients: '/historico/pacientes',
    lots: '/historico/lotes',
    lotApplications: (lotId: number) => `/historico/lotes/${lotId}/aplicacoes`,
  },
} as const;
