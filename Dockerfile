# Use the official Node.js 20 image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite React app
RUN npm run build

# Start the native dependency-free HTTP server
CMD ["node", "server.js"]
