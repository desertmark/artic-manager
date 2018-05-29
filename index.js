const PORT_NUMBER   = 3000; 
const info          = `App is running on port: ${PORT_NUMBER}`;
var app             = require('express')();
var articlesRouter  = require('./articles');

app.use('/articles', articlesRouter);

app.get('/info', (req, res) => res.send(info));
app.listen(PORT_NUMBER, () => console.log(info));


