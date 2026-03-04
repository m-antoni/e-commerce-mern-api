# Use the official Node.js 20 LTS Alpine image as the base.
# - 'alpine' is a lightweight Linux distribution, keeping the image small.
# - Node 20 is stable and LTS, ideal for production.
FROM node:20-alpine

# Set the working directory inside the container.
# - All subsequent commands will run in /app.
# - Keeps container filesystem organized and predictable.
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the container.
# - Only copying these files first allows Docker to cache npm install.
RUN echo "Copying package.json and installing production dependencies..."
COPY package*.json ./

# Install only production dependencies.
# - '--production' excludes devDependencies, making the final image smaller.
# - Runs 'npm install' inside the container in /app.
RUN npm install --production
RUN echo "Production dependencies installed successfully."

# Copy the rest of the application source code into the container.
# - Includes server code, configs, and any other necessary files.
RUN echo "Copying application source code..."
COPY . .
RUN echo "Source code copied successfully."

# Inform Docker that the container will listen on port 8080 at runtime.
# - Note: This does not publish the port externally; it’s documentation and can be used by orchestration tools.
EXPOSE 8080

# Define the default command to run when the container starts.
# - Starts the Node.js server using 'npm start'.
# - Ensure your app listens on process.env.PORT || 8080 for dynamic hosting platforms.
CMD ["node", "index.js"]