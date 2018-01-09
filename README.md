<h1>
    <img height=50 src="https://github.com/CalderWhite/medium-analytics/raw/master/extension/dist/app/favicon.ico" >
    Medium Analytics
</h1>
<h4>
    <i>Hourly checking on your Medium stats with insightful graphs, for free.</i>
</h4>
Get the chrome extension:     
Support the Medium Article:     

# Built With
<a href="https://reactjs.org/">
    <img height=80 width=67 title="React" src="https://raw.githubusercontent.com/rexxars/react-hexagon/HEAD/logo/react-hexagon.png" >
</a>
<a href="https://jquery.com/">
    <img height=80 title="Jquery" src="http://www.phpcodify.com/wp-content/uploads/2017/10/jQuery-Disable-Button%E2%80%8A-%E2%80%8ADisabling-and-Enabling-Buttons-with-jQuery.png" >
</a>
<a href="https://getbootstrap.com/">
    <img height=80 title="Bootstrap" src="https://v4-alpha.getbootstrap.com/assets/brand/bootstrap-solid.svg" >
</a>
<a href="https://firebase.google.com">
    <img height=80 title="Firebase" src="https://firebase.google.com/downloads/brand-guidelines/SVG/logo-logomark.svg" >
</a>
<a href="https://nodejs.org">
    <img height=80 title="Node.js" src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" >
</a>
<a href="https://babeljs.io">
    <img height=80 title="Babel" src="https://github.com/babel/logo/raw/master/babel.png" >
</a>
<a href="http://sass-lang.com">
    <img height=80 title="Sass" src="http://sass-lang.com/assets/img/styleguide/seal-black-reversed-b19dd117.png" >
</a>
<a href="https://webpack.js.org">
    <img height=80 title="Webpack" src="https://github.com/webpack/media/raw/master/logo/icon.png" >
</a>

## Hosting Your Own

**NOTE:** If you don't wish to host your own, the chrome extension works out of the box with Medium Analytics Servers.    
In the event that you may want to run your own private version of Medium Analytics the process is very simple!
1. Clone the repository with: `git clone https://github.com/CalderWhite/medium-analytics.git`.
2. For the proceeding steps you'll need your own Google account.     
    This way you can create a firebase project.
    So if you don't, create a Google account.
3. 
    Create a [firebase](https://firebase.google.com) project.
4.
    Go to <img height=30 src="https://image.flaticon.com/icons/svg/0/128.svg"> > Service Accounts
    and click "Generate New Private Key".
5.
    Rename the downloaded json file to `medium-analytics-firebase.json`.
6. 
    Move this file into './server', relative to the cloned repository's root.
7.
    To start the server, cd into the `server` and first install the dependancies with `npm install`.    
    Then, run `npm start`.
8.
    Finally, you must configure the extension to use your host instead of the Medium Analytics firebase.    
    open `./extension/src/js/app/scripts.js`. 
    Replace `config` with the config generated from Authentication > WEB SETUP.
    Replace `SERVER_BASE`'s value with the host of your server (for example, `127.0.0.1:8080`)
9.
    Install the packages with `npm install` (coming from `./extension`).
    Then run `npm run build`. 
    Your new, custom extension is in `./extension/dist` and can be actived by going to [the chrome extension page](chrome://extensions)
    Enable developer mode and click "Load unpacked extension." Then navigate to `./extension/dist`.
