# Correções desta versão — Vac+ Frontend

## Regra de senha confirmada

- `admin_unidade`, `admin_regional` e `profissional` seguem o mesmo fluxo de senha provisória e troca obrigatória no primeiro acesso quando `deve_trocar_senha=true`.
- A senha provisória é substituída pela senha definitiva após `POST /conta/senha`; o backend zera `deve_trocar_senha`.
- Depois da primeira troca, esses três perfis não alteram a própria senha pelo endpoint comum. A equipe Vac+ deve gerar uma nova senha provisória e reativar a troca obrigatória.
- `cidadao` é o único perfil sem senha provisória no fluxo normal: escolhe a senha definitiva no cadastro e tem recuperação por e-mail no backend.
- A tela `/alterar-senha` agora só fica acessível quando `deve_trocar_senha=true`; as rotas operacionais permanecem bloqueadas enquanto a troca for obrigatória.

## Recuperação de senha nas telas administrativas/profissionais

- Administrador da Unidade: CPF + código de unidade com 6 dígitos, seguido de código de e-mail com 6 dígitos.
- Administrador Regional: CPF + código SAR com 2 dígitos, seguido de código de e-mail com 6 dígitos.
- Profissional: CPF + código de unidade com 6 dígitos, seguido de código de e-mail com 6 dígitos.
- Nesta entrega, os três fluxos são demonstrações de interface: validam formato, aprovam qualquer código de 6 dígitos e retornam ao login. Não consultam o banco, não enviam e-mail, não validam o código recebido, não criam sessão e não alteram senha.
- Os READMEs descrevem o comportamento que o backend deverá implementar. Os endpoints de recuperação para esses três perfis ainda não existem no backend analisado e não foram inventados em `ENDPOINTS`.
- A redefinição real atualmente disponível continua sendo assistida pela equipe Vac+, que gera uma senha provisória com validade; o próximo login exige a troca.

## Cidadãos

- Mantida a regra de senha definitiva escolhida no cadastro.
- Corrigido/confirmado o alias `maskNumeric` em `usuario/src/utils/masks.ts`, utilizado pelo formulário de login.
- A tela de recuperação agora segue o padrão visual mock (CPF → código → aprovação → login). O service aceita qualquer código de 6 dígitos para demonstração; não envia e-mail nem cria sessão. O backend possui endpoints reais para Cidadão com contrato diferente (token + escolha entre nova senha ou entrada sem alterar), documentado para alinhamento posterior.

## Divergência de cadastro de profissionais para o Antigravity

A regra de negócio do produto informada é que o Administrador Regional cadastra o Profissional. Porém, no backend ZIP analisado, `POST /equipe/profissionais` exige `T_AdminUnidade` e `app/services/equipe.py` declara criação pelo Administrador da Unidade. O README de Profissionais destaca essa divergência para correção no backend; nenhum endpoint fictício foi criado no frontend.

## Escopo preservado

- Login, 2FA, sessão, restauração, logout e troca obrigatória permanecem conectados ao Render.
- As telas operacionais continuam migradas gradualmente; existência de uma rota em `ENDPOINTS` não significa que a tela já a consome.
- Nenhuma alteração foi feita no backend, banco, migrations ou seeds.
