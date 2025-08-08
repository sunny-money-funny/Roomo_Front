FROM node:16
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install -g serve
# COPY . .
EXPOSE 3000
# CMD ["npm", "run", "build", "||", "serve", "-s", "build"]
CMD ["sh", "-c", "npm run build ; serve -s build -l 3000"]