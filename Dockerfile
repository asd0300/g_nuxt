FROM node:16-alpine AS builder

RUN mkdir -p /nuxt-app
WORKDIR /nuxt-app
COPY . .

ENV HOST 0.0.0.0

RUN npm ci && npm cache clean --force
# RUN npx nuxt build --dotenv .\.env.production
 RUN npm run build


FROM keymetrics/pm2:16-alpine

RUN mkdir -p /nuxt-app
WORKDIR /nuxt-app

COPY --from=builder /nuxt-app .
COPY ./ecosystem.config.cjs /nuxt-app

# ENV NUXT_HOST=http://172.19.0.3:4000
# ENV NUXT_PORT=3000

EXPOSE 3000 

# CMD [ "node", ".output/server/index.mjs" ]


ENTRYPOINT ["pm2-runtime", "start", "/nuxt-app/ecosystem.config.cjs"]