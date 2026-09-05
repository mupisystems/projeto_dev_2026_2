# Dockerfile do frontend em dois estagios.
# Estagio de build compila a SPA com Vite.
# Estagio final serve os arquivos estaticos com Nginx.

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm ci -w frontend --include-workspace-root

COPY frontend ./frontend

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build -w frontend

FROM nginx:alpine AS runner

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Configuracao customizada do Nginx para SPA com gzip e headers de seguranca.
COPY --from=builder /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
