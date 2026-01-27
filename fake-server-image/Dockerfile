FROM node:20-alpine AS build
WORKDIR /app
COPY /package.json /app/
RUN npm install
COPY /db.json /app/
EXPOSE 4000

# Start the Next.js production server
CMD ["npx", "json-server", "db.json", "-p 4000", "-h 0.0.0.0"]