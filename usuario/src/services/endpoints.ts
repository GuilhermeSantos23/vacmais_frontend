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
  auth: {
    ...COMMON_ENDPOINTS.auth,
    requestPasswordRecovery: '/auth/recuperacao/solicitar',
    validatePasswordRecovery: '/auth/recuperacao/validar',
    setNewPasswordFromRecovery: '/auth/recuperacao/nova-senha',
    enterWithoutChangingPassword: '/auth/recuperacao/entrar',
  },
  citizen: {
    register: '/cidadao/cadastro',
    me: '/cidadao/eu',
    account: '/cidadao/eu/conta',
    confirmLink: '/cidadao/vinculo/confirmar',
    sessionLocation: '/cidadao/localizacao-sessao',
    updateMe: '/cidadao/eu',
    avatar: '/cidadao/avatar',
    professions: '/cidadao/profissoes',
    booklet: '/cidadao/caderneta',
    completeBooklet: '/cidadao/caderneta/completa',
    bookletStatus: '/cidadao/caderneta/situacao',
    addHistory: '/cidadao/caderneta/historico',
    updateRecord: (recordId: number) => `/cidadao/caderneta/${recordId}`,
    cancelRecord: (recordId: number) => `/cidadao/caderneta/${recordId}/anular`,
    conditions: '/cidadao/condicoes',
    requestEmailChange: '/cidadao/email/solicitar',
    confirmEmailChange: '/cidadao/email/confirmar',
  },
} as const;
