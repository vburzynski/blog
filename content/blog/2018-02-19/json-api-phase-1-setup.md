---
title: "JSON API Phase 1: Setup"
date: 2018-02-19T00:00:00.000-05:00
image: json-api-phase-1-setup.jpg
imageAlt: A woman sitting at a computer with a cup of coffee sitting nearby
author: valerie_burzynski
layout: article
category: Development
photo: jpg
tags:
- JavaScript
- Node
- JSON API
- Swagger
- Ember
- Express
summary: The first entry of the JSON API tutorial series. In this phase we'll be setting up our api and client projects.
series: json-api
---

**UPDATED MAR 2020:** Updated versions of assumed software and the nvm install command, and moved some Swagger setup steps forward from part 3 to allow swagger to work with the referenced version of Node.

---

## Setting up your projects

Welcome! Today you begin an adventure and you shall embark on a journey that will bring you fame and glory. You shall build an API server and a client app that shall wield its power! Are you excited?

🦗🦗🦗

Alright then, lets assume that silence is because you are speechless and waiting in anticipation.
Lets go!

## Introduction

For the API, we'll be defining our schema with the [Swagger (OpenAPI) specification][swagger], conforming to the [JSON API specification][jsonapi], and implementing it all with an [express](https://expressjs.com/) server. Once that is all in place, we'll create an [Ember][ember] app and utilize its `JSONAPIAdapter` to effortlessly integrate with the API. Furthermore, *Ember Data* uses the `JSONAPIAdapter` by default.

**NOTE:** For this tutorial series, we will be utilizing Swagger 2.0 specification. The OpenAPI 3.0 specification was released last year (2017), but there are currently only a limited number of implementation resources. You will find a wealth of knowledge and implementations which use the 2.0 spec. Nonetheless,  I definitely encourage you to read up on version 3.0.

Your journey will be split across the following four phases:

- Phase 1: Setting up your projects (this post)
- [Phase 2: Designing your API with Swagger and JSON API][phase02]
- [Phase 3: Developing an API with Express and Swagger][phase03]
- [Phase 4: Building an Ember App that connects to a JSON API server][phase04]

### Assumptions

This tutorial assumes that you have the following setup within your dev environment:

- [Node LTS Carbon][node] *(v13.5.0 at the time of writing)*
- [NPM][npm] *(v6.13.7 at the time of writing)*
- [Homebrew](https://brew.sh)
- [Yarn](https://yarnpkg.com/en/docs/install)

For Node, I highly recommend using a node version manager. Two popular ones are [n][n] and [nvm][nvm]. If you'd like to install `nvm` use the command below:

~~~shell
curl --output - https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
~~~

— [See nvm on Github for more information](https://github.com/nvm-sh/nvm)

On the other hand, if you wish to forgo using a version manager, just install the latest LTS Carbon version of [Node][node].

## Project Setup

To setup both projects, we'll be employing two CLIs: [Ember CLI](https://ember-cli.com/) and [Swagger](https://github.com/swagger-api/swagger-node)

To start off, create a project directory:

~~~shell
mkdir ember-jsonapi-demo && cd "$_"
~~~

Then install the [ember][ember] cli:

~~~shell
npm install --global ember-cli
# or, equivalently
npm install -g ember-cli
~~~

And also install the swagger cli ([swagger-node][swagger-node]):

~~~shell
npm install -gq swagger
~~~

## Ember Project

Use the Ember CLI to generate and configure the web client project:

~~~shell
ember new client
cd client
ember serve
~~~

In a moment, your ember client app should be up and running.  Feel free to follow Ember's [quick start][ember-start] if you'd like to learn more. Otherwise, if you load the web page now, it should look like this:

![Initial Ember Homepage][image01]

## API Server

Next we'll be using the swagger CLI tool to configure the API server project.  The swagger CLI adds  [`express-swagger-mw`][express-swagger-mw] to your project. This package contains an express middleware wrapper around [`swagger-node-runner`][swagger-node-runner]. [`swagger-node-runner`][swagger-node-runner] is a swagger server implementation that uses [`bagpipes`][bagpipes] and [`sway`][sway]. If your project has more complicated requirements, you'll want to dig into the documentation for these projects. For our use case, these swagger internals will just work out of the box.

If you haven't yet, use `CTRL+C` to stop the ember server, and enter the following commands:

~~~shell
cd ..
swagger project create api
~~~

The CLI should immediately prompt you to select a framework.
For this demo, select [express][express]:

~~~shell
? Framework?
  connect
❯ express
  hapi
  restify
  sails
~~~

Then `cd` into the directory:

~~~shell
cd api
~~~

We'll be using `yarn` to install other dependencies in Part 3, but in the meantime to get swagger running under our version of Node we need to perform some advance setup.

~~~shell
yarn install
~~~

Upgrade swagger-express-mw to the latest version:

~~~shell
yarn upgrade swagger-express-mw --latest
~~~

Add the `swagger_params_parser` pipe to `swagger_controllers` inside `config/default.yaml`:

~~~yaml
    swagger_controllers:
      - onError: json_error_handler
      - cors
      - swagger_params_parser
      - swagger_security
      - _swagger_validate
      - express_compatibility
      - _router
~~~

Now we can run the server

~~~shell
swagger project start
~~~

Then, in another terminal window, use the command below to test with `curl`:

~~~shell
$ curl http://127.0.0.1:10010/hello?name=Scott
{ "message": "Hello, Scott!" }
~~~

Congratulations! You've completed the project setup.

Stay tuned for [*Phase 2: Designing your API with Swagger and JSON API*][phase02]

Republished from [bendyworks.com/blog](bendyworks.com/blog) with permission.

[nvm]: https://github.com/creationix/nvm
[n]: https://github.com/tj/n
[jsonapi]: http://jsonapi.org/
[swagger]: https://swagger.io/
[ember]: https://www.emberjs.com/
[ember-start]: https://guides.emberjs.com/v2.18.0/getting-started/quick-start/
[swagger-node]: https://github.com/swagger-api/swagger-node
[node]: https://nodejs.org/en/blog/release/v8.9.4/
[npm]: https://www.npmjs.com/
[express]: https://expressjs.com
[express-swagger-mw]: https://www.npmjs.com/package/swagger-express-mw
[swagger-node-runner]: https://www.npmjs.com/package/swagger-node-runner
[bagpipes]: https://www.npmjs.com/package/bagpipes
[sway]: https://www.npmjs.com/package/sway
[image01]: /assets/images/blog/extra/2018-03-01-ember-boilerplate.png
[phase02]: /blog/json-api-phase-2-api-design/
[phase03]: /blog/json-api-phase-3-api-server/
[phase04]: /blog/json-api-phase-4-ember/
