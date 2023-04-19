# Use a Node.js base image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

# Build the application
RUN npm run build