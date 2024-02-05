# Use a specific version of node to ensure compatibility.
FROM node:14 AS build-stage

# Set the working directory in the Docker image.
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files.
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy the entire project to the Docker image.
COPY . .

# Build the application.
RUN npm run build

# Start a new stage to set up the production server.
FROM nginx:alpine AS production-stage

# Copy the build directory from the build-stage to the nginx server directory.
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched.
EXPOSE 80

# Start nginx with global directives and daemon off.
CMD ["nginx", "-g", "daemon off;"]
