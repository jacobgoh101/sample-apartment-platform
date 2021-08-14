### How to setup local development environment

```sh
git clone git@github.com:jacobgoh101/sample-apartment-platform.git
cd sample-apartment-platform
cp .env.sample .env

yarn 

yarn start 
```

#### run migrations
```sh
cd backend
yarn migrate
yarn seed
cd ..
```
