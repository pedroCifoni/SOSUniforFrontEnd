# Central de Reportes · SOS UNIFOR (front-end)

Aplicação web para registro e acompanhamento de ocorrências no campus (SOS, chamados de manutenção e denúncias), com visão de usuário e visão de administrador.

React 19 · TypeScript · Tailwind CSS v4 · Vite · React Router

## Como rodar

```
npm install --legacy-peer-deps
npm run dev
```

Sem `VITE_API_URL` o app roda com dados mockados. Para apontar para o backend, copie `.env.example` para `.env` e preencha a URL.

Logins de teste (mock, senha `123456`):

| Perfil  | E-mail                    |
| ------- | ------------------------- |
| Usuário | `eduardo.costa@unifor.br` |
| Admin   | `admin@unifor.br`         |

## Arquitetura

```
src/
  api/         cliente HTTP (fetch + JWT), config, armazenamento do token
  models/      tipos e contratos de domínio (Usuario, Ocorrencia, Seguranca)
  services/    regras de acesso a dados; único lugar que fala com a API ou o mock
  mocks/       dados e JWT de mentira, usados quando não há backend
  contexts/    estado global (autenticação)
  hooks/       hooks reutilizáveis (useAuth, useHoldPress)
  routes/      rotas e guardas de acesso por perfil
  components/  UI reutilizável e layout
  pages/       telas
  utils/       funções puras (formatação, JWT)
```

Fluxo: `page → service → api (ou mock)`. As páginas nunca chamam `fetch` nem leem o mock diretamente.

## Autenticação (JWT)

A autenticação e a autorização são responsabilidade do **backend**. O front apenas guarda o token e o envia.

1. `POST /auth/login` com `{ email, senha }` retorna `{ token }`.
2. O token (JWT) carrega as claims `sub`, `name`, `email`, `role` (`usuario` | `admin`), `iat` e `exp`.
3. O front decodifica o payload só para exibir o usuário e saber a expiração. **Não valida a assinatura**: isso é feito no servidor.
4. Toda requisição leva `Authorization: Bearer <token>` (`api/client.ts`).
5. Resposta `401` ou token expirado encerra a sessão e volta para `/login`.
6. `ProtectedRoute` esconde telas por perfil, mas é só experiência de uso. O backend deve validar o perfil em cada endpoint.


