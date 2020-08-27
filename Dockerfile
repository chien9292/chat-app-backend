FROM node:12.18.0-alpine3.9 as build
WORKDIR /tmp
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY package.json ./
RUN npm install 
COPY src ./src
RUN ls
RUN npm run build
FROM build as runner
WORKDIR /app
COPY --from=build /tmp/node_modules ./node_modules
COPY --from=build /tmp/dist ./dist
ENTRYPOINT [ "node", "./dist/main.js" ]
EXPOSE 4000
