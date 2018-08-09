const PORT_NUMBER       = process.env.PORT || 3001 ;
const config            = require('./config/config.js');
const app               = require('express')();
const passport          = require('passport');
const configurePassport = require('./config/passport');
const awilixConfig      = require('./config/awilix');
const awilixExpress     = require('awilix-express');
const bodyParser        = require('body-parser');
const fileUpload        = require('express-fileupload');
const cors              = require('cors');
require('./data/seed-data')();

const info = {
    status: `App is running on port: ${PORT_NUMBER}`,
    env: config.env
}
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
// AWILIX
const container = awilixConfig.getContainer();
app.use(awilixConfig.scopeContainer(container));

//PASSPORT
configurePassport(passport, container);
app.use(passport.initialize());
app.use(passport.session());
// ROUTERS
app.use(awilixExpress.loadControllers('**/*-router.js'))
const articlesRouter = require('./articles');
app.use('/', articlesRouter); // Loading articles router separately because it uses router.param which is not expose by awilix's createController wrapper.
app.get('/info', (req, res) => res.send(info));

//START
app.listen(PORT_NUMBER, () => console.log(info));


