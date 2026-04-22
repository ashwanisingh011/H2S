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
# Copy custom nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template
# Expose the default Cloud Run port
EXPOSE 8080
# Nginx alpine image has a built-in entrypoint that processes templates in /etc/nginx/templates
# and substitutes environment variables into /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]
