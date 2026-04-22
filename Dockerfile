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

# Start the 'serve' static server, explicitly binding to 0.0.0.0 and the Cloud Run PORT
CMD ["sh", "-c", "npx serve -s dist -l tcp://0.0.0.0:${PORT:-8080}"]
