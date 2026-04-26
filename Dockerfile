# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests and install packages
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Inject Firebase config as build-time environment variables
# These are public Firebase web credentials (safe for client-side use per Firebase docs)
ARG VITE_FIREBASE_API_KEY=AIzaSyAI6ymMD18qwJSDpvfnP4KmELj0mlf0zXw
ARG VITE_FIREBASE_AUTH_DOMAIN=election-education-f3282.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=election-education-f3282
ARG VITE_FIREBASE_STORAGE_BUCKET=election-education-f3282.firebasestorage.app
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=996104706188
ARG VITE_FIREBASE_APP_ID=1:996104706188:web:d24ba8fb69a10c4a13c3a9
ARG VITE_FIREBASE_MEASUREMENT_ID=G-J4H1DJ1NRG
ARG VITE_GEMINI_API_KEY=AIzaSyClOyaTUlFdeaUiFtXwJNFCno_ED51diJo

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build the Vite React application
RUN npm run build

# Verify the build output exists
RUN ls -la /app/dist

# ── Stage 2: Serve ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the built assets and server from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js

# Cloud Run sets PORT environment variable at runtime
EXPOSE 8080

# Start the native Node.js HTTP server
CMD ["node", "server.js"]
