#### Development Stage ####

# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:14 AS development

# Specify the working directory inside the container
WORKDIR /peter/src/app

# Copy package-lock.json and package.json from host to the working directory inside the container 
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

RUN npm run build

EXPOSE 3000

#### Production Stage ####

# Specify Node Version and Image
# Name Image production (can be anything)
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Specify the working directory inside the container
WORKDIR /peter/src/app

COPY --from=development /peter/src/app/ .

EXPOSE 3000

# run app
CMD ["node", "dist/main"]