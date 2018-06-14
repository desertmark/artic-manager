const awilixExpress = require('awilix-express');
const CategoriesController = require('./categories-controller');
const ctrBuilder = awilixExpress.createController(CategoriesController)
.prefix('/categories')
.get('/','get')
.get('/:id','getById')
.post('/','post')
.delete('/:id','delete')

module.exports = ctrBuilder;