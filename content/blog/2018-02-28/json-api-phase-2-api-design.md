---
title: "JSON API Phase 2: API Design"
date: 2018-02-28T00:00:00.000-05:00
image: json-api-phase-2-api-design.png
imageAlt: "A solid black background with a white outline of a lighbulb and text that reads: Swagger"
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
summary: The second entry of the JSON API tutorial series. In this phase we'll be designing our API and using Swagger
series: json-api
---

**UPDATED MAR 2020:** Updated indentation in YAML code.

---

## Designing your API with Swagger and JSON API

- [Phase 1: Setting up your projects][phase01]
- Phase 2: Designing your API with Swagger and JSON API (this post)
- [Phase 3: Developing an API with Express and Swagger][phase03]
- [Phase 4: Building an Ember App that connects to a JSON API server][phase04]

## Introduction

Welcome back! In [Phase 1][phase01] we went over the objectives for this project and setup two projects, one for the api server and another for the ember app. If you're just joining us, Please go through the steps in Phase 1 to get setup. In this phase, we're going to focus on the requirements and design of the API. To do this, we're going to utilize two specifications: [Swagger (OpenAPI)][swagger] and [JSON API][jsonapi].

While using Swagger, I've observed two general approaches. The first is to use Swagger only as a documentation tool. Developers take any design documents or requirements they're given, run with it, and immediately begin constructing their API. Some swagger specifications might be written during this process, but for the most part they are written or programmatically generated after-the-fact, and are only used to provide documentation via the [Swagger UI][swagger-ui].

I consider this first approach to be an anti-pattern; by tacking the documentation of the API to the end of the development process, it becomes very easy to forget about. After a few development cycles the specification has the tendency to become stale, outdated, and forgotten about. It is also possible for the build process to break or change. In which case, developers might not notice the specs are failing to be regenerated until an end-user sends in an issue.

The second approach, and the one I prefer, is to use the swagger specification document as a design tool first and then as documentation. By taking time to explicitly document and specify the API first, the swagger specs can drive your development. You'll have a clearer picture of what needs to be implemented; you won't have to worry about finding time later to update the documentation; and you'll have a nice UI to test your API during development.

Since Swagger is a language agnostic tool, if requirements change in the future, it's possible to take your swagger specs and generate boilerplate code for another language. This only works, however, if the specs are accurate and match the actual API implementation. Furthermore, by not automatically generating your swagger documentation, your API will less tied into your current tech stack.

## Swagger Editor

The swagger team provides an [editor][swagger-editor] which can either be used online or integrated into your project. The swagger CLI already provides this for us, so we'll use it to edit the Swagger YAML.

Go ahead and start that up:

~~~bash
swagger project edit
~~~

Your browser should open the editor:

![swagger editor][image01]

Change the title string to something like `Ember JSON-API Swagger Demo`. Then remove the `/hello` path and the `HelloWorldResponse` definition, as we'll be replacing both with our own schema.  In the end you'll start off with this:

~~~yaml
swagger: "2.0"
info:
  version: "0.0.1"
  title: Ember JSON-API Swagger Demo
host: localhost:10010
basePath: /
schemes:
  - http
  - https
consumes:
  - application/json
produces:
  - application/json
paths:
  /swagger:
    x-swagger-pipe: swagger_raw
definitions:
  ErrorResponse:
    required:
    - message
    properties:
      message:
        type: string
~~~

Note: The `/swagger` path above serves the swagger specs as JSON

In order to comply with the JSON API specification, we'll also need to add the use of the JSON API media type ([`application/vnd.api+json`](http://www.iana.org/assignments/media-types/application/vnd.api+json)) to `consumes` and `produces`.

~~~yaml
consumes:
  - application/json
  - application/vnd.api+json
produces:
  - application/json
  - application/vnd.api+json
~~~

## CRUD Routes

In order to integrate with our Ember app later, we'll be setting up the routes below and following the [URL conventions](https://guides.emberjs.com/v2.18.0/models/customizing-adapters/#toc_url-conventions) specified in the Ember JS guides


| HTTP Method | Operation | Routes           |
| ----------- | --------- | ---------------- |
| POST        | Create    | POST /users/     |
| GET         | Read      | GET /users/      |
| GET         | Read      | GET /users/id    |
| PATCH       | Update    | PATCH /users/id  |
| DELETE      | Delete    | DELETE /users/id |

Add to the Swagger YAML, the following paths and operations nested inside `paths`:

~~~yaml
paths:
  /users:
    get:
    post:
  /users/{id}:
    get:
    patch:
    delete:
~~~

## Connecting to a Users controller

When we go to implement our API, we'll be creating a Users controller to handle all the endpoint operations. The swagger middleware provides functionality to connect your route/path operations to the appropriate controller using a swagger schema extension: `x-swagger-router-controller`.  This extension may be nested within the path object or operation object.

Go ahead and add these to the path objects:

~~~yaml
paths:
  /users:
    x-swagger-router-controller: users-controller
    get:
    post:
  /users/{id}:
    x-swagger-router-controller: users-controller
    get:
    patch:
    delete:
~~~

When these route endpoints are hit, the swagger middleware will use the `operationId` attribute of the operation object to execute the appropriate method inside the specified controller (`users-controller`).

## Creating Users

The first operation object we'll be setting up is the `POST` for the `/users` path. This route will be responsible for creating new users and will hit the `createUser` method inside the Users Controller. We'll require that every request include a body parameter. This body parameter will conform to the `UserRequest` schema, which we'll define later. We'll also want to specify the responses that can be expected. In the example below, we cover the following situations: The user was successfully created (201); There was a bad request (400); and unexpected errors. These responses follow either a `UserResponse` or `ErrorResponse` schema, which we'll also define later.

~~~yaml
    post:
      operationId: createUser
      summary: Creates a new user
      description: Creates a new user
      parameters:
      - name: user
        in: body
        description: The user data.
        required: true
        schema:
          $ref: '#/definitions/UserRequest'
      responses:
        201:
          description: user succesfully created.
          schema:
            $ref: '#/definitions/UserResponse'
        400:
          description: bad request
          schema:
            $ref: '#/definitions/ErrorResponse'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/ErrorResponse'
~~~

## Reading Users

To request the entire collection of users, we'll define a `GET` operation on the  `/users` path. This operation will hit the `getUsers` method inside the Users Controller and requires no parameters. It will then respond with either a collection of users, or an unexpected error.

~~~yaml
    get:
      operationId: getUsers
      summary: Gets all users
      description: Returns a collection of all users
      responses:
        200:
          description: A collection of users
          schema:
            $ref: '#/definitions/UsersResponse'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/ErrorResponse'
~~~

## Read a User

We also need to provide a route to retrieve single records. This can be handled by a `GET` operation on the `/users/{id}` path which will hit the `getUser` method inside the Users Controller.  We'll require that an `id` parameter be included inside the path. The route will respond with 200, 404, or an unexpected error.

~~~yaml
    get:
      operationId: getUser
      summary: Gets a user
      description: Returns a single user by their identifier.
      parameters:
      - name: id
        in: path
        required: true
        description: The user's id
        type: string
      responses:
        '200':
          description: A Person
          schema:
            $ref: '#/definitions/UserResponse'
        '404':
          description: The user does not exist or was not found
          schema:
            $ref: '#/definitions/ErrorResponse'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/ErrorResponse'
~~~

## Update a User

The `PATCH` operation on the `/users/{id}` path is responsible for updating user records and will hit the `updateUserById` method in the Users Controller. This route requires both an `id` path parameter and a body paramter that conforms to the `UserRequest` schema. The possible responses include a user or error response.

~~~yaml
    patch:
      operationId: updateUserById
      summary: Updates a single user by id
      description: Returns the updated single user
      parameters:
      - name: id
        in: path
        required: true
        description: The user's id
        type: string
      - name: user
        in: body
        required: true
        description: the updated user attributes
        schema:
          $ref: '#/definitions/UserRequest'
      responses:
        200:
          description: user updated
          schema:
            $ref: '#/definitions/UserResponse'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/ErrorResponse'
~~~

## Delete a User

The `DELETE` operation on the `/users/{id}` path is responsible for deleting user records; will hit the `removeUserById` method of the Users Controller; and requires an `id` path parameter. It'll respond with either a 204 or an error.

~~~yaml
    delete:
      operationId: removeUserById
      parameters:
      - name: id
        in: path
        required: true
        description: The user's id
        type: string
      responses:
        204:
          description: accepted - user deleted
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/ErrorResponse'
~~~

## Swagger Definitions

Below we are going to setup 5 schema definitions:

- A `User` schema object to define our User model
- A `UserRequest`  which can be used as the schema for a body parameter in a request.
- A `UserResponse` which can be used as the schema for a response that returns a single User.
- A `UsersResponse` which can be used as the schema for a response that returns a collection of Users.
- An `ErrorResponse` which defines the structure of our default JSON API formatted error response.

~~~yaml
definitions:
  # MODELS
  User:
    type: object
    required:
    - type
    - attributes
    properties:
      type:
        type: string
      id:
        type: string
      attributes:
        type: object
        required:
        - username
        properties:
          username:
            type: string
          firstName:
            type: string
          lastName:
            type: string

  # REQUESTS
  UserRequest:
    type: object
    additionalProperties: false
    properties:
      data:
        $ref: '#/definitions/User'

  # RESPONSES
  UserResponse:
    type: object
    additionalProperties: false
    properties:
      data:
        $ref: '#/definitions/User'
  UsersResponse:
    type: object
    additionalProperties: false
    properties:
      data:
        type: array
        items:
          $ref: '#/definitions/User'
  ErrorResponse:
    type: object
    required:
    - errors
    properties:
      errors:
        type: array
        items:
          type: object
          properties:
            id:
              type: string
              description: A unique identifier for this occurence
            links:
              type: object
              description: A links object
              properties:
                about:
                  type: string
                  description: link that leads to details about this occurence
            status:
              type: string
              description: HTTP status code
            code:
              type: string
              description: Application Specific Error Code
            title:
              type: string
              description: Human-readable summary of the problem
            detail:
              type: string
              description: Human-readable explanation of the problem
            source:
              type: object
              description: Contains references to the source of the problem
            meta:
              type: object
              description: Non-standard meta-information about the issue/error

~~~

## Swagger Schema Extensions For Mongoose

In the next phase, we'll be integrating a forked version of [`swagger-mongoose`](https://www.npmjs.com/package/swagger-mongoose) into our project; this will allow us to extend our swagger schema slightly and use it to generate mongoose schemas and models.

We'll be using a fork as the main project is currently limited in that it does **not** support the JSON API specification. More specifically, I found that it only parsed the immediate children of a schema object's properties attribute and did not recurse into the `attributes` attribute. I've provided a fork of the project which extends the code to include the JSON API `attributes` when a schema is marked as a (json api) resource object. If you would like to review the changes, its hosted on Github:

[https://github.com/vburzynski/swagger-mongoose](https://github.com/vburzynski/swagger-mongoose)

The first addition we'll make to our Swagger schema is a global configuration attribute for the `swagger-mongoose` code. Here we've instructed `swagger-mongoose` to use camel cased keys and to include the timestamps `createdAt` and `updatedAt` in the mongoose schemas.

~~~yaml
x-swagger-mongoose:
  key-conversion: camelcase
  schema-options:
    timestamps: true
~~~

Several of the Swagger definition objects we setup earlier do not describe data models. We can add the following lines to these four request and response objects in order to instruct `swagger-mongoose` to exclude these definitions from being processed for mongoose schemas and models:

~~~yaml
x-swagger-mongoose:
  exclude-schema: true
~~~

Finally we add the following lines to the `User` definition to instruct `swagger-mongoose` to process this definition as a JSON API Resource Object

~~~yaml
x-swagger-mongoose:
  resource-object: true
~~~

The JSON API Styled Swagger Schema is now complete!

Stay tuned for [*Phase 3: Developing an API with Express and Swagger*][phase03]

Republished from [bendyworks.com/blog](bendyworks.com/blog) with permission.

[jsonapi]: http://jsonapi.org/
[swagger]: https://swagger.io/
[swagger-ui]: https://github.com/swagger-api/swagger-ui
[swagger-editor]: https://swagger.io/swagger-editor/
[image01]: /assets/images/blog/extra/2018-03-01-swagger-editor.png
[phase01]: /blog/json-api-phase-1-setup/
[phase03]: /blog/json-api-phase-3-api-server/
[phase04]: /blog/json-api-phase-4-ember/
