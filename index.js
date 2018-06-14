const PORT_NUMBER       = 3000; 
const info              = `App is running on port: ${PORT_NUMBER}`;
const app               = require('express')();
const passport          = require('passport');
const configurePassport = require('./config/passport');
const awilixConfig      = require('./config/awilix');
const awilixExpress     = require('awilix-express');
const bodyParser        = require('body-parser');
const articlesRouter    = require('./articles');

require('./data/seed-data')();
app.use(bodyParser.json());

// AWILIX
const container = awilixConfig.getContainer();
app.use(awilixConfig.scopeContainer(container));

//PASSPORT
configurePassport(passport, container);
app.use(passport.initialize());
app.use(passport.session());
// ROUTERS
app.use(awilixExpress.loadControllers('**/*-router.js'))
app.use('/', articlesRouter); // Loading articles router separately because it uses router.param which is not expose by awilix's createController wrapper.

app.get('/info', (req, res) => res.send(info));
app.listen(PORT_NUMBER, () => console.log(info));


