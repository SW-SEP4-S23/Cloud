# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source code
COPY . .

# Set environment variables
ENV NODE_ENV=development

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "start:dev"]