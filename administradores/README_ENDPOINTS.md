# Endpoints do perfil — Administradores da Unidade

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

### Dashboard da unidade

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/dashboard/unidade/funcionarios` | Resumo de funcionários ativos da unidade. | Catalogado; pendente de integração da tela. |
| GET | `/dashboard/unidade/aplicacoes-mes-atual` | Resumo de aplicações do mês atual. | Catalogado; pendente de integração da tela. |
| GET | `/dashboard/unidade/alertas` | Alertas operacionais da unidade. | Catalogado; pendente de integração da tela. |
| GET | `/dashboard/unidade/campanhas` | Campanhas agrupadas por situação para a unidade. | Catalogado; pendente de integração da tela. |

### Unidade e equipe

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/unidade` | Consulta os dados da unidade vinculada à conta. | Catalogado; pendente. |
| PATCH | `/unidade/contato` | Atualiza os dados de contato da unidade. | Catalogado; pendente. |
| GET | `/equipe/profissionais` | Lista profissionais da unidade. | Catalogado; pendente. |
| POST | `/equipe/profissionais` | Cria profissional na unidade; a resposta inclui senha temporária uma única vez. | Catalogado; pendente. |
| PATCH | `/equipe/profissionais/{profissional_id}/status` | Altera o status de um profissional da própria unidade. | Catalogado; pendente. |
| POST | `/equipe/profissionais/{profissional_id}/coren` | Confirma o COREN do profissional. | Catalogado; pendente. |

### Estoque e campanhas

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/estoque/resumo` | Resume o estoque por doença. | Catalogado; pendente. |
| GET | `/estoque/remessas` | Lista remessas da unidade; aceita `com_saldo`. | Catalogado; pendente. |
| POST | `/estoque/remessas` | Cadastra uma remessa. | Catalogado; pendente. |
| POST | `/estoque/remessas/{remessa_id}/baixa` | Confirma retirada física de uma remessa. | Catalogado; pendente. |
| POST | `/estoque/ajustes` | Registra ajuste de estoque. | Catalogado; pendente. |
| GET | `/estoque/movimentacoes` | Lista movimentações; aceita `remessa_id` e `limite`. | Catalogado; pendente. |
| GET | `/campanhas` | Lista campanhas da unidade. | Catalogado; pendente. |
| POST | `/campanhas` | Cria campanha para a unidade. | Catalogado; pendente. |
| PATCH | `/campanhas/{campanha_id}` | Atualiza campanha da unidade. | Catalogado; pendente. |

### Histórico da unidade

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/historico/eventos` | Lista eventos de aplicação e caderneta; aceita filtros e paginação. | Catalogado; pendente. |
| GET | `/historico/pacientes` | Lista cidadãos com registros na unidade. | Catalogado; pendente. |
| GET | `/historico/lotes` | Pesquisa lote por código na unidade. | Catalogado; pendente. |
| GET | `/historico/lotes/{lote_id}/aplicacoes` | Lista pessoas que receberam doses daquele lote na unidade. | Catalogado; pendente. |

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
O backend entregue não possui recuperação de senha para este perfil. A tela antiga de recuperação permanece fora do fluxo integrado e não deve ser considerada funcional.


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

## Esqueci a senha — fluxo visual atual e contrato pendente

A tela `src/pages/EsqueciSenha/EsqueciSenha.tsx` mantém o fluxo visual de duas etapas: CPF + código da unidade (6 dígitos), depois código de e-mail (6 dígitos). Nesta entrega é um **mock de interface**: valida apenas o formato dos campos, não consulta a conta no banco, não recupera o e-mail, não envia mensagem e aprova qualquer sequência de seis dígitos. Após a aprovação simulada, retorna à tela `/login`. Não cria sessão, não altera senha e não deve ser apresentado como recuperação efetiva.

### Comportamento que o endpoint futuro deve implementar

1. Receber CPF e `codigo_unidade` (6 dígitos) e localizar uma única conta `admin_unidade` correspondente. A busca deve ser feita no banco do Vac+, sem consultar CPFHub.
2. Obter o e-mail cadastrado da conta encontrada. Nunca aceitar e-mail digitado livremente pelo solicitante.
3. Gerar código de seis dígitos, armazenar apenas representação segura/hash, vincular à conta e à solicitação, definir expiração, limite de tentativas e intervalo de reenvio, e enviar ao e-mail cadastrado.
4. Responder com mensagem neutra para não revelar se CPF/código correspondem a uma conta.
5. No endpoint de confirmação, comparar o código digitado com o código válido daquela solicitação. Se corresponder, aprovar o fluxo e devolver confirmação/token de uso único; se não, retornar erro sem aprovar.
6. Conforme a regra de experiência definida para esta entrega, após a aprovação o frontend retorna ao login. A confirmação por e-mail, por si só, não altera a senha nem cria sessão. Para efetiva redefinição de senha, a equipe Vac+ continua usando o procedimento assistido abaixo até o backend definir explicitamente outra operação.

**Esses endpoints de recuperação para `admin_unidade` ainda não existem no backend enviado.** Não inventar seus caminhos em `ENDPOINTS` até o Antigravity/backend definir o contrato. Documentar as rotas reais após sua implementação.

### Redefinição real disponível hoje

O backend entregue oferece procedimento interno pela equipe Vac+, usando `python -m app.scripts.suporte redefinir-senha --perfil admin_unidade --conta-id ... --operador ... --motivo ...`. Esse procedimento gera uma nova senha provisória (exibida uma única vez no terminal), marca `deve_trocar_senha=true`, reinicia bloqueio/tentativas e envia aviso ao e-mail. A equipe confirma a identidade e repassa a senha provisória. No login seguinte, o administrador deve trocá-la obrigatoriamente.

