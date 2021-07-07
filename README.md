### How to setup local development environment

```sh
git clone git@git.toptal.com:screening/Jacob-Goh-Chuan-Ching-4.git
cd Jacob-Goh-Chuan-Ching-4
cp .env.sample .env

yarn 

yarn start 
```

#### run migrations
```sh
cd backend
//TODO: change script
yarn typeorm:migration:run 
cd ..
```
