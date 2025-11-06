FROM node:20-alpine
WORKDIR /app

# Install dependencies for both backend and frontend if present
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Default command runs backend; you can override to run Next.js separately.
CMD ["node","backend/src/index.js"]