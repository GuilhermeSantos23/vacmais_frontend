# Endpoints do perfil — Cidadãos

Este documento foi montado a partir das rotas declaradas no backend Vac+ entregue junto ao projeto. A constante `ENDPOINTS`, em `src/services/endpoints.ts`, mantém os caminhos centralizados para facilitar a futura integração das telas.

**Escopo desta entrega:** somente o fluxo de autenticação/sessão foi conectado nesta etapa. As demais rotas abaixo estão catalogadas, mas NÃO foram ligadas aos componentes nem substituíram os mocks. Essa migração será feita gradualmente, tela por tela, conforme solicitação posterior ao Antigravity.

## Configuração

Crie um arquivo `.env` na raiz desta aplicação com:

```env
VITE_API_URL=https://vacmais-backend.onrender.com
```

O arquivo `.env.example` serve apenas como modelo. Não coloque `DATABASE_URL`, `SECRET_KEY`, senha do Supabase, CPFHub API key ou outros segredos no frontend.

## Fluxo de autenticação — conectado

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/auth/login` | Confere CPF, senha e o código de acesso exigido pelo perfil. Não chama a API de consulta de CPF. |
| POST | `/auth/2fa/verificar` | Valida o código de 6 dígitos a partir de `desafio_token`. |
| POST | `/auth/2fa/reenviar` | Solicita novo código de segundo fator. |
| GET | `/conta/eu` | Recupera o perfil e o escopo da conta autenticada; também valida a sessão ao restaurar a aplicação. |
| POST | `/auth/logout` | Encerra a sessão/dispositivo atual no backend. |
| POST | `/conta/senha` | Troca a senha atual e permite concluir primeiro acesso quando `deve_trocar_senha` estiver ativo. |

A autenticação usa Bearer token. O cliente também atualiza a sessão quando o backend devolve `X-Novo-Token`.

## Endpoints disponíveis por perfil

### Cadastro e conta do cidadão

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| POST | `/cidadao/cadastro` | Cadastro público de conta. O schema exige aceite/versão dos termos; pode retornar 202 em validação pendente. | Catalogado; ainda não ligado ao formulário. O cadastro atual continua mock. |
| GET | `/cidadao/eu` | Consulta dados pessoais do cidadão vinculado. Pode ser bloqueado enquanto o vínculo estiver pendente. | Catalogado; usado para hidratar dados quando disponível. |
| GET | `/cidadao/eu/conta` | Consulta dados da conta do cidadão, incluindo vínculo, avatar e 2FA. | Catalogado; pendente. |
| POST | `/cidadao/vinculo/confirmar` | Confirma titularidade com CPF e nome completo da mãe ou do pai. | Catalogado; pendente. |
| POST | `/cidadao/localizacao-sessao` | Registra localização temporária após consentimento explícito. | Catalogado; pendente. |
| PATCH | `/cidadao/eu` | Atualiza dados pessoais; e-mail não pode ser alterado por esta rota. | Catalogado; pendente. |
| PUT | `/cidadao/avatar` | Atualiza cor/avatar da conta. | Catalogado; pendente. |
| PUT | `/cidadao/profissoes` | Define profissões especiais do cidadão. | Catalogado; pendente. |

### Caderneta do cidadão

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/cidadao/caderneta` | Lista registros vacinais da própria pessoa. | Catalogado; pendente. |
| GET | `/cidadao/caderneta/completa` | Retorna a caderneta completa. | Catalogado; pendente. |
| GET | `/cidadao/caderneta/situacao` | Retorna próximas doses, pendências e situação vacinal. | Catalogado; pendente. |
| POST | `/cidadao/caderneta/historico` | Cidadão registra uma dose antiga, sem remessa/baixa de estoque. | Catalogado; pendente. |
| PATCH | `/cidadao/caderneta/{registro_id}` | Corrige um registro da própria caderneta. | Catalogado; pendente. |
| POST | `/cidadao/caderneta/{registro_id}/anular` | Solicita anulação de um registro, conforme regras do backend. | Catalogado; pendente. |
| GET | `/cidadao/condicoes` | Lista condições de saúde do cidadão. | Catalogado; pendente. |

### E-mail e recuperação de acesso

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| POST | `/cidadao/email/solicitar` | Envia código ao novo e-mail, após confirmar senha atual. | Catalogado; pendente. |
| POST | `/cidadao/email/confirmar` | Confirma código e efetiva troca de e-mail. | Catalogado; pendente. |
| POST | `/auth/recuperacao/solicitar` | Solicita código de recuperação por CPF. | Catalogado; tela atual precisa ser alinhada. |
| POST | `/auth/recuperacao/validar` | Valida código e retorna token temporário de recuperação. | Catalogado; tela atual precisa ser alinhada. |
| POST | `/auth/recuperacao/nova-senha` | Define nova senha usando token de recuperação. | Catalogado; tela atual precisa ser alinhada. |
| POST | `/auth/recuperacao/entrar` | Entra sem trocar a senha após validar o token; pode iniciar 2FA. | Catalogado; tela atual precisa ser alinhada. |

## Outros endpoints comuns disponíveis

| Método | Endpoint | O que faz | Status nesta entrega |
|---|---|---|---|
| PUT | `/conta/dois-fatores` | Ativa ou desativa 2FA na conta autenticada. | Catalogado; tela ainda não conectada. |
| GET | `/conta/dispositivos` | Lista dispositivos/sessões conectados da conta. | Catalogado; tela ainda não conectada. |
| GET | `/notificacoes` | Lista notificações da própria conta; aceita `nao_lidas`. | Catalogado; tela ainda não conectada. |
| GET | `/notificacoes/contagem` | Conta notificações não lidas. | Catalogado; tela ainda não conectada. |
| POST | `/notificacoes/lidas` | Marca todas as notificações da conta como lidas. | Catalogado; tela ainda não conectada. |
| POST | `/notificacoes/{notificacao_id}/lida` | Marca uma notificação como lida. | Catalogado; tela ainda não conectada. |
| GET | `/vacinas` | Lista o catálogo de vacinas. | Catalogado; tela ainda não conectada. |
| GET | `/vacinas/{vacina_id}/doencas` | Lista doenças associadas a uma vacina. | Catalogado; tela ainda não conectada. |
| GET | `/doencas` | Lista doenças do catálogo. | Catalogado; tela ainda não conectada. |
| GET | `/calendario` | Lista o calendário vacinal. | Catalogado; tela ainda não conectada. |
| GET | `/condicoes-catalogo` | Lista condições de saúde do catálogo. | Catalogado; tela ainda não conectada. |
| GET | `/condicoes-catalogo/restricoes` | Lista restrições entre condições e vacinas. | Catalogado; tela ainda não conectada. |
| GET | `/profissoes-especiais` | Lista profissões especiais cadastradas. | Catalogado; tela ainda não conectada. |
| GET | `/informativos` | Lista informativos de saúde publicados. | Catalogado; tela ainda não conectada. |
| GET | `/unidades/proximas` | Lista unidades próximas usando latitude e longitude. | Catalogado; tela ainda não conectada. |
| GET | `/campanhas/ativas` | Lista campanhas em andamento; qualquer conta autenticada pode consultar. | Catalogado; tela ainda não conectada. |
| GET | `/surtos/alertas` | Lista alertas indicativos de surto para o escopo da conta. | Catalogado; tela ainda não conectada. |

## Regra de senha e primeiro acesso — regra funcional oficial

### Contas administrativas e profissionais (três perfis com senha provisória)

Os perfis `admin_unidade`, `admin_regional` e `profissional` seguem a mesma regra:

1. A conta é provisionada por um responsável autorizado. Para `profissional`, a regra funcional definida para o Vac+ é que o cadastro seja realizado pelo Administrador Regional.
2. O sistema gera uma senha provisória aleatória. A senha provisória é entregue ao usuário pelo canal definido pelo backend; o banco guarda somente o hash.
3. No primeiro login, o usuário informa os campos normais do perfil (CPF, senha provisória e código de unidade ou regional quando aplicável).
4. O login valida credenciais e retorna `deve_trocar_senha=true` quando a conta ainda exige a troca. Se houver 2FA ativo, essa indicação é retornada depois de `POST /auth/2fa/verificar`.
5. O frontend bloqueia as rotas operacionais e encaminha a pessoa para `/alterar-senha`. Ela informa senha atual (provisória), nova senha e confirmação.
6. `POST /conta/senha` grava somente o hash da nova senha, zera `deve_trocar_senha` e limpa a expiração da senha provisória. A senha provisória deixa de funcionar; a nova senha passa a ser a senha definitiva.
7. Nos logins seguintes, a pessoa utiliza sua senha definitiva. Para os três perfis não cidadãos, a troca voluntária por essa rota não é permitida depois do primeiro acesso: o backend retorna `403` quando `deve_trocar_senha=false`.
8. Se esquecer a senha depois da troca inicial, deve solicitar ajuda à equipe Vac+. A equipe confirma a identidade e executa a redefinição assistida, que gera outra senha provisória e marca novamente `deve_trocar_senha=true`. O próximo login volta a exigir a troca.

**Importante:** o frontend não inventa a condição de primeiro acesso. Ele obedece exclusivamente ao `deve_trocar_senha` informado pelo backend. O guard da rota `/alterar-senha` só permite abrir essa tela quando a flag é verdadeira. A flag é reconsultada em `GET /conta/eu` ao restaurar a sessão.

### Cidadão (único perfil sem senha provisória)

O cidadão cria a própria conta e escolhe uma senha definitiva durante o cadastro. Não recebe senha provisória e não deve ser encaminhado à troca obrigatória no primeiro acesso. Diferentemente dos outros três perfis, pode alterar a própria senha autenticado por `POST /conta/senha` e possui o fluxo de recuperação de acesso por e-mail implementado no backend.

## Situação dos dados da interface
A recuperação do Cidadão está catalogada, mas a tela `RecuperarAcesso` ainda não foi conectada nesta etapa.


- Login, segundo fator, sessão, restauração após recarregar, proteção de rotas, logout e troca obrigatória de senha são integrados ao Render.
- Dashboards, relatórios, perfil, gestão e demais telas continuam usando o que já existia no frontend (incluindo mocks ou estado local), a menos que o README marque explicitamente o fluxo como conectado.
- Criar uma constante em `ENDPOINTS` não significa que uma tela já consome aquele endpoint.
- Nenhuma tela operacional foi migrada para dados reais nesta etapa.

## Restrições importantes do backend

- O login de Administrador da Unidade e Profissional exige `codigo_unidade` com exatamente 6 dígitos.
- O login de Administrador Regional exige `codigo_regional` no formato `SAR` + 2 dígitos (ex.: `SAR05`).
- O login de Cidadão não envia código de unidade/regional.
- O login e o `GET /conta/eu` não consultam a CPFHub; não consomem crédito da API de busca de CPF.
- Se `deve_trocar_senha` vier verdadeiro, o sistema mantém as rotas operacionais bloqueadas e direciona para a tela de troca de senha.

## Recuperação de acesso do Cidadão — mock atual e contrato existente no backend

A tela `src/pages/RecuperarAcesso/RecuperarAcesso.tsx` segue o padrão visual combinado: CPF, código de e-mail de 6 dígitos, aprovação e retorno para `/login`. Nesta entrega, `src/services/recuperacaoService.ts` é **mock**: aceita CPF com 11 dígitos e qualquer código de 6 dígitos; não consulta a conta no banco, não recupera e-mail, não envia e-mail real, não cria sessão e não altera senha. A tela não deve apresentar esse mock como recuperação real.

O backend enviado já possui um fluxo HTTP de recuperação exclusivo para `cidadao`:

1. `POST /auth/recuperacao/solicitar` — recebe `{ "cpf": "..." }`. O backend responde com mensagem neutra; quando a conta está ativa, gera e envia código ao e-mail cadastrado.
2. `POST /auth/recuperacao/validar` — recebe `{ "cpf": "...", "codigo": "123456" }`. Se válido, retorna `recuperacao_token` de curta duração e uso único.
3. O token deve ser consumido por uma destas opções:
   - `POST /auth/recuperacao/nova-senha` — recebe `{ "recuperacao_token": "...", "senha_nova": "...", "confirmacao": "..." }`, grava nova senha e orienta o cidadão a entrar pelo login.
   - `POST /auth/recuperacao/entrar` — recebe `{ "recuperacao_token": "..." }` e autentica sem alterar senha; se houver 2FA, inicia o segundo fator.

**Diferença a alinhar com a regra de UX solicitada:** o frontend nesta etapa retorna ao login depois da aprovação demonstrativa, enquanto o backend atual retorna um token e exige a escolha entre trocar a senha ou entrar sem trocá-la. O Antigravity deve alinhar o contrato/tela antes de substituir o mock por chamadas reais. Não validar um código no backend e descartar o `recuperacao_token`, pois isso deixaria a recuperação incompleta.

O cidadão é o único perfil sem senha provisória no fluxo normal: escolhe sua senha definitiva no cadastro. A rota `POST /conta/senha` também permite ao cidadão alterar a senha autenticado, diferentemente dos três perfis administrativos/profissionais, que só podem usá-la no primeiro acesso marcado por `deve_trocar_senha=true`.
