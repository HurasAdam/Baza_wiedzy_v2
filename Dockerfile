# Use Node.js 22 as the base image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript source to JavaScript
RUN npm run build

# Expose backend port (matches PORT in .env)
EXPOSE 5000

# Start the backend in production mode
CMD ["npm", "run", "start:prod"]
