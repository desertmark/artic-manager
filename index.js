const PORT_NUMBER       = 3000; 
const info              = `App is running on port: ${PORT_NUMBER}`;
const app               = require('express')();
const passport          = require('passport');
const configurePassport = require('./config/passport');
const awilixConfig   = require('./config/awilix');
const bodyParser        = require('body-parser');
require('./data/seed-data')();
app.use(bodyParser.json());

// AWILIX
const container = awilixConfig.getContainer();
app.use(awilixConfig.scopeContainer(container));

//PASSPORT
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
// ROUTERS
const articlesRouter    = require('./articles');
const categoriesRouter  = require('./categories');
const authRouter        = require('./auth');
const userRouter        = require('./users')(container);
app.use('/categories', categoriesRouter);
app.use('/articles', articlesRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/info', (req, res) => res.send(info));
app.listen(PORT_NUMBER, () => console.log(info));


