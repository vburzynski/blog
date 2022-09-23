---
title: Optimizing Your CI and WebPack Builds
date: 2016-12-06T00:00:00.000-05:00
image: optimizing-ci-and-webpack.jpg
imageAlt: Person on a bicycle riding down a busy street
category: Development
tags:
- JavaScript
- Webpack
- Node
- NPM
summary:  We show how to optimize your ci and webpack builds with a few plugins and adjusting your configuration.
---

Recently, I was running into issues where the builds for a Node project were becoming painfully slow. Local development builds would take well over a minute or more. The CI builds on Jenkins would take at least eight and a half minutes, but would usually take longer. It was neccessary to find ways to optimize the scripts that triggered the builds and the webpack configuration.

## NPM

On Jenkins, the `npm install` process ended up being half the issue. Now, when a build is triggered on a new server, or with a fresh clone of the repository, its expected that its going to take some time to download and install all your dependencies. However, in this case the script triggering the build was blowing away the installed packages on every build with `rm -rf node_modules/`.

### Avoid A Full Install For Every CI Build

We elected to get rid of this in favor of running [`npm prune`](https://docs.npmjs.com/cli/prune), which will remove any extraneous packages from your `node_modules` directory. A subsequent call of `npm install` will then only install new dependencies. Speaking of pruning, you should also check the package dependencies listed in your `package.json` file.  Weed out any packages that are no longer in use. There's no sense in allowing them to lie around wasting space or taking up time and bandwidth when you run a fresh install.

## Webpack

Moving on to the webpack configuration, the project I'm referencing here was sufficiently complex enough to contain roughly 14 entry points. The time spent just on the UglifyJS optimization alone was over 60 seconds.

Faced with a similar situation, you might follow a simple configuration example and end up with something that looks similar to the example below. It will work; it might even be fast at first. However, as the project grows, it will begin to slow you down.

~~~ javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
      one: 'one.js',
      two: 'two.js',
      three: [ 'a.js', 'b.js' ]
    ],
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js'
    },
    module: {
      loaders: [{
          test: /\.jsx?/,
          loader: 'babel-loader'
        }
      ]
    }
  };
}
~~~

### Exclude the `node_modules` Directory

The first thing you can do is exclude this directory. By doing so, webpack won't try to parse and recurse through all the code included in your npm packages when building your app.

~~~ javascript
loaders: [
  {
    test: /\.jsx?/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }
]
~~~

### Make use of the `CommonsChunkPlugin`

When a project has numerous entry points, it's quite likely that modules and dependencies are reused throughout the code. That's where the [`CommonsChunkPlugin`](https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin) is going to be invaluable. With the default configuration, the plugin will automatically package any dependencies that are shared amongst all of your bundles.

With a small modification, it's also possible to package common modules as well. By specifying the minimun number of chunks through `minChunks`, say a minimum of 3 for example, any module that is required by 3 or more of your bundles will be included into `common.js`.

~~~ javascript
plugins: [
  new CommonsChunkPlugin({
    name: "commons",
    filename: "commons.js",
    minChunks: 3,
  })
]
~~~

All that you have to do from there is include `commons.js` alongside the bundles.

~~~ html
<script src="js/commons.js" charset="utf-8"></script>
<script src="js/entryPoint1.bundle.js" charset="utf-8"></script>
~~~

This can save a significant portion of time, especially if you're optmizing your bundles with UglifyJS. By reducing the size of the entry point's bundled file, the amount of code that has to be optimized is also reduced. Furthermore, the common code is optimized just once, instead of multiple times (once for every bundle it was previously included with).

Before the CommonsChunkPlugin:

~~~shell
62469ms optimize chunk assets
~~~

After configuring the CommonsChunkPlugin:

~~~shell
18968ms optimize chunk assets
~~~

**Note:** The times above were obtained using: `$ webpack -p --progress --profile`

### Build a Dynamically Linked Library (DLL)

If you have code that rarely changes, third party vendor code for example, and the `CommonsChunkPlugin` doesn't sufficiently speed things up, you can split the work for this out into a separate build. You build the DLL once, and then develop your app without having to worry about spending time rebuilding all of the static code in the process.

To accomplish this, you'll need to need to create another webpack config file to build the DLL, which will utilize the [`DLLPlugin`](https://webpack.github.io/docs/list-of-plugins.html#dllplugin) to build the bundle.

Here's an example:

~~~ javascript
var path = require("path");
var webpack = require("webpack");

var BUILD_DIR = path.resolve(__dirname, './dist');
var APP_DIR = path.resolve(__dirname, './assets/js');

module.exports = {
    entry: path.join(APP_DIR, "vendors.js"),
    output: {
        path: BUILD_DIR,
        filename: "vendors.js",
        library: "vendors"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(BUILD_DIR, "vendors-manifest.json"),
            name: "vendors",
            context: APP_DIR
        })
    ],
    module: {
      loaders: [{
          test: /\.jsx?/,
          include: APP_DIR,
          exclude: /node_modules/,
          loader: 'babel'
        }
      ]
    }
};
~~~

Then in your main webpack configuraiton for your app, you'll include the `DLLReferencePlugin` to pull in the pre-built library.

~~~ javascript
new webpack.DllReferencePlugin({
  context: path.resolve(__dirname, './assets/js'),
  manifest: require("./dist/vendor-manifest.json")
})
~~~

For more information, see the [DLL Documentation](https://webpack.github.io/docs/build-performance.html#dynamic-linked-library).

### Happypack

You can speed things up even more by using the [happypack](https://github.com/amireh/happypack) package. Builds are sped up by transforming files in parallel.

To configure, first add happypack to your plugins array and pass it the loader(s) you'd like to run in parallel.

~~~ javascript
new HappyPack({
  loaders: [ 'babel' ],
}),
~~~

Then use the happypack loader in place of the loader in the module loaders configuration:

~~~ javascript
module: {
  loaders: [{
    test: /\.jsx?/,
    include: APP_DIR,
    exclude: /node_modules/,
    loader: 'happypack/loader'
  }
}
~~~

Thats it; your `js` and `jsx` files will be transformed in parallel.

### Profile Your Builds

If you're still running into issues, webpack provides a very useful profiling tool through their [analyze](http://webpack.github.io/analyse/) web app. To generate the necessary data file use the `--json` flag and provide a filename to pipe the data into:

~~~shell
webpack --profile --json > stats.json
~~~

The tool will show warnings and errors for diagnosing your build issues as well as provide suggestions and hints on how to optimize your code. Another neat feature is that it generates a force-directed graph of all your modules and breaks down the stats for all the code in the build.
