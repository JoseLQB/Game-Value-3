# Backend (Node.js + Express)

## Arranque

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Endpoints

`GET /games` ya devuelve el catálogo completo importado desde `scripts/data.js`.

- `GET /health`
- `POST /auth/login` -> `{ username, password }`
- `POST /auth/refresh` -> `{ refreshToken }`
- `POST /auth/logout` -> `{ refreshToken }`
- `GET /games` (Bearer token)

## Ejemplo rápido

1) Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

2) Con el `accessToken`:
```bash
curl http://localhost:3000/games -H "Authorization: Bearer TOKEN"
```
