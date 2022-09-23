---
title: "JSON API Phase 3: API Server"
date: 2018-03-13T00:00:00.000-05:00
author: valerie_burzynski
layout: article
category: Development
photo: png
tags:
- JavaScript
- Node
- JSON API
- Swagger
- Ember
- Express
summary: The second entry of the JSON API tutorial series. In this phase we will be implementing our JSON API server with Express.
series: json-api
---

**UPDATED MAR 2020:** Updated code samples to eliminate deprecation warnings for current version of Mongoose, fixed a test name, and adjusted database code to resolve a race condition.

---

## Developing an API with Express and Swagger

- [Phase 1: Setting up your projects][phase01]
- [Phase 2: Designing your API with Swagger and JSON API][phase02]
- Phase 3: Developing an API with Express and Swagger (this post)
- [Phase 4: Building an Ember App that connects to a JSON API server][phase04]

### Introduction

Welcome back to the Swagger/JSON-API Ember Tutorial extravaganza! In [Phase 1][phase01] we setup our projects. Then in [Phase 2][phase02] we used Swagger to document and design our API. In this phase, we will be implementing our API
with Express and some Swagger tools.

#### Dependencies

We will be using `yarn` to install our dependencies:

~~~shell
yarn install
~~~

The commands below combine all of the dependencies I'll describe below:

~~~shell
yarn add --dev eslint eslint-plugin-import eslint-config-airbnb-base mocha chai sinon sinon-as-promised sinon-chai chai-as-promised chai-match-pattern supertest nock faker factory-girl chance proxyquire nyc

yarn add yamljs jsonapi-serializer debug lodash config moment glob mongoose git+https://github.com/vburzynski/swagger-mongoose.git#4887ab243e68b26a27b17d734f8894a8338ceb6a
~~~

Add eslint packages:

~~~shell
yarn add --dev eslint eslint-plugin-import eslint-config-airbnb-base
~~~

Add mocha and chai for testing:

~~~shell
yarn add --dev mocha chai
~~~

Add sinon for creating spies, mocks and stubs:

~~~shell
yarn add --dev sinon sinon-as-promised
~~~

Add some chai assertion plugins:

~~~shell
yarn add --dev sinon-chai chai-as-promised chai-match-pattern
~~~

Add supertest and nock for testing http request functionality:

~~~shell
yarn add --dev supertest nock
~~~

Add packages for generating data:

~~~shell
yarn add --dev faker factory-girl chance
~~~

Add proxyquire to replace module dependencies in tests:

~~~shell
yarn add --dev proxyquire
~~~

Add nyc for code coverage reporting:

~~~shell
yarn add --dev nyc
~~~

Add some swagger related items:

~~~shell
yarn add yamljs jsonapi-serializer
~~~

Add some other useful packages:

~~~shell
yarn add debug lodash config moment glob
~~~

Add mongoose stuff:

~~~shell
yarn add mongoose
~~~

Add forked swagger-mongoose:

~~~shell
yarn add git+https://github.com/vburzynski/swagger-mongoose.git#4887ab243e68b26a27b17d734f8894a8338ceb6a
~~~

#### Cleanup

Lets start with a clean slate, delete the following files:

~~~shell
./api/controllers/hello_world.js
./api/controllers/README.md
./api/helpers/
./config/README.md
./test/api/controllers/hello_world.js
./test/api/controllers/README.md
./test/api/helpers/
~~~

#### ESLint Configuration

In this project we will be linting our code with `eslint` and extending the `airbnb-base` linting configuration. For test files, we override the base configuration by specifying that we're in a mocha environment and changing a few rules to allow unnamed functions, not prefer arrow callbacks and allow unused expressions (this is specific to the syntax used by chai). That's it.

~~~json
// .eslintrc.json
{
  "extends": "airbnb-base",
  "overrides": [
    {
      "files": ["test/**/*.js"],
      "env": {
        "mocha": true
      },
      "rules": {
        "func-names": 0,
        "prefer-arrow-callback": 0,
        "no-unused-expressions": 0
      }
    }
  ]
}
~~~

#### NPM Scripts

Replace the npm scripts in the `package.json` with those below:

~~~json
{
  "scripts": {
    "start": "node app.js",
    "serve": "yarn start",
    "lint": "eslint .",
    "lint-fix": "eslint . --fix",
    "test": "./bin/test",
    "coverage": "./bin/coverage",
    "seed": "DEBUG=* CLEAR_DB=true node db/seed"
  }
}
~~~

| script        | action                                                                |
| ------------- | --------------------------------------------------------------------- |
| yarn start    | starts the server                                                     |
| yarn serve    | an alias to `yarn start`                                              |
| yarn lint     | run eslint                                                            |
| yarn lint:fix | run eslint and auto fix errors                                        |
| yarn test     | run the test suite                                                    |
| yarn coverage | generate coverage reports                                             |
| yarn seed     | seed the database with fake data (_this won't work until the end_)    |

#### Test Driven Development

I highly encourage you to pick up good testing habits. You don't necessarily need to follow the testing philosophies to the letter, but a good testing suite will save you from pain and heart ache down the line. I can tell you that its no fun developing an app, running into a bug, and following the rabbit hole until you hit a dead end and find that the issue is on an API that you don't control. You may or may not be opening up your own API to other developers, but having good test coverage, especially on the API code, can prevent issues from compounding into large problems when you go to develop the client app.

Test driven development forces you to gather all your requirements; consider how the code might work to meet those requirements; predict what pitfalls you may encounter along the way; and plan the implementation. You may not always know all of these details. It's fine to do some discovery work and write some code first. However, in the end, you should have a sufficient number of tests written to guarantee that your code works.

#### Test Script

To start off we're going to write a test script to run mocha. There are a lot of options and some great projects tackle this very issue. You've got [grunt](https://gruntjs.com/), [gulp](https://gulpjs.com/), [brunch](http://brunch.io/) and a whole slew of build systems, compilers and transpilers. My go to recently has been to simply write [npm scripts](https://docs.npmjs.com/misc/scripts) in the package.json. Why? For the simplicity of it. You just put the shell script you'd enter in your terminal into your npm script. There is, however, one caveat to this: npm scripts only allow you to write things on a single line. Thus, for those long unwieldy commands, I suggest breaking them out into an external script. You can write a script for node, bash, or even a Windows batch script.

For the test script, we're just going to go with a bash script that exports a few environment variables and executes `mocha` with options to include our setup script and spec files.

`file: ./bin/test`

~~~bash
#!/usr/bin/env bash
export NODE_ENV=test
export TEST_ENV=true

./node_modules/.bin/mocha \
  --colors \
  --timeout=10000 \
  --recursive test/setup.js "test/**/*.spec.js"
~~~

Once you've created the file, make the test script executable by running the following command:

~~~shell
chmod +x ./bin/test
~~~

We will also build a script to run `nyc`, the command line interface for `istanbul`. This will generate a coverage report using our integration and unit tests.

`file: ./bin/coverage`

~~~bash
#!/usr/bin/env bash
export NODE_ENV=test
export TEST_ENV=true

./node_modules/.bin/nyc mocha \
  --colors \
  --timeout=10000 \
  --recursive test/setup.js "test/**/*.spec.js"

~~~

Then make that executable:

~~~shell
chmod +x ./bin/coverage
~~~

#### Test Setup

Inside `test/setup.js` we're going to do some global test configuration with the use of mocha's event hooks. Using these hook, we will be doing the following:

Before any tests run:

- add plugins to `chai`
- create an instance of supertest that connects to our api app
- start up an instance of our api server

Before every test:

- create a sinon sandbox for the creation of stubs, mocks, and spies

After every test:

- clean up the sinon sandbox, clearing any stubs, mocks, and spies

After all the tests run:

- stop the api server

~~~javascript
// test/setup.js
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const chaiMatchPattern = require('chai-match-pattern');
const supertest = require('supertest');
const path = require('path');
const debug = require('debug')('test:setup');

const Server = require('../api/server.js');

before(async function () {
  debug('setting up chai');
  chai.use(sinonChai);
  chai.use(chaiAsPromised);
  chai.use(chaiMatchPattern);

  debug('creating supertest instance');
  const port = process.env.PORT || 10010;
  this.request = supertest(`localhost:${port}`);

  debug('creating app instance');
  this.server = new Server({
    appRoot: path.join(__dirname, '../'),
  });
  await this.server.init();
});

beforeEach(async function () {
  debug('create sinon sandbox');
  this.sandbox = sinon.createSandbox();
});

afterEach(async function () {
  debug('restore sinon sandbox');
  this.sandbox.restore();
});

after(async function () {
  debug('diconnecting app db connection');
  this.server.stop();
});

~~~

#### Server Module

The server module below is based off the `app.js` file that the Swagger CLI generates. This extraction allows us to provide one configuration when we serve up the api and another configuration when we create an instance of the api for the test suite.

~~~javascript
// api/server.js
const SwaggerExpress = require('swagger-express-mw');
const express = require('express');
const { promisify } = require('util');
const debug = require('debug')('api');

class Server {
  constructor(config) {
    this.config = config;
  }

  async init() {
    debug('init');

    debug('creating express app');
    this.express = express();

    debug('creating swagger middleware');
    const swaggerExpress = await promisify(SwaggerExpress.create)(this.config);

    debug('registering swagger middleware');
    swaggerExpress.register(this.express);

    debug('start listening listening');
    const port = process.env.PORT || 10010;
    this.httpServer = this.express.listen(port);

    if (process.env.TEST_ENV !== 'true') {
      process.stdout.write(`App is running at http://localhost:${port}\n`);
      process.stdout.write('Press CTRL-C to stop\n');
      process.stdout.write('try this:\n');
      process.stdout.write(`curl http://localhost:${port}/users\n`);
    }
  }

  stop() {
    debug('stopping the api server');
    this.httpServer.close();
  }
}

module.exports = Server;
~~~

#### App Module

We can now modify the app module to instantiate our server class and execute the initialization method:

~~~javascript
// app.js
const Server = require('./api/server');

const config = {
  appRoot: __dirname,
};

const api = new Server(config);

api.init();

~~~

#### Database

MongoDB is pretty standard fare within Node projects, so we will be using that. You can certainly modify this project to interact with another database. To do so, you'll want to modify the Repository classes which abstract away the database integration into a single set of classes.

##### Setup

Start off by installing MongoDB and starting it up as a service:

~~~shell
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
~~~

##### Configuration

Next we will be adding environment specific configurations to our YAML config files. Specifically we want to point the code to the location of the swagger YAML file and allow each environment to connect to a different database.

Add the following to `config/default.yaml`

~~~yaml
database: mongodb://localhost/jsonapi_ember_demo_dev
swaggerFile: ./api/swagger/swagger.yaml
~~~

Add a new file: `config/dev.yaml`

~~~yaml
database: mongodb://localhost/jsonapi_ember_demo_dev
~~~

Add a new file: `config/prod.yaml`

~~~yaml
database: mongodb://localhost/jsonapi_ember_demo
~~~

Add a new file: `config/test.yaml`

~~~yaml
database: mongodb://localhost/jsonapi_ember_demo_test
~~~

##### Test Support - Connecting to the database

Our test suite will need a way to connect to MongoDB without relying on the database implementation of our server app. The support module below will provide the tests with that database connection:

~~~javascript
// test/support/database.js
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('test:db');

const db = {
  connection: null,

  // clear the collections in the database to ensure every test starts from a clean slate
  clear: () => {
    debug('clear db');
    if (db.connection) {
      const collections = Object.keys(db.connection.collections);
      collections.forEach(function (name) {
        debug(`clearing collection: ${name}`);
        const collection = db.connection.collections[name];
        collection.deleteMany(function () {});
      });
    }
  },

  // create a connection
  connect: async () => {
    debug('connect db');
    if (_.get(mongoose, 'connection.readyState') === 0) {
      mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
      db.connection = mongoose.connection;
      db.connection.on('error', debug.bind(debug, 'connection error:'));
      db.connection.once('open', debug.bind(debug, 'connection open.'));
    } else {
      db.connection = mongoose.connection;
    }
  },

  // close the connection
  disconnect: () => {
    db.connection.close();
  },
};

module.exports = db;

~~~

Note: closing the connection is required otherwise our test script will not exit.

##### Modification of Test Setup

Make the modifications below to the test setup module in order to integrate with the database module from above:

~~~javascript
// test/setup.js
// ...
const db = require('./support/database');

before(async function () {
  // ... setup chai

  // create the initial connection to the database
  debug('connecting to db');
  await db.connect();

  // ... create app
});

// ...

afterEach(async function () {
  // ...

  // clear every collection to provide the next test with a clean slate
  debug('clear collections');
  await db.clear();
});

after(async function () {
  // disconnect from the database so our test suite actually exits
  debug('disconnecting tests db connection');
  db.disconnect();

  // ... stop server
});
~~~

##### Unit Test

We can then write a database unit test for `db.js`:

~~~javascript
// test/unit/db.spec.js
const { expect } = require('chai');
const proxyquire = require('proxyquire');
const swaggerMongoose = require('swagger-mongoose');

describe('Unit — Database', () => {
  let db;
  let sinon;
  let stubs;

  before(function () {
    stubs = {};
    stubs.mongoose = {};
    db = proxyquire('../../api/db', {
      mongoose: stubs.mongoose,
    });
  });

  beforeEach(function () {
    sinon = this.sandbox;
    stubs.mongoose.connect = sinon.stub();
  });

  context('#connect', () => {
    it('connects to the mongo database', async () => {
      stubs.mongoose.connection = {
        readyState: 0,
        on: sinon.stub(),
        once: sinon.stub(),
      };

      stubs.parseSwagger = sinon.stub(db, 'parseSwagger');

      await db.connect();

      expect(stubs.mongoose.connect).to.have.been.calledOnce;
      expect(stubs.mongoose.connection.on).to.have.been.calledOnce;
      expect(stubs.mongoose.connection.once).to.have.been.calledOnce;
      expect(stubs.parseSwagger).to.have.been.calledOnce;
    });
  });

  context('#disconnect', () => {
    context('connection exists', () => {
      it('closes the connection', async () => {
        db.isConnected = true;

        stubs.mongoose.connection = {
          close: sinon.stub(),
        };

        await db.disconnect();

        expect(db.isConnected).to.be.false;
        expect(stubs.mongoose.connection.close).to.have.been.calledOnce;
      });
    });
    context('connection does not exist', () => {
      it('does nothing', async () => {
        db.isConnected = false;

        stubs.mongoose.connection = {
          close: sinon.stub(),
        };

        await db.disconnect();

        expect(db.isConnected).to.be.false;
        expect(stubs.mongoose.connection.close).to.have.not.been.called;
      });
    });
  });

  context('#parseSwagger', () => {
    it('loads the swagger schema and compiles the swagger mongoose specs', () => {
      stubs.compile = sinon.stub(swaggerMongoose, 'compile');
      stubs.compile.returns({
        models: 'fake-models',
        schemas: 'fake-schemas',
      });

      db.parseSwagger();

      expect(db.models).to.equal('fake-models');
      expect(db.schemas).to.equal('fake-schemas');
    });
  });
});

~~~

##### Implementation

The database module will be responsible for managing the connections to the database. For our demo, we're just creating a singular connection.

Create a database module to manage connections:

~~~javascript
// api/db.js
const _ = require('lodash');
const config = require('config');
const fs = require('fs');
const mongoose = require('mongoose');
const swaggerMongoose = require('swagger-mongoose');
const YAML = require('yamljs');

const debug = require('debug')('api:db');

const db = {
  isConnected: false,
  connection: null,
  models: null,
  schemas: null,

  // creates a connection to MongoDB
  connect: async () => {
    debug('connect');

    // return active connection if one is known to exist
    if (db.isConnected && db.connection) {
      debug('returning connection');
      return db.connection;
    }

    // initiate connection if readyState is zero (disconnected)
    if (_.get(mongoose, 'connection.readyState') === 0) {
      debug('creating connection', config.database);
      mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
      db.connection = mongoose.connection;
      db.connection.on('error', debug.bind(debug, 'connection error:'));
      db.connection.once('open', debug.bind(debug, 'connection open.'));
    } else {
      // otherwise use the existing connection
      debug('using existing mongoose connection');
      db.connection = mongoose.connection;
    }

    // parse the swagger specs for Mongoose models and schemas
    if (!db.models && !db.schemas) {
      debug('parsing swagger schema');
      db.parseSwagger();
    }

    debug('connected');
    db.isConnected = true;
    return db.connection;
  },

  // disconnects from MongoDB
  disconnect: async () => {
    debug('disconnect');
    if (db.isConnected) {
      debug('closing');
      await mongoose.connection.close();

      debug('closed');
      db.isConnected = false;
    }
  },

  // parse the swagger specs for mongoose models and schema
  parseSwagger: () => {
    debug('loading swagger yaml');
    const swaggerFile = config.get('swaggerFile');     // get the location
    const yaml = fs.readFileSync(swaggerFile, 'utf8'); // read the file
    const spec = YAML.parse(yaml);                     // parse yaml to js object
    db.swagger = spec;

    debug('generating mongoose schemas and models');
    const { models, schemas } = swaggerMongoose.compile(spec);
    db.models = models;
    db.schemas = schemas;
  },
};

module.exports = db;

~~~

##### Server module modifications

In our Server class, we will want to import the  `db` module and, in the init method, create a connection, and set app settings on the express instance. In the stop method, we will need to disconnect from the database.

~~~javascript
// api/server.js
// ...
const db = require('./db');

class Server {
  // ...
  async init() {
    // ... (init express and swagger middleware)

    debug('connecting to the database');
    await db.connect();

    this.express.set('db', db);
    this.express.set('swagger', db.swagger);
    this.express.set('schemas', db.schemas);
    this.express.set('models', db.models);
    this.express.set('connection', db.connection);

    // ... (start listening on port)
  }

  stop() {
    debug('stopping the api server');
    this.httpServer.close();
    db.disconnect();
  }
}

module.exports = Server;

~~~

##### Integration Test

The integration tests below verify that calling each method on the database module results in the connection being in the proper ready state.

~~~javascript
// test/integration/database.spec.js
const { expect } = require('chai');
const db = require('../../api/db');

const DISCONNECTED = 0;
const CONNECTED = 1;

describe('Database', () => {
  beforeEach(async () => {
    await db.connect();
  });
  it('connects to the mongo database', async () => {
    expect(db.connection.readyState).to.equal(CONNECTED);
    await db.disconnect();
  });
  it('closes the connection to the mongo database', async () => {
    await db.disconnect();
    expect(db.connection.readyState).to.equal(DISCONNECTED);
    await db.connect();
  });
});
~~~

##### Run Tests

~~~shell
yarn test
~~~

#### Data Repositories

Now that we have an api that starts up and connects to the database, we can start implementing modules to communicate with the database.  We will use the Repository design pattern for this as it allows us to abstract away the code which interacts with the database. This way, if we ever need to port the code to a new database type, we just need to modify the repository classes.

##### Unit Test

Add the unit test below:

~~~javascript
// test/unit/repositories/user-repository.spec.js
const _ = require('lodash');
const { expect } = require('chai');
const Repository = require('../../../api/repositories/repository');
const UserRepository = require('../../../api/repositories/user-repository');

describe('User Repository', () => {
  let userRepo;
  let sinon;
  let mocks;

  beforeEach(function () {
    sinon = this.sandbox;
    mocks = {};

    // create a mock database module to instantiate the user repo
    mocks.db = {
      models: { User: 'fake-model' },
      schemas: { User: 'fake-schema' },
    };

    // create a user repository
    userRepo = new UserRepository(mocks.db);
  });

  // verify that the constructor instantiates our user repository correctly
  context('#constructor', () => {
    it('creates an instance of UserRepository', () => {
      expect(userRepo).to.be.an.instanceOf(UserRepository);
      expect(userRepo).to.be.an.instanceOf(Repository);

      // we'll want the repository to provide the mongoose model and schema objects
      expect(userRepo.model).to.equal('fake-model');
      expect(userRepo.schema).to.equal('fake-schema');
    });

    it('has a type of "user"', () => {
      // the repository should indicate what type it is
      expect(userRepo.type).to.equal('user');
    });
  });

  // We'll need a method to build new model instances
  context('#new', () => {
    it('uses the mongoose Model to build a new instance', () => {
      mocks.model = sinon.stub();
      userRepo.model = mocks.model;

      const result = userRepo.new('fake-json');

      expect(result).to.be.an.instanceOf(mocks.model);
      expect(mocks.model.firstCall.args[0]).to.equal('fake-json');
    });
  });

  // We'll want a method to build models and save them
  context('#create', () => {
    it('uses the mongoose Model to create a new instance', () => {
      _.set(mocks, 'model.create', sinon.stub());
      mocks.model.create.withArgs('fake-json').returns('fake-record');
      userRepo.model = mocks.model;
      const result = userRepo.create('fake-json');
      expect(result).to.equal('fake-record');
    });
  });

  // We'll need a method to query for records given specific conditions
  context('#find', () => {
    it('queries for records', () => {
      // mock a mongoose query that resolves with a fake result
      mocks.query = { exec: sinon.stub().resolves('fake-result') };

      // find returns a query
      _.set(mocks, 'model.find', sinon.stub());
      mocks.model.find.withArgs('arg1').returns(mocks.query);
      userRepo.model = mocks.model;

      const result = userRepo.find('arg1');

      return expect(result).to.eventually.equal('fake-result');
    });
  });

  // We'll need a method to query for all records
  context('#findAll', () => {
    it('queries for all records', () => {
      // mock a mongoose query that resolves with a fake result
      mocks.query = { exec: sinon.stub().resolves('fake-result') };

      // find returns a query
      mocks.model = {};
      mocks.model.find = sinon.stub()
        .returns(mocks.query);
      userRepo.model = mocks.model;

      const result = userRepo.findAll();

      return expect(result).to.eventually.equal('fake-result');
    });
  });

  // We'll want a method to query for a record by id
  context('#findById', () => {
    it('queries for a record by id', () => {
      // mock a mongoose query that resolves with a fake result
      mocks.query = { exec: sinon.stub().resolves('fake-result') };

      // find returns a query
      mocks.model = {};
      mocks.model.findById = sinon.stub()
        .withArgs('fake-id')
        .returns(mocks.query);
      userRepo.model = mocks.model;

      const result = userRepo.findById('fake-id');

      return expect(result).to.eventually.equal('fake-result');
    });
  });

  // We'll want a way to find and update a record given specific conditions
  context('#findOneAndUpdate', () => {
    it('queries for one record and updates it', () => {
      // mock a mongoose query that resolves with a fake result
      mocks.query = { exec: sinon.stub().resolves('fake-result') };

      // find returns a query
      mocks.model = {};
      mocks.model.findOneAndUpdate = sinon.stub()
        .withArgs('fake-condition', 'fake-update')
        .returns(mocks.query);
      userRepo.model = mocks.model;

      const result = userRepo.findOneAndUpdate('fake-condition', 'fake-update');
      return expect(result).to.eventually.equal('fake-result');
    });
  });

  // We'll want a method to find a record by its identifier and update it.
  context('#findByIdAndUpdate', () => {
    it('queries for a record by id and updates it', () => {
      // mock a mongoose query that resolves with a fake result
      mocks.query = { exec: sinon.stub().resolves('fake-result') };

      // find returns a query
      mocks.model = {};
      mocks.model.findByIdAndUpdate = sinon.stub()
        .withArgs('fake-id', 'fake-update')
        .returns(mocks.query);
      userRepo.model = mocks.model;

      const result = userRepo.findByIdAndUpdate('fake-id', 'fake-update');
      return expect(result).to.eventually.equal('fake-result');
    });
  });

  // A method to remove a specific record
  context('#findByIdAndRemove', () => {
    it('queries for a record by id and removes it', () => {
      // mock a mongoose query that resolves with a fake result
      mocks.query = { exec: sinon.stub().resolves('fake-result') };

      // find returns a query
      mocks.model = {};
      mocks.model.findByIdAndRemove = sinon.stub()
        .withArgs('fake-id')
        .returns(mocks.query);
      userRepo.model = mocks.model;

      const result = userRepo.findByIdAndRemove('fake-id');
      return expect(result).to.eventually.equal('fake-result');
    });
  });

  // A method to drop all records from the collection
  context('#drop', () => {
    it('drops all records from the collection', () => {
      _.set(mocks, 'model.collection.deleteMany', sinon.stub().resolves(true));
      userRepo.model = mocks.model;
      const result = userRepo.drop();
      return expect(result).to.eventually.be.true;
    });
  });

  // A method to insert a collection of records
  context('#insertMany', () => {
    it('inserts many records', () => {
      _.set(mocks, 'model.insertMany', sinon.stub().withArgs('fake-records').resolves(true));
      userRepo.model = mocks.model;
      const result = userRepo.insertMany('fake-records');
      return expect(result).to.eventually.be.true;
    });
  });
});
~~~

##### Base Repository Class

The Repository Class will act as a facade in front of any mongoose model operations and queries that will be required by the codebase. By choosing this type of architecture, If we need to switch to another database in the future, we should only have to port the code contained in the repositories. We'll also be able to provide more complex model specific operations in each model's repository.

~~~javascript
// api/repositories/repository.js
/* eslint class-methods-use-this: 0 */
const debug = require('debug')('api:repos:base');

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Base Repository Class.
 */
class Repository {
  /**
   * Constructs a new Repository Instance
   * @param {string} type the name of the data type to connect to
   */
  constructor(type, db) {
    debug('constructor');
    // add type and name properties for convenience
    this.type = type;
    this.name = capitalize(type);

    // reference the swagger spec
    this.swagger = db.swagger;

    // add properties to link to mongoose items
    this.connection = db.connection;
    this.model = db.models[this.name];
    this.schema = db.schemas[this.name];


    this.typeMap = {};
  }

  /**
   * generates a new record without inserting it into the database
   * @returns {Object}
   */
  new(json) {
    // eslint-disable-next-line
    return new this.model(json);
  }

  /**
   * creates one or more records and inserts them into the database
   * @returns {Promise}
   */
  create(obj) {
    return this.model.create(obj);
  }

  /**
   * queries for records
   * @returns {Promise}
   */
  find(...args) {
    return this.model.find(...args).exec();
  }

  /**
   * queries for all records
   * @returns {Promise}
   */
  findAll() {
    return this.model.find().exec();
  }

  /**
   * queries for a record by id
   * @returns {Promise}
   */
  findById(id) {
    return this.model.findById(id).exec();
  }

  /**
   * queries for the first matching record and updates it
   * @returns {Promise}
   */
  findOneAndUpdate(id, update) {
    return this.model.findOneAndUpdate(id, update, { new: true }).exec();
  }

  /**
   * queries for a record by id and updates it
   * @returns {Promise}
   */
  findByIdAndUpdate(id, update) {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  /**
   * queries for a record by id and removes it if found
   * @returns {Promise}
   */
  findByIdAndRemove(id) {
    return this.model.findByIdAndRemove(id).exec();
  }

  /**
   * drops the records from the mongodb collection
   * @returns {Promise}
   */
  drop() {
    return this.model.collection.deleteMany();
  }

  /**
   * inserts an array of records into the collection
   * @param  {array} records array of records
   * @return {Promise}
   */
  insertMany(records) {
    return this.model.insertMany(records);
  }
}

module.exports = Repository;

~~~

##### UserRepository Class

~~~javascript
// api/repositories/user-repository.js
const Repository = require('./repository');
const debug = require('debug')('api:repos:user');

class UserRepository extends Repository {
  constructor(db) {
    debug('constructor');
    super('user', db);
  }
}

module.exports = UserRepository;

~~~

##### Initialize Repositories

Add the module below to create repository instances:

~~~javascript
// api/repositories/index.js
const UserRepository = require('./user-repository');
const debug = require('debug')('api:repos');

const repos = {};

exports.repos = repos;

exports.init = (db) => {
  debug('initializing user repository');
  repos.user = new UserRepository(db);
};

~~~

Modify `server.js` to pass in the database connection information:

~~~javascript
// api/server.js
// ... (dependencies)
const repositories = require('./repositories');

class Server {
  // ...

  async init() {
    // ... (init express, swagger express, and database)

    debug('init repositories');
    repositories.init(db);

    // ... (start listening)
  }

  // ...
}

module.exports = Server;

~~~

##### Run Tests

~~~bash
yarn test
~~~

#### Swagger JSON API Support Module

In order for our controller to interact with our repository, its going to require a `Deserializer` to transform the body of requests into a format that can be sent into the repository methods. We'll also need a `Serializer` to take data records and transform them back into the JSON API format for response bodies. Enter the Swagger JSON API support module which will assist in setting up a Serializer and Deserializer for any given model by utilizing the swagger schema, mongoose schema, and the `jsonapi-serializer` npm package.

#### Unit Test

~~~javascript
// test/unit/support/swagger-jsonapi.spec.js
const _ = require('lodash');
const { expect } = require('chai');
const helper = require('../../../api/support/swagger-jsonapi');

describe('Swagger JSON API Helper', () => {
  // The helper will need a helper that takes a schema object and
  // returns the name of the referenced definition path
  context('#getReference', () => {
    context('given a schema object of type array with a reference', () => {
      it('returns the base name of the referenced item', () => {
        const result = helper.getReference({
          type: 'array',
          items: {
            $ref: '#/definitions/TestObject',
          },
        });
        expect(result).to.equal('TestObject');
      });
    });
    context('given a schema object of type object with a reference', () => {
      it('returns the base name of the referenced item', () => {
        const result = helper.getReference({
          type: 'object',
          properties: {
            data: {
              $ref: '#/definitions/TestObject',
            },
          },
        });
        expect(result).to.equal('TestObject');
      });
    });
  });

  // We'll also be setting up a function to parse the swagger schema
  // for relationship related (de)serializer options. jsonapi-serializer
  // provides a callbacks to specify how to represent the relationship
  // in the serialized format and how to reference the related object(s)
  // in the deserialized format

  context('#parseSwagger', () => {
    const swagger = {
      definitions: {
        TestObject: {
          type: 'object',
          properties: {
            relationships: {
              type: 'object',
              properties: {
                relationship1: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/definitions/TestRel1',
                    },
                  },
                },
                relationship2: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/TestRel2',
                  },
                },
              },
            },
          },
        },
      },
    };
    const serializerOptions = {};
    const deserializerOptions = {};
    const typeMap = {};

    before(() => {
      helper.parseSwagger(swagger, 'TestObject', typeMap, serializerOptions, deserializerOptions);
    });

    it('maps the relationship name to the matching definition name', () => {
      expect(typeMap).to.deep.equal({
        relationship1: 'TestRel1',
        relationship2: 'TestRel2',
      });
    });

    it('generates serializer options for each relationship', () => {
      expect(serializerOptions).to.matchPattern({
        relationship1: {
          ref: _.isFunction,
          included: false,
        },
        relationship2: {
          ref: _.isFunction,
          included: false,
        },
      });

      const fn = serializerOptions.relationship1.ref;
      expect(fn(null, 'fake-value')).to.equal('fake-value');
      expect(fn(null, 1)).to.equal('1');
      expect(fn(null, null)).to.equal(null);
      expect(fn()).to.be.undefined;
    });

    it('generates deserializer options for each relationship', () => {
      expect(deserializerOptions).to.matchPattern({
        TestRel1: {
          valueForRelationship: _.isFunction,
        },
        TestRel2: {
          valueForRelationship: _.isFunction,
        },
      });

      const fn = deserializerOptions.TestRel1.valueForRelationship;
      expect(fn({ id: 'fake-id' })).to.equal('fake-id');
    });
  });
});

~~~

##### Implementation

~~~javascript
// api/support/swagger-jsonapi.js
const _ = require('lodash');
const { Serializer, Deserializer } = require('jsonapi-serializer');
const debug = require('debug')('api:swagger-jsonapi');

/**
 * Retrieves a path reference to a definition from a Swagger Schema Object
 * @param  {object} property [description]
 * @return {[type]}          [description]
 */
exports.getReference = (property) => {
  let ref;
  if (property.type === 'array') {
    ref = _.get(property, 'items.$ref');
  } else {
    ref = _.get(property, 'properties.data.$ref');
  }
  return ref.split('/').pop();
};

exports.pullAttributes = value => _.chain(value)
  .get('paths')
  .keys()
  .pull('__v', '_id', 'type')
  .value();

/**
 * parses swagger for relationship related serializer options
 */
exports.parseSwagger = (swagger, type, typeMap, serializerOptions, deserializerOptions) => {
  debug('parseSwagger');

  // get the relationship properties from the swagger definition for this type
  const path = `definitions[${type}].properties.relationships.properties`;
  const relationships = _.get(swagger, path);

  _.forEach(relationships, (property, name) => {
    debug('property:', name);

    // denote the attributes which are relationships for the serializer
    _.set(serializerOptions, name, {
      ref: (record, value) => (value ? value.toString() : value),
      included: false,
    });

    // denote what value to use to represent the relationship.
    // JSON API sends an identifier and type
    const definitionReference = exports.getReference(property);
    _.set(typeMap, name, definitionReference);
    _.set(deserializerOptions, definitionReference, {
      valueForRelationship: relationship => relationship.id,
    });
  });
};

exports.generate = (type, swagger, schema) => {
  debug('generate');
  // Pull the attributes from the schema
  const attributes = exports.pullAttributes(schema);
  debug('attributes', attributes);

  const typeMap = {};

  const serializerOptions = {
    // Mongoose uses _id
    id: '_id',
    // provide the serializer with the attributes that should be included
    attributes,
    // specify the case to be used for the keys
    keyForAttribute: 'camelCase',
    // maps attributes to a type
    // when type is specified, use it, otherwise get it from the type map.
    typeForAttribute: (name, value) => value.type || _.get(typeMap, name),
    // pluralize the types
    pluralizeType: true,
  };

  const deserializerOptions = {
    keyForAttribute: 'camelCase',
  };

  exports.parseSwagger(serializerOptions, deserializerOptions);

  return {
    serializer: new Serializer(type, serializerOptions),
    deserializer: new Deserializer(deserializerOptions),
  };
};

~~~

##### Repository Class Modifications

In this step, we'll integrate our Swagger JSON-API helper into the base Repository class, so that each repository gets initialied with a methods to serialize and deserialize data.

~~~javascript
// api/repositories/repository.js
// ...

// require in our support module
const jsonapi = require('../support/swagger-jsonapi');

class Repository {
  constructor(type, db) {
    // ...
    // add this to the bottom of the constructor
    this.initSerializers();
  }

  // Then add this private method:

  /**
   * initializes the JSON API Serializer serializerOptions
   * @private
   */
  initSerializers() {
    const { type, swagger, schema } = this;

    // generate our (de)serializers using our helper module
    const { serializer, deserializer } = jsonapi.generate(type, swagger, schema);

    // we add the binding here so as to not lose the appropriate context when these are called
    this.serialize = serializer.serialize.bind(serializer);
    this.deserialize = deserializer.deserialize.bind(deserializer);
  }

  // ...
}
~~~

Having added this, you might have realized that the functionality is not tested. Lets modify the unit tests to bump up our code coverage again.  Start by remove the following lines of code from the User Repository test. We'll be using `proxyquire` in place of `require` to mock the JSON API support dependency in the test.

~~~javascript
// test/unit/repositories/user-repository.spec.js

const Repository = require('../../../api/repositories/repository');
const UserRepository = require('../../../api/repositories/user-repository');
~~~

Add the code below:

~~~javascript
// test/unit/repositories/user-repository.spec.js
const proxyquire = require('proxyquire');

describe('User Repository', () => {
  // ...
  let UserRepository;
  let Repository;
  let mockHelper;

  // add a before hook to run some setup before any of the tests:
  before(() => {
    // setup a mock helper object so tests can add stubbed methods
    mockHelper = {};

    // swagger-jsonapi is required inside of the base class, so we'll replace it there
    Repository = proxyquire('../../../api/repositories/repository', {
      '../support/swagger-jsonapi': mockHelper,
    });

    // then we link the modified base class to the User Repository class
    UserRepository = proxyquire('../../../api/repositories/user-repository', {
      './repository': Repository,
    });
  });

  beforeEach(function () {
    // ...

    // stub the initSerializers method before creating the instance
    mocks.initSerializers = sinon.stub(
      UserRepository.prototype,
      'initSerializers',
    );

    // create a user repository
    userRepo = new UserRepository(mocks.db);
  });

  context('#constructor', () => {
    it('creates an instance of UserRepository', () => {
      // ...
      // make sure the constructor is calling the initSerializers method
      expect(mocks.initSerializers).to.have.been.called;
    });
    // ...
  });

  // add a context to test the initSerializers method

  context('#initSerializers', () => {
    beforeEach(async function () {
      // restore the initSerializers mock to the original as we actually want to test it here
      mocks.initSerializers.restore();

      // create a mock return value for the db generate function.
      mocks.serializers = {
        serializer: { serialize: sinon.stub() },
        deserializer: { deserialize: sinon.stub() },
      };

      // set some properties that would have been setup by the constructor
      userRepo.type = 'fake-type';
      userRepo.swagger = 'fake-swagger';
      userRepo.schema = 'fake-schema';
    });

    it('sets the serializer and deserializer', () => {
      // stub our generate function, we don't need to test its functionality here
      mockHelper.generate = sinon.stub()
        .withArgs('fake-type', 'fake-swagger', 'fake-schema')
        .returns(mocks.serializers);

      // execute the method
      userRepo.initSerializers();

      // verify that generate is used
      expect(mockHelper.generate).to.have.been.called;

      // verify that the user repository instance now has serializer and deserializer methods
      // and that these methods call the functions returned by the generate helper
      userRepo.serialize();
      userRepo.deserialize();
      expect(mocks.serializers.serializer.serialize).to.have.been.calledOnce;
      expect(mocks.serializers.deserializer.deserialize).to.have.been.calledOnce;
    });
  });
~~~

#### User Controller

We're all set to begin work on the controllers which will provide the endpoint handlers for our routes. Each of our routes will follow a similar process:

- Parse the request object for any necessary parameters
- If a request body was provided, deserialize the data.
- Use the repositories to peform the necessary operations on the database
- If send a response body, serialize the data.
- Send the response with a status, including the necessary data, and formatted as a JSON API media type

##### Starting the Unit Test

The user routes we defined inside the Swagger.yaml reference 5 Operation IDs.
Start a test file for the user controller using the following code boilerplate:

~~~javascript
// test/unit/controllers/users-controller.spec.js
const userController = require('../../../api/controllers/users-controller');

describe('User Controller', () => {
  context('#createUser', () => {});
  context('#getUsers', () => {});
  context('#getUser', () => {});
  context('#updateUserById', () => {});
  context('#removeUserById', () => {});
});
~~~

##### Helper to stub out express requests and responses

For our unit tests, we won't actually have express sending its request and response objects into our methods. We'll need to stub those out:

~~~javascript
// test/support/express-stubs.js
exports.createRequest = () => ({
  swagger: {},
});

// in the response stub, we'll provide three callback stubs to allow tests to verify
// that responses are sent back appropriately
exports.createResponse = (sinon) => {
  const res = {};
  res.send = sinon.stub().returns(res);
  res.status = sinon.stub().returns(res);
  res.type = sinon.stub().returns(res);
  return res;
};

~~~

##### Helper to use JSON API Serializer/Deserializer in Tests

We will also provide a support module to allow tests to serialize and deserialize data without relying on the code in our api app.

~~~javascript
// test/support/jsonapi.js
const _ = require('lodash');
const { generate } = require('../../api/support/swagger-jsonapi');
const debug = require('debug')('test:jsonapi');

exports.serializers = {};
exports.deserializers = {};

exports.init = (swagger, schemas) => {
  debug('json api init');
  const types = Object.keys(schemas);

  types.forEach((type) => {
    debug('type:', type);
    const schema = _.get(schemas, type);
    const { serializer, deserializer } = generate(type, swagger, schema);

    exports.serializers[type] = records => serializer.serialize(records);
    exports.deserializers[type] = records => deserializer.deserialize(records);
  });
};

~~~

##### User Factory

To properly test our controller, we need some mock data. Sure, you could always manually create some fake data in each of your tests, or even provide a global fixture all your tests can use. I donʼt usually recommend that approach. As long as the situation allows for it, I prefer setting up a factory to generate fake data on the fly. To accomplish this, we will be using `factory-girl`, a javascript port of the Ruby on Rails project, now renamed "FactoryBot."

~~~javascript
// test/support/factories/setup-user-factory.js
const { factory } = require('factory-girl');

module.exports = (models, chance) => {
  factory.define('user', models.User, {
    username: chance.email.bind(chance),
    firstName: chance.first.bind(chance),
    lastName: chance.last.bind(chance),
  });
};

~~~

##### Modification of Test Setup

To make use of this factory, we will need to connect `factory-girl` to MongoDB with a mongoose adapter.  Add the following code to our test setup module:

~~~javascript
// test/setup.js
// ...
const { factory, MongooseAdapter } = require('factory-girl');
const Chance = require('chance');
const jsonapi = require('./support/jsonapi');
const setupUserFactory = require('./support/factories/setup-user-factory');

before(async function () {
  // ... setup chai, connect db, create app

  debug('creating mongoose adapter for factory-girl');
  const adapter = new MongooseAdapter();
  factory.setAdapter(adapter);

  debug('setting up factories');
  this.chance = new Chance();
  this.models = this.server.express.get('models');
  setupUserFactory(this.models, this.chance);

  debug('setting up json api serializers');
  this.schemas = this.server.express.get('schemas');
  this.swagger = this.server.express.get('swagger');
  jsonapi.init(this.swagger, this.schemas);
});

// ...
~~~

We're ready to begin implementing our controller.

##### Controller Boilerplate

Start the users controller with the boilerplate below:

~~~javascript
// api/controllers/users-controller.js
const _ = require('lodash');
const { repos } = require('../repositories');
const debug = require('debug')('api:controllers:user');

module.exports = {};

~~~

#### POST /users

Lets start adding users.  To do that we will implement the `POST` route.

##### Pseudo Code

Our route's endpoint will need to do the following:

~~~js
class userController {
    createUser(request, response) {
        1. Get the user request body parameter from the request.
        2. Deserialize the user request that is in JSON API format.
        3. Create and insert a new user record.
        4. Serialize the new record into JSON API format.
        5. Send a HTTP response with a 201 status,
           in JSON API media format,
           with the serialized record as the body.
    }
}
~~~

##### Unit Test

Setup the unit test first:

~~~javascript
// test/unit/controllers/users-controller.spec.js
const _ = require('lodash');
const { expect } = require('chai');
const { factory } = require('factory-girl');
const expressStubs = require('../../support/express-stubs');
const userController = require('../../../api/controllers/users-controller');
const UserRepository = require('../../../api/repositories/user-repository');
const repositories = require('../../../api/repositories');

describe('User Controller', () => {
  let sinon;
  let stubReq;
  let stubRes;
  let stubUserRepo;

  // use function syntax here so that we have access to `this`
  beforeEach(function () {
    // reference the sandbox created in setup.js
    sinon = this.sandbox;

    // stub request and response
    stubReq = expressStubs.createRequest(sinon);
    stubRes = expressStubs.createResponse(sinon);

    // stub user repository
    stubUserRepo = sinon.createStubInstance(UserRepository);

    // add reference in repositories module
    repositories.repos.user = stubUserRepo;
  });

  afterEach(() => {
    // cleanup reference
    delete repositories.repos.user;
  });

  context('#createUser', () => {
    // construct a new user
    let newUser;
    beforeEach(() => {
      newUser = factory.build('user');
    });

    it('creates and inserts a new user', async () => {
      // stub deserializing the JSON API formatted request body
      stubUserRepo.deserialize = sinon.stub()
        .withArgs('new-user-post-request')
        .resolves(newUser);

      // stub the method to create the user
      stubUserRepo.create
        .withArgs(newUser)
        .resolves('new-user-record');

      // stub serializing the record back into JSON API format
      stubUserRepo.serialize = sinon.stub()
        .withArgs('new-user-record')
        .returns('serialized-user');

      // set a fake value for our user body parameter
      _.set(stubReq, 'swagger.params.user.value', 'new-user-post-request');

      // execute the operation
      await userController.createUser(stubReq, stubRes);

      // verify response was sent properly
      expect(stubRes.send).to.have.been.calledWith('serialized-user');
      expect(stubRes.status).to.have.been.calledWith(201);
      expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
    });
  });
  context('#getUsers', () => {});
  context('#getUser', () => {});
  context('#updateUserById', () => {});
  context('#removeUserById', () => {});
});
~~~

##### Implementation

Next we will implement the `createUser` method on the Users Controller:

~~~javascript
// api/controllers/users-controller.js
const _ = require('lodash');
const { repos } = require('../repositories');
const debug = require('debug')('api:controllers:user');

module.exports = {
  /**
   * POST endpoint for creating a new user
   * @param  {object}  req express request object
   * @param  {object}  res epresss response object
   */
  createUser: async (req, res) => {
    debug('execute - createUser');

    // Step 1. Get the user request body
    debug('parsing swagger parameters');
    const { params } = req.swagger;
    const rawUser = _.get(params, 'user.value');
    debug('raw user', rawUser);

    // Step 2. Deserialize the user
    debug('deserializing user');
    const { username, firstName, lastName } = await repos.user.deserialize(rawUser);
    debug('username:', username);
    debug('first name:', firstName);
    debug('last name:', lastName);

    // Step 3. Create user record
    debug('creating record');
    const record = await repos.user.create({ username, firstName, lastName });
    debug('record', record);

    // Step 4. Serialize
    debug('serializing');
    const body = repos.user.serialize(record);

    // Step 5. Send HTTP response
    debug('sending response:', body);
    return res.type('application/vnd.api+json')
      .status(201)
      .send(body);
  },
};

~~~

##### Integration Test

~~~javascript
// test/integration/routes/users/post-users.spec.js
const _ = require('lodash');
const moment = require('moment');
const { expect } = require('chai');
const { factory } = require('factory-girl');
const { serializers } = require('../../../support/jsonapi');
const debug = require('debug')('test'); // eslint-disable-line

const validTimestamp = value => moment(value, moment.ISO_8601, true).isValid();

// The POST operation on the /users route hits our controller method...
describe('POST /users/', () => {
  let user;
  let userModel;

  // before the tests run, build a user and get the user model
  before(async function () {
    user = await factory.build('user');
    userModel = this.models.User;
  });

  context('given a new user', function () {
    it('inserts a new user', async function () {
      // Send POST user request
      const response = await this.request
        .post('/users')
        .send(serializers.User(user));

      // route should return the user in the response body
      expect(response.error).to.be.false;
      expect(response.status).to.equal(201);
      expect(response.body).to.matchPattern({
        data: {
          type: 'users',
          id: _.isString,
          attributes: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            updatedAt: validTimestamp,
            createdAt: validTimestamp,
          },
        },
      });

      // The user should also be in the database
      const id = _.get(response, 'body.data.id');
      const userRecord = await userModel.findById(id).exec();
      expect(userRecord).to.exist;
    });
  });
});
~~~

#### GET /users

Next we will add code to retrieve all the users.

##### Pseudo Code

Our endpoint will need to do the following:

~~~js
class userController {
    getUsers(request, response) {
        1. Query DB for all users
        2. Send a HTTP response
           with a 200 status
           with the users serialized in JSON API format.
    }
}
~~~

##### Unit Test

~~~javascript
// test/unit/controllers/users-controller.spec.js
// ...

describe('User Controller', () => {
  // nothing changes in these tests
  context('#createUser', () => {/** ... **/});

  // add a context for the getUsers method
  context('#getUsers', () => {
    it('queries for and sends back all users', async () => {
      // Lets fake a collection of users, the actual format doesn't matter here.
      const fakeUsers = ['test-user-1', 'test-user-2', 'test-user-3'];

      // stub #findAll to return the fake user records
      stubUserRepo.findAll
        .withArgs()
        .resolves(fakeUsers);

      // stub serialize to return a fake serialized response
      stubUserRepo.serialize = sinon.stub()
        .withArgs(fakeUsers)
        .returns('serialized-users');

      // execute the method
      await userController.getUsers(stubReq, stubRes);

      // verify response was sent properly
      expect(stubRes.send).to.have.been.calledWith('serialized-users');
      expect(stubRes.status).to.have.been.calledWith(200);
      expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
    });
  });
  context('#getUser', () => {});
  context('#updateUserById', () => {});
  context('#removeUserById', () => {});
});

~~~

##### Implementation

Now lets implement the endpoint:

~~~javascript
// api/controllers/users-controller.js
// ...
module.exports = {
  // ...

  /**
   * GET endpoint to retrieve all user records
   * @param  {object}  req express request object
   * @param  {object}  res express response object
   */
  getUsers: async (req, res) => {
    // use the User repo to query for all the Users
    debug('query for all users');
    const users = await repos.user.findAll();

    // and then send the response
    debug('send users serialized in JSON API format');
    res.type('application/vnd.api+json')
      .status(200)
      .send(repos.user.serialize(users));
  },
};
~~~

##### Integration Test

Now we can test that the code integrates with the database correctly:

~~~javascript
// test/integration/routes/users/get-users.spec.js
const _ = require('lodash');
const moment = require('moment');
const { expect } = require('chai');
const { factory } = require('factory-girl');
const debug = require('debug')('test'); // eslint-disable-line

const validTimestamp = value => moment(value, moment.ISO_8601, true).isValid();

describe('GET /users/', () => {
  let users;

  // Populate the database before the tests run
  before(async function () {
    // create 5 records in the User collection
    users = await factory.createMany('user', 5);
  });

  context('Given a User collection with 5 users', function () {
    it('should return all 5 users', async function () {
      // send a request for all the users
      const response = await this.request
        .get('/users');

      // route should return the users in the response body
      expect(response.error).to.be.false;
      expect(response.status).to.equal(200);
      expect(response.body).to.exist;

      // construct an array of all user ids
      const userIds = _.map(users, user => user.id);

      // matcher function - true when an id matches with one of the IDs from the array above
      const matchesOneUserID = id => _.includes(userIds, id);

      // check that data is correct in the database
      const { data } = response.body;
      expect(data).to.be.an('array').that.is.lengthOf(5);
      data.forEach((item) => {
        expect(item).to.matchPattern({
          type: 'users',
          id: matchesOneUserID,
          attributes: {
            username: _.isString,
            firstName: _.isString,
            lastName: _.isString,
            updatedAt: validTimestamp,
            createdAt: validTimestamp,
          },
        });
      });
    });
  });
});

~~~

#### GET /user/:id

Next we can implement the endpoint to retrieve a single user.

##### Pseudo Code

Our method will need to do the following:

~~~js
class userController {
    getUser(request, response) {
        1. Get the id query parameter from the request
        2. Query the DB for a user with matching ID
        3. If the record exists, send the serialized record back with a 200 status.
        4. Otherwise send a 404 status
    }
}
~~~

##### Unit Test

Add the following to our User Controller Unit Test:

~~~javascript
// test/unit/controllers/users-controller.spec.js
// ...

describe('User Controller', () => {
  context('#createUser', () => {/** ... **/});
  context('#getUsers', () => {/** ... **/});

  context('#getUser', () => {
    // in the stubbed request object that's already setup...
    beforeEach(() => {
      // set the id parameter value
      _.set(stubReq, 'swagger.params.id.value', 1);
    });

    // test the happy path
    context('when the user exists', () => {
      it('retrieves the user', async () => {
        // stub method to find by id, have it return a fake user response
        stubUserRepo.findById
          .withArgs(1)
          .returns('test-user');

        // stub the serializer to return a fake serialized response
        stubUserRepo.serialize = sinon.stub()
          .withArgs('test-user')
          .returns('serialized-test-user');

        // execute
        await userController.getUser(stubReq, stubRes);

        // verify that the response is correct
        expect(stubRes.send).to.have.been.calledWith('serialized-test-user');
        expect(stubRes.status).to.have.been.calledWith(200);
        expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
      });
    });

    // test the error path
    context('when the user does not exist', () => {
      it('sends 404 User Not Found Error Response', async () => {
        // stub method to find by id, but return undefined
        stubUserRepo.findById
          .withArgs(1)
          .returns(undefined);

        // execute
        await userController.getUser(stubReq, stubRes);

        // expect 404 error with an appropriate JSON API Error Response
        expect(stubRes.status).to.have.been.calledWith(404);
        expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
        expect(stubRes.send).to.have.been.calledWithExactly({
          errors: [{
            status: '404',
            title: 'User Not Found',
            detail: 'A user with id 1 could not be found',
          }],
        });
      });
    });
  });

  context('#updateUserById', () => {});
  context('#removeUserById', () => {});
});
~~~

##### Implementation

Add the following to the Users Controller class:

~~~javascript
// api/controllers/users-controller.js
// ...
module.exports = {
  // ...
  /**
   * GET endpoint for retrieving a user by id
   * @param  {object}  req express request object
   * @param  {object}  res express response object
   */
  getUser: async (req, res) => {
    // get the user id
    debug('parsing swagger parameters');
    const { params } = req.swagger;
    const id = params.id.value;

    // execute query for the user
    debug('query for user by id');
    const record = await repos.user.findById(id);

    // if the record exists, send it back, otherwise send an error response
    if (record) {
      debug('record found, sending back');
      res.type('application/vnd.api+json')
        .status(200)
        .send(repos.user.serialize(record));
    } else {
      debug('record not found, sending error response');
      res.type('application/vnd.api+json')
        .status(404)
        .send({
          errors: [{
            status: '404',
            title: 'User Not Found',
            detail: `A user with id ${id} could not be found`,
          }],
        });
    }
  },
};
~~~

##### Integration Test

Then we can verify that the endpoint integrates with the database properly:

~~~javascript
// test/integration/routes/users/get-user-by-id.spec.js
const _ = require('lodash');
const moment = require('moment');
const { expect } = require('chai');
const { factory } = require('factory-girl');
const debug = require('debug')('test'); // eslint-disable-line

const validTimestamp = value => moment(value, moment.ISO_8601, true).isValid();

describe('GET /users/:id', () => {
  let users;
  let user;
  let userModel;

  before(async function () {
    // create 5 records in the User collection
    users = await factory.createMany('user', 5);

    // pick one of the users
    user = _.sample(users);

    // get the user model
    userModel = this.models.User;
  });

  context('Given a User collection with 5 users', function () {
    it('should return the user whose id is specified', async function () {
      // send a request for the user
      const response = await this.request
        .get(`/users/${user.id}`);

      // route should return the user in the response body
      expect(response.error).to.be.false;
      expect(response.status).to.equal(200);
      expect(response.body).to.exist;

      // check that the data is correct:
      const { data } = response.body;
      expect(data).to.exist;
      expect(data).to.matchPattern({
        type: 'users',
        id: user.id,
        attributes: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          updatedAt: validTimestamp,
          createdAt: validTimestamp,
        },
      });

      // The user should also be in the database
      const record = await userModel.findById(user.id).exec();
      expect(record).to.exist;
    });
  });
});

~~~

#### PATCH /user/:id

Now lets implement the endpoint to update user records.

##### Pseudo Code

Our method will need to do the following:

~~~js
class userController {
    updateUserById(request, response) {
    1. Get the id query parameter from the request
    2. Deserialize the JSON API request body
    3. Find record by ID and update with request body
    4. Serialize the updated record
    5. Send HTTP request with status 200
  }
}
~~~

##### Unit Test

Add the following code to the User Controller unit test:

~~~javascript
// test/unit/controllers/user-controller.spec.js
// ...

describe('User Controller', () => {
  context('#createUser', () => {/** ... **/});
  context('#getUsers', () => {/** ... **/});
  context('#getUser', () => {/** ... **/});
  context('#updateUserById', () => {
    beforeEach(() => {
      // set id parameter on the stub createRequest
      _.set(stubReq, 'swagger.params.id.value', 1);

      // set the body parameter
      _.set(stubReq, 'swagger.params.user.value', 'updated-user-data');
    });
    // test the happy path
    context('when the user exists', () => {
      it('updates the user and sends it back', async () => {
        // stub the deserializer and resolve with a fake deserialized user
        stubUserRepo.deserialize = sinon.stub()
          .withArgs('updated-user-data')
          .resolves('deserialized-user');

        // stub the find by id and update, resolve with a fake response
        stubUserRepo.findByIdAndUpdate
          .withArgs(1, 'deserialized-user')
          .resolves('updated-record');

        // stub the serializer, return fake response
        stubUserRepo.serialize = sinon.stub()
          .withArgs('updated-record')
          .returns('serialized-test-user');

        // execute the method
        await userController.updateUserById(stubReq, stubRes);

        // expect success
        expect(stubRes.send).to.have.been.calledWith('serialized-test-user');
        expect(stubRes.status).to.have.been.calledWith(200);
        expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
      });
    });

    context('when the user does not exist', () => {
      it('sends a 404 User Not Found error response', async () => {
        // stub the deserializer
        stubUserRepo.deserialize = sinon.stub()
          .withArgs('updated-user-data')
          .resolves('deserialized-user');

        // stub method to find by id and update
        stubUserRepo.findByIdAndUpdate
          .withArgs(1, 'deserialized-user')
          .returns(undefined);

        // execute
        await userController.updateUserById(stubReq, stubRes);

        // expect 404 error with an appropriate JSON API Error Response
        expect(stubRes.status).to.have.been.calledWith(404);
        expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
        expect(stubRes.send).to.have.been.calledWithExactly({
          errors: [{
            status: '404',
            title: 'User Not Found',
            detail: 'A user with id 1 could not be found',
          }],
        });
      });
    });
  });
  context('#removeUserById', () => {});
});
~~~

##### Implementation

Now implement the endpoint method:

~~~javascript
// api/controllers/users-controller.js
// ...
module.exports = {
  // ...
  /**
   * Updates the user record specified by an id query parameter
   * @param  {Object}  req express request object
   * @param  {Object}  res express response object
   */
  updateUserById: async (req, res) => {
    // get the id and user body from the request
    debug('parsing swagger parameters');
    const { params } = req.swagger;
    const id = params.id.value;
    const user = params.user.value;

    // transform from the JSON API format
    debug('deserializing');
    const update = await repos.user.deserialize(user);

    // Find and update the appropriate user record
    debug('query for user by id and update');
    const record = await repos.user.findByIdAndUpdate(id, update);

    // if a record was returned, send it back, otherwise the record was not updated/found:
    if (record) {
      debug('record updated');
      res.type('application/vnd.api+json')
        .status(200)
        .send(repos.user.serialize(record));
    } else {
      debug('record not updated');
      res.type('application/vnd.api+json')
        .status(404)
        .send({
          errors: [{
            status: '404',
            title: 'User Not Found',
            detail: `A user with id ${id} could not be found`,
          }],
        });
    }
  },
};
~~~

##### Integration Test

Now verify that the code integrates with the database:

~~~javascript
// test/integration/routes/users/patch-user-by-id.spec.js
const moment = require('moment');
const { expect } = require('chai');
const { factory } = require('factory-girl');
const debug = require('debug')('test'); // eslint-disable-line

const validTimestamp = value => moment(value, moment.ISO_8601, true).isValid();

describe('PATCH /users/:id', () => {
  let user;
  let chance;
  let userModel;

  before(async function () {
    // get the chance fake data library instance, setup in test/setup.js
    ({ chance } = this);

    // create a user in the database
    user = await factory.create('user');

    // get the user model
    userModel = this.models.User;
  });

  context('Given a User', function () {
    it('should update the user', async function () {
      // build a request body for the request.
      const updates = {
        data: {
          type: 'users',
          attributes: {
            username: chance.email(),
            firstName: chance.first(),
            lastName: chance.last(),
          },
        },
      };

      // send the request
      const response = await this.request
        .patch(`/users/${user.id}`)
        .send(updates);

      // route should return the user in the response body
      expect(response.error).to.be.false;
      expect(response.status).to.equal(200);
      expect(response.body).to.exist;

      // check that data is correct:
      const { data } = response.body;
      expect(data).to.exist;
      expect(data).to.matchPattern({
        type: 'users',
        id: user.id,
        attributes: {
          username: updates.data.attributes.username,
          firstName: updates.data.attributes.firstName,
          lastName: updates.data.attributes.lastName,
          updatedAt: validTimestamp,
          createdAt: validTimestamp,
        },
      });

      // it should also be updated in the database
      const record = await userModel.findById(user.id).exec();
      expect(record).to.exist;
      expect(record).to.include(updates.data.attributes);
    });
  });
});

~~~

#### DELETE /user/:id

The final endpoint to implement allows us to delete users.

##### Pseudo Code

Our method will need to do the following:

~~~js
class userController {
    removeUserById(request, response) {
        1. parse swagger parameters for id query parameter
        2. execute findByIdAndRemove
        3. return response
    }
}
~~~

##### Unit Test

Add the following to the User Controller unit test:

~~~javascript
// test/unit/controllers/user-controller.spec.js
// ...
describe('User Controller', () => {
  context('#createUser', () => {/** ... **/});
  context('#getUsers', () => {/** ... **/});
  context('#getUser', () => {/** ... **/});
  context('#updateUserById', () => {/** ... **/});
  context('#removeUserById', () => {
    beforeEach(() => {
      // set id parameter on the stub createRequest
      _.set(stubReq, 'swagger.params.id.value', 1);
    });
    context('When the user exists', () => {
      it('removes the user', async () => {
        // stub the find by id and update
        stubUserRepo.findByIdAndRemove
          .withArgs(1)
          .resolves('removed-record');

        // stub the serializer
        stubUserRepo.serialize = sinon.stub()
          .withArgs('removed-record')
          .returns('serialized-user');

        // execute
        await userController.removeUserById(stubReq, stubRes);

        // expect success
        expect(stubRes.send).to.have.been.calledWith('serialized-user');
        expect(stubRes.status).to.have.been.calledWith(200);
        expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
      });
    });
    context('When the user does not exist', () => {
      it('sends back an error message', async () => {
        // stub the find by id and update
        stubUserRepo.findByIdAndRemove
          .withArgs(1)
          .resolves(undefined);

        // execute
        await userController.removeUserById(stubReq, stubRes);

        // expect 404 error with an appropriate JSON API Error Response
        expect(stubRes.status).to.have.been.calledWith(404);
        expect(stubRes.type).to.have.been.calledWith('application/vnd.api+json');
        expect(stubRes.send).to.have.been.calledWithExactly({
          errors: [{
            status: '404',
            title: 'User Not Found',
            detail: 'A user with id 1 could not be found',
          }],
        });
      });
    });
  });
});
~~~

##### Implementation

Add the following to the User Controller class:

~~~javascript
// api/controllers/users-controller.js
// ...
module.exports = {
  // ...

  /**
   * Removes the user record specified by an id query parameter
   * @param  {Object}  req express request object
   * @param  {Object}  res express request object
   */
  removeUserById: async (req, res) => {
    debug('parsing swagger parameters');
    const { params } = req.swagger;
    const id = params.id.value;

    debug('query for user by id and remove');
    const record = await repos.user.findByIdAndRemove(id);

    if (record) {
      debug('record removed');
      res.type('application/vnd.api+json')
        .status(200)
        .send(repos.user.serialize(record));
    } else {
      debug('record not removed');
      res.type('application/vnd.api+json')
        .status(404)
        .send({
          errors: [{
            status: '404',
            title: 'User Not Found',
            detail: `A user with id ${id} could not be found`,
          }],
        });
    }
  },
};
~~~

##### Integration Test

Then test that the code integrates with the database correctly:

~~~javascript
// test/integration/routes/users/delete-user-by-id.spec.js
const moment = require('moment');
const { expect } = require('chai');
const { factory } = require('factory-girl');
const debug = require('debug')('test'); // eslint-disable-line

const validTimestamp = value => moment(value, moment.ISO_8601, true).isValid();

describe('DELETE /users/:id', () => {
  let user;
  let userModel;
  before(function () {
    userModel = this.models.User;
  });
  context('Given a User', function () {
    beforeEach(async () => {
      user = await factory.create('user');
    });
    it('should remove the user', async function () {
      const response = await this.request
        .delete(`/users/${user.id}`);

      // route should return the users in the response body
      expect(response.error).to.be.false;
      expect(response.status).to.equal(200);
      expect(response.body).to.exist;

      // check that data is correct:
      const { data } = response.body;
      expect(data).to.exist;
      expect(data).to.matchPattern({
        type: 'users',
        id: user.id,
        attributes: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          updatedAt: validTimestamp,
          createdAt: validTimestamp,
        },
      });

      // it should also not be in the database
      const record = await userModel.findById(user.id).exec();
      expect(record).to.not.exist;
    });
  });
});

~~~

If you run all the tests now, you should see the output below:

~~~shell
> yarn test
yarn run v1.3.2
$ ./bin/test


  Database
    ✓ connects to the mongo database
    ✓ closes the connection to the mongo database

  DELETE /users/:id
    Given a User
      ✓ should remove the user

  GET /users/:id
    Given a User collection with 5 users
      ✓ should return the user whose id is specified

  GET /users/
    Given a User collection with 5 users
      ✓ should return all 5 users

  GET /users/:id
    Given a User
      ✓ should update the user

  POST /users/
    given a new user
      ✓ inserts a new user

  User Controller
    #createUser
      ✓ creates and inserts a new user
    #getUsers
      ✓ queries for and sends back all users
    #getUser
      when the user exists
        ✓ retrieves the user
      when the user does not exist
        ✓ sends 404 User Not Found Error Response
    #updateUserById
      when the user exists
        ✓ updates the user and sends it back
      when the user does not exist
        ✓ sends a 404 User Not Found error response
    #removeUserById
      When the user exists
        ✓ removes the user
      When the user does not exist
        ✓ sends back an error message

  Unit — Database
    #connect
      ✓ connects to the mongo database
    #disconnect
      connection exists
        ✓ closes the connection
      connection does not exist
        ✓ does nothing
    #parseSwagger
      ✓ loads the swagger schema and compiles the swagger mongoose specs

  User Repository
    #constructor
      ✓ creates an instance of UserRepository
      ✓ has a type of "user"
    #initSerializers
      ✓ sets the serializer and deserializer
    #new
      ✓ uses the mongoose Model to build a new instance
    #create
      ✓ uses the mongoose Model to create a new instance
    #find
      ✓ queries for records
    #findAll
      ✓ queries for all records
    #findById
      ✓ queries for a record by id
    #findOneAndUpdate
      ✓ queries for one record and updates it
    #findByIdAndUpdate
      ✓ queries for a record by id and updates it
    #findByIdAndRemove
      ✓ queries for a record by id and removes it
    #drop
      ✓ drops all records from the collection
    #insertMany
      ✓ inserts many records

  Swagger JSON API Helper
    #getReference
      given a schema object of type array with a reference
        ✓ returns the base name of the referenced item
      given a schema object of type object with a reference
        ✓ returns the base name of the referenced item
    #parseSwagger
      ✓ maps the relationship name to the matching definition name
      ✓ generates serializer options for each relationship
      ✓ generates deserializer options for each relationship


  37 passing (341ms)

✨  Done in 1.51s.
~~~

#### Seeding the DB

The final task for this phase of development is to seed the database with some sample data. This will provide our Ember client app with some actual data to display. In the code below we connect to MongoDB using `mongoose` and repurpose our User Factory to generate some random users:

~~~javascript
// db/seed/index.js
const _ = require('lodash');
const fs = require('fs');
const YAML = require('yamljs');
const mongoose = require('mongoose');
const swaggerMongoose = require('swagger-mongoose');
const debug = require('debug')('seed');
const Chance = require('chance');
const { factory } = require('factory-girl');
const setupUserFactory = require('../../test/support/factories/setup-user-factory');

mongoose.set('debug', true);

async function seed() {
  debug('connecting to DB');
  await mongoose.connect('mongodb://localhost/jsonapi_ember_demo_dev');
  mongoose.connection.on('error', err => debug(err));
  mongoose.connection.once('open', () => debug('conection open'));

  const db = mongoose.connection;
  debug('connection status:', db.readyState);

  if (db && process.env.CLEAR_DB === 'true') {
    debug('clearing db');
    const collections = await mongoose.connection.db.collections();
    const actions = [];
    _.each(collections, (collection) => {
      debug(`clearing ${collection.collectionName}`);
      actions.push(collection.deleteMany({}));
    });
    await actions;
  }

  debug('loading swagger YAML');
  const swaggerFile = './api/swagger/swagger.yaml';
  const yaml = fs.readFileSync(swaggerFile, 'utf8');
  const spec = YAML.parse(yaml);

  debug('generating mongoose schemas and models');
  const { models } = swaggerMongoose.compile(spec);

  debug('setting up factories');
  const chance = new Chance();
  setupUserFactory(models, chance);

  debug('populating with sample users');
  await factory.createMany('user', 5);

  debug('closing connection');
  mongoose.connection.close();
}

debug('initiating seeding of database.');
seed()
  .then(() => debug('complete'))
  .catch((err) => {
    debug('error!', err);
    mongoose.connection.close();
  });
~~~

Go ahead and seed the database now with the command below:

~~~shell
yarn seed
~~~

The JSON API server is now complete!

Stay tuned for [*Phase 4: Building an Ember App that connects to a JSON API server*][phase04].

[phase01]: /blog/json-api-phase-1-setup/
[phase02]: /blog/json-api-phase-2-api-design/
[phase04]: /blog/json-api-phase-4-ember/
