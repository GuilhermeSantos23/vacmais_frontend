# Endpoints do perfil — Profissionais

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

### Dados do cidadão e pesquisa

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/unidade` | Consulta a unidade à qual o profissional pertence. | Catalogado; pendente. |
| GET | `/cidadaos/busca` | Busca cidadão por CPF já registrado localmente, sem consulta externa de CPFHub. | Catalogado; pendente. |
| POST | `/cidadaos/pesquisa` | Pesquisa CPF + data de nascimento; banco local primeiro e CPFHub somente quando necessário. Retorna situação e, quando aplicável, `token_validacao`. | Catalogado; pendente. |
| POST | `/cidadaos/cadastro-simplificado` | Cadastra cidadão com token de validação já obtido pela pesquisa. | Catalogado; pendente. |
| GET | `/cidadaos/pesquisa` | Pesquisa paciente por CPF e data de nascimento para o fluxo de caderneta; CPFHub pode ser consultada quando necessário. | Catalogado; pendente. |
| POST | `/cidadaos/mini-cadastro` | Cria cadastro mínimo sem conta de acesso; pode integrar CPFHub/CEP. | Catalogado; pendente. |
| POST | `/cidadaos` | Abre cadastro/caderneta por profissional; pode retornar 202 quando a validação externa ficar pendente. | Catalogado; pendente. |
| GET | `/cidadaos/{cidadao_id}` | Consulta dados cadastrais do cidadão, auditando o acesso. | Catalogado; pendente. |
| PATCH | `/cidadaos/{cidadao_id}` | Atualiza dados cadastrais; requer regras de autorização do backend. | Catalogado; pendente. |

### Caderneta e vacinação

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/cidadaos/{cidadao_id}/caderneta/cards` | Retorna cards por faixa etária e restrições antes de confirmar caderneta. | Catalogado; pendente. |
| POST | `/cidadaos/{cidadao_id}/caderneta/registrar` | Registra que a caderneta foi criada/confirmada. | Catalogado; pendente. |
| GET | `/cidadaos/{cidadao_id}/caderneta` | Lista registros vacinais do cidadão. | Catalogado; pendente. |
| GET | `/cidadaos/{cidadao_id}/caderneta/montagem` | Calcula idade e doses esperadas para montar a caderneta. | Catalogado; pendente. |
| POST | `/cidadaos/{cidadao_id}/caderneta/confirmar` | Confirma os dados de caderneta em operação transacional. | Catalogado; pendente. |
| GET | `/cidadaos/{cidadao_id}/caderneta/completa` | Retorna caderneta completa. | Catalogado; pendente. |
| GET | `/cidadaos/{cidadao_id}/situacao` | Retorna situação das vacinas do cidadão. | Catalogado; pendente. |
| POST | `/cidadaos/{cidadao_id}/aplicacoes` | Registra aplicação de vacina e movimentação correspondente. | Catalogado; pendente. |
| POST | `/cidadaos/{cidadao_id}/historico` | Registra dose histórica informada, sem movimentar estoque. | Catalogado; pendente. |
| POST | `/cidadaos/{cidadao_id}/nao-realizadas` | Registra dose não realizada e motivo. | Catalogado; pendente. |
| PATCH | `/registros/{registro_id}` | Corrige um registro vacinal existente. | Catalogado; pendente. |
| POST | `/registros/{registro_id}/anular` | Anula registro vacinal conforme regras do backend. | Catalogado; pendente. |

### Condições e remessas

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/cidadaos/{cidadao_id}/condicoes` | Lista condições de saúde vinculadas ao cidadão. | Catalogado; pendente. |
| POST | `/cidadaos/{cidadao_id}/condicoes` | Registra condição de saúde para o cidadão. | Catalogado; pendente. |
| PATCH | `/condicoes/{condicao_id}` | Atualiza condição registrada. | Catalogado; pendente. |
| GET | `/remessas-disponiveis` | Lista remessas com saldo disponíveis para o profissional. | Catalogado; pendente. |

### Histórico da unidade (acesso de equipe)

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| GET | `/historico/eventos` | Lista eventos da unidade com filtros e paginação. | Catalogado; pendente. |
| GET | `/historico/pacientes` | Lista pacientes com registros na unidade. | Catalogado; pendente. |
| GET | `/historico/lotes` | Pesquisa lotes. | Catalogado; pendente. |
| GET | `/historico/lotes/{lote_id}/aplicacoes` | Consulta aplicações daquele lote na unidade. | Catalogado; pendente. |

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

## Cadastro do profissional — regra de negócio e divergência do backend entregue

A regra de negócio definida para o Vac+ é que o **Administrador Regional cadastra o profissional**. A conta criada recebe uma senha provisória gerada automaticamente, enviada ao e-mail cadastrado e/ou entregue ao responsável conforme procedimento de provisionamento. A conta nasce com `deve_trocar_senha=true`; o profissional faz login com CPF + código da unidade + senha provisória e deve cadastrar a senha definitiva no primeiro acesso.

**Divergência a resolver no backend:** no backend ZIP analisado, `POST /equipe/profissionais` está protegido por `T_AdminUnidade` e a implementação `app/services/equipe.py` define que o profissional é criado pelo administrador da unidade. Já `POST /regional/unidades/{unidade_id}/administradores` cria um administrador de unidade, não um profissional. Portanto, o contrato atual não corresponde à regra de negócio acima. O Antigravity deve alinhar o backend para que o Administrador Regional possa criar o profissional na unidade da sua região e retornar/enviar a senha provisória de forma segura. Não considerar a criação por regional concluída até essa divergência ser resolvida.

## Esqueci a senha — fluxo visual atual e contrato pendente

A tela `src/pages/EsqueciSenha/EsqueciSenha.tsx` segue o mesmo padrão visual de Administradores: CPF + código da unidade (6 dígitos), depois código de e-mail (6 dígitos). Nesta entrega, o fluxo é um **mock de interface**: valida apenas formatos, não procura usuário, não lê o e-mail cadastrado, não envia e-mail e aceita qualquer código de seis dígitos. Após a aprovação simulada, retorna para `/login`; não cria sessão nem troca a senha.

### Comportamento que o endpoint futuro deve implementar

1. Receber CPF e `codigo_unidade` (6 dígitos) e localizar a conta do perfil `profissional` vinculada à unidade.
2. Obter o e-mail cadastrado desse profissional; nunca aceitar e-mail livre informado pelo solicitante.
3. Gerar código de seis dígitos, armazenar hash/representação segura, vincular à conta/solicitação, definir expiração, limite de tentativas e reenvio, e enviar ao e-mail cadastrado.
4. Responder com mensagem neutra para não revelar se a conta existe.
5. Comparar o código informado com o código ativo daquela solicitação. Só aprovar quando corresponder, estiver dentro da validade e não exceder tentativas; devolver confirmação/token de uso único.
6. Após aprovação, retornar à tela de login conforme a regra de UX definida. Essa aprovação por si só não altera a senha nem cria sessão. Para efetiva redefinição, o procedimento real abaixo continua necessário até o backend implementar explicitamente a recuperação escolhida pelo produto.

**Os endpoints HTTP de recuperação para `profissional` ainda não existem no backend enviado.** Não inventar caminhos em `ENDPOINTS`; o Antigravity deve definir o contrato real e então atualizar o service/README.

### Redefinição real disponível hoje

A equipe Vac+ pode executar `python -m app.scripts.suporte redefinir-senha --perfil profissional --conta-id ... --operador ... --motivo ...`. O comando cria nova senha provisória com validade, marca `deve_trocar_senha=true`, zera tentativas/bloqueio e envia aviso ao e-mail. A equipe confirma a identidade e repassa a senha provisória; no próximo login, o profissional deve trocá-la. Depois da troca inicial, somente a equipe Vac+ pode iniciar outra redefinição.

