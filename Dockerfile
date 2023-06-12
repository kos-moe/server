FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install

COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]