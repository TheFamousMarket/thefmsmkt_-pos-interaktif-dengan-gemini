FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install production server dependencies
RUN npm install express http ws cors dotenv

# Expose the port specified by the PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
