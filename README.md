nlt-bible-server
================

Machine-readable Bible courtesy of: https://github.com/honza/bibles,

Prepared as a proof-of-concept darkweb demo for CALC Conference 2018. May God's peace rest upon us.

# Testing

## Setup

Clone and install dependencies:

```
npm install
```

## For Docker fans

Start a MongoDB development server:

```
docker run --name dev-mongo -p 27017:27017 -d mongo
```

Once created, you can start and stop the container like this:

```
docker stop dev-mongo
docker start dev-mongo
```

## Execute

```
npm test
```

To execute a single test file, be sure to set the `NODE_ENV` variable:

```
NODE_ENV=test ./node_modules/.bin/jasmine spec/features/indexSpec.js
```

# Development

## Setup

Clone and install dependencies:

```
npm install
```

To start a Dockerized Mongo container, see above...

Seed database:

```
node db/seed.js
```

Run server:

```
npm start
```

# Production

In the application directory:

```
cd nlt-bible-server 
NODE_ENV=production npm install
```

The _Dockerized_ production is meant to be deployed behind an `nginx-proxy`/`lets-encrypt` combo:

```
docker-compose -f docker-compose.prod.yml up -d
```

## Seed

```
docker-compose -f docker-compose.prod.yml run --rm node node db/seed.js NODE_ENV=production
```

# Tor

In the application directory:

```
cd nlt-bible-server
NODE_ENV=production npm install
```

This Tor-safe composition is meant to be deployed behind a Dockerized Tor proxy. For the moment, details on how to do this can be found [here](https://libertyseeds.ca/2017/12/12/Dockerizing-Tor-to-serve-up-multiple-hidden-web-services/). Once the proxy is setup, execute the Tor deployment like this:

```
docker-compose -f docker-compose.tor.yml up -d
```

## Seed

```
docker-compose -f docker-compose.tor.yml run --rm node node db/seed.js NODE_ENV=production
```

