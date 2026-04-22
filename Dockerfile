# Stage 1: Build the Vite React app
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Inline command to guarantee the Nginx config uses the exact PORT provided by Cloud Run at startup
CMD sh -c "echo \"server { listen \${PORT:-8080}; location / { root /usr/share/nginx/html; index index.html; try_files \\\$uri \\\$uri/ /index.html; } }\" > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
