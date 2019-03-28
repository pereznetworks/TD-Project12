# STEP 1: Started with React SSR Baseline

  - [React SSR Baseline](https://github.com/alexnm/react-ssr/tree/basic)
    - Task 1: Clone the repo
    - Task 2: placed my react components in place of /Components/Layout.js
      - import my react main component instead of layout
      - run it...
        - Oops, !@@$%!!!
        - reactDOM barfs on anything but jsx
        - remove css and assets...run it again...okay that's better
        - but no styling, ugh!!
    - Task 3: figure out how to add support for css and other assets

  [See Webpack's really great documentaton](https://webpack.js.org/concepts)

  [also thanks to another SSR Example][https://medium.com/@benlu/ssr-with-create-react-app-v2-1b8b520681d9]

       - c: using plugins
          - MiniCssExtractPlugin
            - css-loader, sass-loader, file-loader
            - setup a very basic scss import file
       - d: in src/server.js, add ...
            ```
                import "ignore-styles"

                require ('babel-register')({
                  ignore: /\/(build|node_modules)\//,
                  presets: ['env', 'react-app']
                });

                function htmlTemplate(reactDom){
                  return `<!DOCTYPE html>
                    ...                  
                       <link rel="stylesheet" href="./app.css">
                    ...
                  `
                }

            ```
    - Task 4: with the above steps, the main React UI component loads
      - a: yah!!!
      - b: dooh!
          - npm reports all kinds of nasty vulnerabilities
          - and deprecated packages
    - Task 5: React-Router
      - a: 2 options for getting React-Router to work in SSR
       - i: use loadable-components module, really cool stuff..

  [the Loadable-Components](https://github.com/smooth-code/loadable-components)
        - ii: or use Redux

  [SSR Example with Redux](https://medium.com/@benlu/ssr-with-create-react-app-v2-1b8b520681d9)

        - iii: I of course choose neither...
          - the way of pain !!!
          - okay, it is a simpler setup, but it works!  
           - see Step 2:

# Step 2: Upgrade to newest versions of all packages, webpack, babel, etc...

  - 1: First, Resolve vulnerabilities ...
    - a: use ncu -u and npm i to upgrade all packages and dependencies
    - b: switch to @babel/core, @babel/preset-env, @babel/preset-react, @babel/register
    - c: uninstall hooks
      - does not seem to work properly after these upgrade
    - d: great, now nothing works..
      - webpack.config.js barfs big time...
      - dooh!, !@#$%!!!!
  - 2: okay, port any code over to newer syntax
    - a: this was frustrating at first.... but solution was simple...

[Thanks again to Webpack's really great documentaton](https://webpack.js.org/concepts)

    - c: replace 'babel-register' with '@babel/register', where ever used
    - d: reduce .baberc to most extreme basic
      ```
          {
            "presets": [
              "@babel/preset-env",
              "@babel/preset-react"
            ]
          }
      ```

# STEP 3 : Combining my React SSR FE with my Backend Server

  - Task 1: wrap React SSR app in cluster abstraction : Throng
    - a: wrapped index.js in basic throng starter code
    - b: npm i --save throng  
    - c: run it to make sure it works

  - Task 2: integrate backend server
    - * this part looks easy now, but it took me hours of trial/error
      - ...whew!!
    - a: mkdir and copied to a backendServer folder
    - b: changes to integrate backendServer
      - i: remove root, '/', route path from backendServer/routes/index.js
      - ii: change package target to server.js
      - iii: change data\comfig.json to point ./backendServer/..
      - iv: remove index.js, and npm package.json, etc..
      - vi: merge backendServer/server.js with src/server.js code
      - vii: move require @babel/register into app.get("/") route handler
      - viii: use 'localhost:3000' in react axios call in src/Component/index.js  
    - c: npm run dev
      - i: use nodemon --inspect
      - ii cool ... front-end server starts and back-end starts
      - iii: front-end react ui renders
      - iv: data retrieved and ui components work

  - Task 3: Document and have a beer!!
    - 1: Preferably a stout beer