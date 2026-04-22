# Use the official Node.js 20 image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies needed for build)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite React app (creates /app/dist)
RUN npm run build

# Verify dist was created
RUN ls -la /app/dist

# Start the native Node.js HTTP server
CMD ["node", "server.js"]
