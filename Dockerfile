FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files and server
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/server.js .
COPY --from=build /app/package.json .

# Install only production dependencies
RUN npm ci --production

# Expose the port
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]