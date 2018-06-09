const PORT_NUMBER       = 3000; 
const info              = `App is running on port: ${PORT_NUMBER}`;
const app               = require('express')();
const passport          = require('passport');
const configurePassport = require('./config/passport');
const bodyParser        = require('body-parser');
const articlesRouter    = require('./articles');
const categoriesRouter  = require('./categories');
const authRouter        = require('./auth');
const userRouter        = require('./users');
require('./data/seed-data')();

app.use(bodyParser.json());
//PASSPORT
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
// ROUTERS
app.use('/categories', categoriesRouter);
app.use('/articles', articlesRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/info', (req, res) => res.send(info));
app.listen(PORT_NUMBER, () => console.log(info));


