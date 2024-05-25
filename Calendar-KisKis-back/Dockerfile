# service1/Dockerfile
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "app.js" ]
