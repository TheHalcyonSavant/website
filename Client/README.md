The Halcyon Savant official website - client codes
-----------------------------------------------------
###Pre-installation
1. Download and install [NODE.JS](http://nodejs.org/download/);
2. Download and install [Git for Windows](http://git-scm.com/download/win);
3. Download and install with global access [Ruby](http://rubyinstaller.org/);
4. Install compass `gem install compass`;
5. Make sure you've installed bower, grunt and protractor as global packages via NPM:
```bash
npm i -g bower
npm i -g grunt-cli
npm i -g protractor
```

###Installation
Open Git Bash, navigate to Client directory and run:
```bash
npm install
bower update
```

###Run
Before you run `grunt serve` make sure the Server ASP.NET app is already started in the background under IIS Express, or is published in the ../Deploy directory under IIS. Also, make sure `_serviceLink` variable from [dataservice.js](app/scripts/services/dataservice.js#L6) points to the running WebAPI. For example, if you've started Server under http://localhost:61385, then `_serviceLink` must be `http://localhost:61385/breeze/Main`.

`grunt serve` = real-time debug and preview on localhost:9000  
`grunt test` = unit test  
`grunt protractor` = e2e test  
`grunt build` = build only  
`grunt` = complete test and build

Build operations output the minified files in ../Deploy directory.
