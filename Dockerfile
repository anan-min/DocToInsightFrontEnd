# Use the official Node.js image as base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that Angular dev server runs on
EXPOSE 4200

# Start the development server
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
