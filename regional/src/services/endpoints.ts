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
    activeUnits: '/dashboard/regional/unidades-ativas',
    applicationsByMonth: '/dashboard/regional/aplicacoes-por-mes',
    topUnits: '/dashboard/regional/top-unidades',
    stock: '/dashboard/regional/estoque',
  },
  regional: {
    me: '/regional/regiao',
    units: '/regional/unidades',
    createUnit: '/regional/unidades',
    updateUnitStatus: (unitId: number) => `/regional/unidades/${unitId}/status`,
    createUnitAdministrator: (unitId: number) => `/regional/unidades/${unitId}/administradores`,
    cnes: (cnesCode: string) => `/regional/cnes/${encodeURIComponent(cnesCode)}`,
  },
} as const;
