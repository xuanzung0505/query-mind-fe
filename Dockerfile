FROM node:20-alpine AS build
WORKDIR /app
COPY /.next/package.json .npmrc /app/
RUN npm install

FROM build AS build2
RUN npm run build
COPY /.next/standalone /app/
COPY /public /app/public
COPY /.next/static /app/.next/static
EXPOSE 3000

# Start the Next.js production server
CMD ["node", "server.js"]