# Use the official Node.js 20 image as a base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite React app
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the Express server to serve the built files
CMD ["npm", "start"]
