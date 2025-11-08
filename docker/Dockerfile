############################################
# Multi-stage build for frontend static export and backend runtime
############################################

FROM node:20-alpine AS deps
WORKDIR /app

# Frontend dependencies
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm install --omit=dev

# Backend dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install --omit=dev

############################################
FROM node:20-alpine AS frontend-build
WORKDIR /app
ENV NODE_ENV=production EXPORT=true
COPY --from=deps /app/frontend ./frontend
COPY frontend ./frontend
RUN cd frontend && npm run build && npm run export

############################################
FROM node:20-alpine AS backend-build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/backend ./backend
COPY backend ./backend
COPY backend/knexfile.js ./backend/knexfile.js

############################################
# Final runtime image (serves backend; static files can be hosted separately)
############################################
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy backend runtime
COPY --from=backend-build /app/backend ./backend

# Optionally include static frontend (uncomment if you want to serve via backend later)
# COPY --from=frontend-build /app/frontend/out ./public

EXPOSE 3001
CMD ["node","backend/src/index.js"]