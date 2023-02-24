---
title: How to Get Your Capybara System Tests Running in a Docker Dev Container on Apple Silicon
date: 2023-02-23T21:48:22-06:00
category: Development
created: 2023-02-12T20:16:07-06:00
updated: 2023-02-23T21:48:22-06:00
tags:
 - dev/dev-container
 - dev/docker
 - dev/chromium
 - dev/selenium
 - dev/capybara
 - dev/rspec
 - dev/rails
summary: A tale that relays my experiences getting Capybara system tests to run successfully in a dev-container on an Apple silicon based computer.
---

## The Journey Begins

At the end of last year my main work machine was upgraded to a MacBook Pro with an M1 Max processor. I quickly got to work setting up my usual dev environment, then cloned the git project I'm working on, built the dev container, and set myself to work. At first, everything went smoothly. The issue I ran into, however, was that our RSpec/Capybara/Selenium System Tests wouldn't run on my machine. I also discovered that my coworkers who were also running on Apple silicon machines, had run into similar issues and had conceded to allowing system tests to run on the CI server. A survey of the usual internet sources revealed that others had run into the issue as well. From the brief scan, it seemed many things had been attempted, but nothing stood out as the answer. Dissatisfied, and with some time off for the holidays, I set out to find a solution.

## The Initiation

Getting the initial dev container and rails project configured was pretty straight-forward. Before I get into that, however, you might be wondering what dev container even is. A dev container employs a [Docker Container](https://www.docker.com/) as a development environment. With one you can [mount Visual Studio Code (vscode) to a container for development](https://code.visualstudio.com/docs/devcontainers/containers) through the configuration of a [devcontainer.json](https://code.visualstudio.com/docs/devcontainers/containers#_create-a-devcontainerjson-file) file. Visual Studio Code isn't the only application for dev containers, but it is the one I'll cover here.

Getting the initial container configured was rather easy as templates exist for many common development environments. For my purposes, I started with the Rails template:

1. Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
1. Ensure you also have [Visual Studio Code](https://code.visualstudio.com/) installed and running
1. In a terminal, generate a new folder for your project:
1. Create a project directory: `mkdir rails-dev-container`
1. Navigate into the directory: `cd rails-dev-container`
1. Open the folder in Visual Studio Code: `code .`
1. [Install the Dev Containers Extension](vscode:extension/ms-vscode-remote.remote-containers)
1. Open the Command Palette: COMMAND + SHIFT + P
1. Execute `Dev Containers: Add Dev Container Configuration Files`
1. Select `Show all Definitions...`
1. Search for "Rails"
1. Select `Ruby on Rails & Postgres`
1. Select `3.1-bullseye`
1. Select `Ok`
1. Wait for the Dev Container to start
1. Open `.devcontainer/devcontainer`
1. Enable the `"forwardPorts"` option by uncommenting the property
1. Rebuild the dev container: `Dev Containers: Rebuild and Re-Open in Container`

From there I was up and running and ready to generate a new Rails project. With Visual Studio Code still connected to the dev container, I opened a new terminal (inside of vscode) and generated a new rails app:

```shell
rails new . -T -d postgresql
```

...and I customized the database configuration:

```yaml
# File: ./config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: db
  username: postgres
  password: postgres

development:
  <<: *default
  database: rails_dev_container_development

test:
  <<: *default
  database: rails_dev_container_test

production:
  <<: *default
  database: rails_dev_container_production
  username: rails_dev_container
  password: <%= ENV["RAILS_DEV_CONTAINER_DATABASE_PASSWORD"] %>
```

```diff
--- a/config/database.yml
+++ b/config/database.yml
@@ -20,6 +20,9 @@ default: &default
   # For details on connection pooling, see Rails configuration guide
   # https://guides.rubyonrails.org/configuring.html#database-pooling
   pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
+  host: db
+  username: postgres
+  password: postgres

 development:
   <<: *default
```

From there I could confirm the server works:

```bash
# this will run a setup script that will also generate a schema.rb
./bin/setup
# this will launch the rails server at localhost:3000
./bin/rails server
```

I then set out to setup a simple test to validate I could get a system test to run. So I added `rspec-rails` to the test group of the `Gemfile`:

```ruby
# file: ./Gemfile
# ...
group :test do
  # ...
  gem "rspec-rails"
end
#...
```

Ran `bundle install` and  `rspec:install`

```shell
# If you haven't already, CTRL+C to stop the rails server
bundle install
bundle exec rails generate rspec:install
```

Added the `capybara` and `selenium-sebdriver` gems to the test group in the `Gemfile`

```ruby
# File: ./Gemfile
group :test do
  gem "capybara"
  gem "rspec-rails"
  gem "selenium-webdriver"
end
```

Ran bundle install again

```shell
bundle install
```

Added Capybara to the top of my `spec_helper.rb`:

```ruby
# File: ./spec/spec_helper.rb
require 'capybara/rspec'
```

Added Capybara and Selenium WebDriver to my `rails_helper.rb`:

```ruby
# File: ./spec/rails_helper.rb
# ...
# Add additional requires below this line. Rails is not loaded until this point!

require 'capybara/rails'
require 'selenium/webdriver'

# ...
```

I later realized I needed a simple View and Controller to test (more on that later). so I set one of those up as well:

```ruby
# File ./app/controllers/application_controller.b
class ApplicationController < ActionController::Base
  def index; end
end
```

```html
<!-- File: ./app/views/application/index.html.erb -->
<div>TESTING</div>
```

```ruby
# File ./config/routes.rb
Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root 'application#index'
end
```

I then created a trivial system test:

```ruby
# file: spec/system/sample_spec.rb
require "rails_helper"

RSpec.describe "Rails Boilerplate", :type => :system do
  it "displays the rails version" do
    visit root_path
    expect(page).to have_text("TESTING")
  end
end
```

I was ready to run the tests...

## The Road of Trials

This is the point where I and many others got tripped up. The Capybara system tests will fail to execute. 

```bash
bundle exec rspec
```

If you run RSpec, you'll get errors similar to those below:

```bash
Failures:

  1) Rails Boilerplate displays the rails version
     Got 0 failures and 2 other errors:

     1.1) Failure/Error: visit root_path
          
          Selenium::WebDriver::Error::WebDriverError:
            unable to connect to /home/vscode/.cache/selenium/chromedriver/linux64/110.0.5481.77/chromedriver 127.0.0.1:9515

     1.2) Failure/Error: raise Error::WebDriverError, cannot_connect_error_text
          
          Selenium::WebDriver::Error::WebDriverError:
            unable to connect to /home/vscode/.cache/selenium/chromedriver/linux64/110.0.5481.77/chromedriver 127.0.0.1:9515
```

To save you from navigating the rabbit hole yourself, I'll give a brief synopsis of my trials and tribulations. I made some initial attempts to get `chromedriver` working (something I've successfully done many times on an Intel based Mac), but continued to be stymied by `chromedriver` issues.

Eventually I can to understand that the core of my issues here begins with the unavailability of a Chrome stable build for Linux on ARM64 processors/architecture. If you attempt to install `google-chrome-stable` it will not execute. You might then think to install `chromium`. This approach works great on an X86 or AMD64 processors. Being on an M1 Max, however, I ran into issues with `chromedriver` and X Windows. I tried some hasty attempts at using `xvfb` (X Virtual Framebuffer), but I'll admit I didn't quite know what I was doing. X Windows is something I've regrettably not dug into extensively enough. 

I turned to the internet and dug into several resources demonstrating various means of installing `chromedriver` and `chromium` inside of a docker container as well as many resources that touched on setting up RSpec, Capybara, Selenium WebDriver, and Chromium. I even caved in to the idea of allowing the dev container to run on Dockers emulation layer and emulate an `amd64` processor using `--platform=linux/amd64` in my `Dockerfile`. I was avoiding this because I was sure I could get something to work without it. Even as I caved in, I was still taunted by an error:

```text
unknown error: Chrome failed to start: crashed.
```

I may have eventually been able to get this approach working or using the environment variable below. My journey, however, took me down another path.

```bash
export DOCKER_DEFAULT_PLATFORM=linux/amd64  
```

By this point, over the course of a few days, I'd fallen down so many rabbit holes and taken many twists and turns. I was beginning to lose track of my attempts and had no sense of whether any of the variations were getting me closer to the objective. I was ready to resign myself to the possibility that I'd have to surrender and abandon the journey.

## The Ascension

I stayed my forfeiture, however, to further investigate the networking configuration options for the dev container, `docker-compose`, `dockerfile`, and capybara... as well as the selenium driver configuration. I figured the examination would at least help me gain a fuller understanding of each component. 

My sight turned to the docker images that Selenium has published to run various browsers with Selenium Grid. I wondered if there might be a pre-configured image for ARM based machines, and to my delight another denizen of the internet has indeed built some ARM64 versions under the moniker of `seleniarm`. With minimal tinkering of my `docker-compose` file, I launched the container and connected to it through the `noVNC` setup it provides. I could get Chromium launched manually through the VNC and could visit external websites, but not my development server at `localhost:3000`. There were additional networking issues to resolve.

While subsequently tinkering with the dev container and docker ports, configuration, and networking... I came to another realization. I was also seeming to have trouble getting the system test to connect to the default Rails WelcomeController. This is when I actually built the simple Controller and View I shared earlier.  With this and some additional digging to discover how to configure Capybara to connect via a remote driver, I eventually landed on what I will now present to you...

## The Return

First I had to modify my Docker Compose:

```diff
 # file .devcontainer/docker-compose.yml
 services:
   app:
+    tty: true
     build:
       context: ..
       dockerfile: .devcontainer/Dockerfile
-
     volumes:
       - ../..:/workspaces:cached

     # Overrides default command so things don't shut down after the process ends.
     command: sleep infinity
-
-    # Runs app on the same network as the database container, allows "forwardPorts" in devcontainer.json function.
-    network_mode: service:db
-
-    # Use "forwardPorts" in **devcontainer.json** to forward an app port locally.
-    # (Adding the "ports" property to this file will not forward from a Codespace.)
+    depends_on:
+      - db
+      - chrome
+    ports:
+      - 3010:3010

   db:
     image: postgres:latest
@@ -28,21 +27,15 @@ services:
       POSTGRES_USER: postgres
       POSTGRES_DB: postgres
       POSTGRES_PASSWORD: postgres
-      # Your config/database.yml should use the user and password you set here,
-      # and host "db" (as that's the name of this service). You can use whatever
-      # database name you want. Use `bin/rails db:prepare` to create the database.
-      #
-      # Example:
-      #
-      #  development:
-      #    <<: *default
-      #    host: db
-      #    username: postgres
-      #    password: postgres
-      #    database: myapp_development
-
-    # Add "forwardPorts": ["5432"] to **devcontainer.json** to forward PostgreSQL locally.
-    # (Adding the "ports" property to this file will not forward from a Codespace.)
+    ports:
+      - 5432:5432
+
+  chrome:
+    image: seleniarm/standalone-chromium
+    ports:
+      - 4444:4444
+      - 7900:7900
+      - 5900:5900

 volumes:
   postgres-data:
```

Next I adjusted my Capybara Configuration:

```ruby
# Add this to your rails_helper.rb or import it as a support file

# I had trouble using `app` as the hostname, so I grabbed the IP address
Capybara.app_host = "http://#{IPSocket.getaddress(Socket.gethostname)}:3010"

# Set the host and port
Capybara.server_host = '0.0.0.0'
Capybara.server_port = '3010'

# Add a configuration to connect to Chrome remotely through Selenium Grid
Capybara.register_driver :remote_selenium do |app|
  # Pass our arguments to run headless
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument("--headless")
  options.add_argument("--no-sandbox")
  options.add_argument("--disable-dev-shm-usage")
  options.add_argument("--window-size=1400,1400")

  # and point capybara at our chromium docker container
  Capybara::Selenium::Driver.new(
    app,
    browser: :remote,
    url: "http://chrome:4444/wd/hub",
    options: options,
  )
end

# set the capybara driver configs
Capybara.javascript_driver = :remote_selenium
Capybara.default_driver = :remote_selenium

# This will force capybara to inclue the port in requests
Capybara.always_include_port = true

# This configures the system tests
RSpec.configure do |config|
  config.before(:each, type: :system) do
    driven_by :remote_selenium
  end
end
```

I was then ready to rebuild my dev container:

1. Open The Command Palette: Command + Shift + P
2. Run: `Dev Containers: Rebuild Container`

And, with bated breath, I ran my RSpec suite:

```shell
bundle install
bundle exec rspec
```

My test ran! It worked! I had my proof of concept.

```bash
vscode ➜ /workspaces/rails-dev-container (main) $ bundle exec rspec
.

Finished in 1.46 seconds (files took 1.64 seconds to load)
1 example, 0 failures
```

After the holidays and upon my returned to work, I set to the work of integrating the solution into my current project.  We were already using Chromium in our dev container, so I found a way to conditionally install it when the Docker container is built. It was ultimately unnecessary for our environment, but I'll share it in case others might find it useful:

```Dockerfile
# Install Chromium only on non apple silicon
RUN SYSTEM_ARCH=$(arch | sed s/aarch64/arm64/) && \
  if [ $SYSTEM_ARCH != 'arm64' ]; then \
     apt-get update && export DEBIAN_FRONTEND=noninteractive && \
     apt-get -y install --no-install-recommends chromium \
  ; fi
```

The solution I landed on was to conditionally swap between between `selenium/standalone-chrome` and `seleniarm/standalone-chromium` using environment variables. This would allow my coworkers with intel based computers to also use a selenium grid docker container. After some testing the solution was merged to the main development branch, and the rest, as they say, is history.
