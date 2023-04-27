# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Set environment variables
ENV NODE_ENV=development

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "start:dev"]