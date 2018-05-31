const PORT_NUMBER       = 3000; 
const info              = `App is running on port: ${PORT_NUMBER}`;
const app               = require('express')();
const bodyParser        = require('body-parser');
const articlesRouter    = require('./articles');
const categoriesRouter  = require('./categories');
app.use(bodyParser.json());

app.use('/categories', categoriesRouter);
app.use('/articles', articlesRouter);

app.get('/info', (req, res) => res.send(info));
app.listen(PORT_NUMBER, () => console.log(info));


