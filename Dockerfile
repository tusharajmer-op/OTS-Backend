FROM node:18-alpine
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install dependencies.
RUN npm ci

RUN npm install -g typescript

# Copy the rest of the application code to the working directory.
COPY . .

# Compile TypeScript to JavaScript.
RUN npm run build

# Expose the port the app runs on
EXPOSE 5418

# Set the CMD to use the start.sh script
CMD ["/bin/sh", "/usr/src/app/start.sh"]
