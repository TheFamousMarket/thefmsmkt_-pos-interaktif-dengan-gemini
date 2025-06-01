FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Install serve to serve static files
RUN npm install -g serve

# Expose the port
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["serve", "-s", "dist", "-l", "8080"]
