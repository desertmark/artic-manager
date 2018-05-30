const articles = require('./sanita.json');
const Article = require('../articles/articles');

const actionIx = process.argv.findIndex(x => x === '-action');
if(actionIx === -1) {
    throw Error('No action parameter passed. Use -action to pass an action [deleteAll | insertAll | count]');
    process.exit(1);
} 
const action = process.argv[actionIx + 1];
console.log('executing action: ', action);
if(!action) {
    throw Error('No action value passed. Use -action to pass an action [deleteAll | insertAll | count]');
    process.exit(1);
}
switch(action) {
    case 'deleteAll':
        Article.deleteMany()
        .then(() => {
            console.log('All items Deleted');
            process.exit(0);
        }).catch(handleError);
        break;
    case 'insertAll': 
        Article.insertMany(articles)
        .then(insertedArticles => {
            console.log('All Items Inserted.', insertedArticles.length);
            process.exit(0);
        })
        .catch(handleError);
        break;
    case 'count':
        Article.count()
        .then(count => {
            console.log(`${count} items stored in the DB`);
            process.exit(0);
        })
        .catch(handleError);
        break;
    default:
        console.log('Unknown Action');
        process.exit(0);
}


function handleError(error) {
    console.log(error);
    process.exit(0);
}