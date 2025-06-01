FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose the port
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
