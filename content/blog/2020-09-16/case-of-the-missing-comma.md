---
title: Case of the Missing Comma
date: 2020-09-16T00:00:00.000-05:00
image: case-of-the-missing-comma.jpg
imageAlt: "A typewriter with paper loaded that reads: Investigation"
author: valerie_burzynski
layout: article
category: Development
photo: jpg
tags:
  - javascript
summary: We decode a mystery involving comma operators, property accessors, and a single missing character.
series: what-the-javascript
---

*What The Javascript?*

Consider for a moment, the problematic code sample below that unexpectedly evaluates to `undefined`:

Exhibit A

~~~javascript
// for educational purposes only; the following line is a bug
_.get(state ['key1', 'key2'], {});
~~~

It's using `lodash` or `underscore` as a utility library. The intent is likely to retrieve a nested value from the `state` object, or return an empty object when that attribute does not exist. You might notice that a comma is missing after the `state` argument. Adding the comma back in will restore the intended behavior. Yet why is this code syntatically valid and why does it evaluate to `undefined`?

Deconstructing the original code snippet, we see that the `get` method is receiving two arguments: an odd expression and an empty object. We'll look at the expression first along with an illustrative example of what `state` would look like:

Exhibit B

~~~javascript
var state = { key1: { key2: 'target' }};
var result = state ['key1', 'key2'];
~~~

The variable `result` would be assigned a value of `undefined`. This isn't that helpful, so, lets break it down further. We have a variable which represents an object. This is followed by a space and expression containing two strings, delimited by a comma and surrounded by square brackets. You could postulate that this expression in Exhibit B constructs an array. In which case we can write the following example:

Exhibit C

~~~javascript
var expression = ['key1', 'key2'];
var state = { key1: { key2: 'target' }};
var result = state expression;
~~~

However, this code does result in a syntax error; the `expression` identifier is unexpected. As such, we can conclude that the bracketed expression in exhibit B is indeed not an array. The brackets and the comma are not working in conjunction to form an array literal. Perhaps, instead, the space is extraneous and ignored by the interpreter. If this is the case we can rewrite Exhibit B in the following manner:

Exhibit D

~~~javascript
var state = { key1: { key2: 'target' }};
var result = state['key1', 'key2'];
~~~

The variable `result` here will assigned the value of `undefined` and we now have an equivalent sample of code. So, what might our comma and square brackets be doing here?

In JavaScript, commas delimit key-value pairs in object literals; they delimit arguments in method calls; they delimit parameters in function definitions; they also delimit values in an Array literals. Square brackets often construct arrays, but they are also used for bracket notation to access properties of an object. With this knowledge its not that large a leap to suspect thar our odd expression might access multiple or nested properties on the state object. Except we can rule out nested properties as the `result` in examples B and D contains a value of `undefined` despite the object containing those nested keys. What happens when the state object contains keys which are not nested?

Exhibit E

~~~javascript
var state = { key1: 'a', key2: 'b' };
var result = state ['key1', 'key2'];
~~~

When this example is evaluated, `result` will contain the string value `b`. Why is the `key1` being ignored here? To answer this, we need to delve into what's actually happening. When using dot or bracket notation, only a single property identifier is accepted (Reference: [MDN - Property Accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)). So this is selecting neither multiple nor nested properties. We find, rather, that only the value assigned to `key2` is retrieved. The comma is not being used to delimit a list of keys or property identifiers, but it is instead an operator. The [comma operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator) here is delimiting expressions:

~~~javascript
expression1, expression2, ... expressionN
~~~

Each expression will be evaluated in turn, and the value of the last expression, `expressionN`, will be returned. So we can extract the following expression:

Exhibit D

~~~javascript
'key1', 'key2'
~~~

This code will evaluate to the value of `key2`. We have two expressions, each of which is a string literal, separated by a comma operator. The comma operator is instructing the JavaScript interpreter to evaluate two expressions and return the result of the final item. The first expression defines a string literal containing the value `key1`. No other side effects are performed, so the result here is ignored.  The second and final expression defines a string literal of the value `key2` and it is returned as the resulting value.

We can therefore return to the original problematic code and rewrite it in a way that illustrates only the functional pieces:

~~~javascript
_.get(state['key2'], {});
~~~

The expression is passing the value of `state.key2` in as the first argument for the `get()` helper.  Said helper returns `undefined` by default.

In conlusion, we can fix the bug by adding the missing comma:

~~~javascript
_.get(state, ['key1', 'key2'], {});
~~~

Republished from [bendyworks.com/blog](bendyworks.com/blog) with permission.
