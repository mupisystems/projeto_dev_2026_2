# Dockerfile do backend em dois estagios.
# Estagio de build compila TypeScript para dist/.
# Estagio final executa a API com Node.js em imagem enxuta.

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci -w backend --include-workspace-root

COPY backend/prisma ./backend/prisma

RUN npm run db:generate -w backend

COPY backend ./backend

RUN npm run build -w backend

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci -w backend --include-workspace-root --omit=dev --ignore-scripts

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "backend/dist/src/server.js"]
