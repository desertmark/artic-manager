require('dotenv').config('../');
const PORT_NUMBER       = process.env.PORT || 3001;
const app               = require('express')();
const passport          = require('passport');
const configurePassport = require('./config/passport');
const awilixConfig      = require('./config/awilix');
const awilixExpress     = require('awilix-express');
const bodyParser        = require('body-parser');
const fileUpload        = require('express-fileupload');
const cors              = require('cors');
const getInfo           = require('./info/info');
const initMongoose      = require('./config/mongoose');
const config            = require('./config/config.js');

require('./data/seed-data')();

// PARSERS
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

//DB
initMongoose();

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
app.get('/info', (req, res) => getInfo.then(info => res.send(info)));

// DEFAULT ERROR HANDLER
app.use((err, req, res, next) => {
    if (config.env === 'production') {
        console.error('Unexpected error:', err, err.stack);
        res.status(500).send('Unexpected error');
    } else {
        next();
    }
});

//START
app.listen(PORT_NUMBER, () => getInfo.then(info => console.log(info)));


