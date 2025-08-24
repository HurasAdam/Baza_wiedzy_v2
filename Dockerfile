# use official node image
FROM node:22

# set working dir
WORKDIR /app

# copy package files first (lepsze cache)
COPY package*.json .

# install deps inside container (Linux) -> builds native modules correctly
RUN npm install

# copy rest of source
COPY . .

# build TypeScript -> dist (runs tsc / tsc-alias as defined in package.json)
RUN npm run build

# remove dev deps to slim image (optional, after build)
RUN npm prune --production

RUN rm -rf src

# set production env
ENV NODE_ENV=production

EXPOSE 5000

RUN chmod +x /app/start.sh

# run built app
CMD ["/app/start.sh"]
