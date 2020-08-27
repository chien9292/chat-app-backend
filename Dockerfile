FROM node:12.18.0-alpine3.9 as build
WORKDIR /tmp
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY package.json ./
RUN npm install 
COPY src ./src
ARG DB_USERNAME
ENV DB_USERNAME=${DB_USERNAME}
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
ARG DB_DATABASENAME
ENV DB_DATABASENAME=${DB_DATABASENAME}
ARG DB_HOSTNAME
ENV DB_HOSTNAME=${DB_HOSTNAME}
ARG DB_PORT
ENV DB_PORT=${DB_PORT}

ARG PORT
ENV PORT=${PORT}
ARG FRONT_END_URL
ENV FRONT_END_URL=${FRONT_END_URL}
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

RUN npm run build
FROM build as runner
WORKDIR /app
COPY --from=build /tmp/node_modules ./node_modules
COPY --from=build /tmp/dist ./dist
ENTRYPOINT [ "node", "./dist/main.js" ]
EXPOSE 4000
