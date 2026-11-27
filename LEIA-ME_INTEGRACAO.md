# Vac+ Frontend — integração de autenticação dos quatro perfis

Esta pasta contém as quatro aplicações Vite independentes: `administradores`, `regional`, `profissionais` e `usuario`.

## Escopo desta etapa

O fluxo de autenticação foi conectado ao backend Render para os quatro perfis: login, 2FA, token Bearer, restauração/validação da sessão por `GET /conta/eu`, proteção de rotas, logout e troca obrigatória de senha quando o backend informa `deve_trocar_senha=true`.

Os endpoints das funcionalidades foram organizados em `src/services/endpoints.ts` em cada aplicação e documentados em `README_ENDPOINTS.md`. Uma rota estar em `ENDPOINTS` significa que está catalogada, não que a tela operacional já a consuma. A migração dos mocks para dados reais continua gradual, tela por tela.

## Regra oficial de senhas

- **Administradores de Unidade, Administradores Regionais e Profissionais:** recebem senha provisória quando a conta é provisionada/redefinida. No primeiro login com a senha provisória, se `deve_trocar_senha=true`, precisam informar senha atual, nova senha e confirmação. A nova senha substitui a provisória e passa a ser definitiva. Depois disso, esses perfis não podem alterar a própria senha por `/conta/senha`; se esquecerem, solicitam à equipe Vac+ uma nova senha provisória. A equipe executa o procedimento de suporte, a flag volta a `true` e o próximo login exige nova troca.
- **Cidadão:** é o único perfil sem senha provisória no fluxo normal. Escolhe a senha definitiva no próprio cadastro e possui recuperação por e-mail no backend. Pode alterar a senha autenticado.
- O frontend sempre respeita a flag `deve_trocar_senha` retornada pelo backend. As rotas operacionais ficam bloqueadas enquanto a flag for verdadeira; a rota de alteração só é acessível nesse estado.

## Fluxo de esqueci a senha

- **Administrador da Unidade, Regional e Profissional:** a interface apresenta CPF + código de acesso apropriado (unidade com 6 dígitos ou Regional `SAR` + 2 dígitos), depois um campo de código de e-mail. Nesta versão isso é mock de UX: valida somente o formato e aprova qualquer código de seis dígitos; não procura conta, não recupera e-mail, não envia e-mail e não altera senha. Após a aprovação simulada, retorna ao login. Os READMEs de cada perfil especificam o contrato funcional que o backend deverá criar. Enquanto os endpoints não existirem, a redefinição efetiva continua sendo feita pela equipe Vac+ com uma nova senha provisória.
- **Cidadão:** o backend já possui `/auth/recuperacao/*`, com token de uso único e escolha entre cadastrar nova senha ou entrar sem trocá-la. A tela/service do frontend ainda não estão integrados e essa diferença está documentada no README do perfil.

## Regra de cadastro do Profissional — divergência para resolver

A regra de negócio confirmada para o produto é que o Administrador Regional cadastra o Profissional. No backend ZIP analisado, porém, `POST /equipe/profissionais` está protegido por `T_AdminUnidade` e `app/services/equipe.py` diz que o profissional é criado pelo administrador da unidade. O endpoint regional atual cria administradores de unidade, não profissionais. O Antigravity deve alinhar essa rota/permissão com a regra de negócio antes de considerar o cadastro por Regional integrado.

## Configuração

Em cada pasta de aplicação (`administradores`, `regional`, `profissionais`, `usuario`), crie `.env` com:

```env
VITE_API_URL=https://vacmais-backend.onrender.com
```

Não adicione `DATABASE_URL`, `SECRET_KEY`, senha do Supabase ou chave da CPFHub ao frontend. O `.env` real não vai no ZIP; apenas `.env.example`.

## Rodar cada aplicação

Execute em um terminal na pasta correspondente:

```bash
npm install
npm run dev
```

Cada projeto é independente. Confira a porta anunciada pelo Vite; não presuma que todos usarão `5173` ao mesmo tempo.

## Dados mockados e integração gradual

Dashboards, relatórios, estoques, campanhas, cadernetas, histórico, perfis e outras telas operacionais ainda podem utilizar mocks/estado local. Não declarar essas telas como integradas só porque existe uma rota em `ENDPOINTS`. A cada etapa futura:

1. conectar uma tela específica ao service;
2. mapear os campos reais da API;
3. testar estados de carregamento, vazio e erro;
4. retirar os dados mockados daquela tela somente depois da confirmação do endpoint;
5. atualizar o README com o status.

## Testes e limitações

A sintaxe TypeScript/TSX, imports locais e os services centrais de autenticação foram revisados na entrega anterior. O build completo das quatro aplicações precisa ser executado no ambiente local após `npm install`. Não há alteração no backend, migrations, seeds ou banco de dados nesta entrega.
