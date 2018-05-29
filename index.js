const PORT_NUMBER       = 3000; 
const info              = `App is running on port: ${PORT_NUMBER}`;
const  app              = require('express')();
const  articlesRouter   = require('./articles');
const bodyParser        = require('body-parser');
app.use(bodyParser.json());

app.use('/articles', articlesRouter);

app.get('/info', (req, res) => res.send(info));
app.listen(PORT_NUMBER, () => console.log(info));


