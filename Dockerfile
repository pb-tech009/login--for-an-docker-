# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything
COPY . .

# Expose port
EXPOSE 5050

# Start app
CMD ["node", "server.js"]
