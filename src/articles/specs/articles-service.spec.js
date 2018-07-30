const ArticleService = require('../articles-service.js');
// const ArticleRepository = require('../articles-repository');
const Article = require('../articles.js');
describe('Articles Service', () => {
    beforeEach(() => {
        console.log('before each');
        article = new Article();
        spyRepo = jasmine.createSpyObj('articleRepository',['findById']);
        service = new ArticleService({articleRepository: spyRepo});
        
        spyRepo.findById.and.returnValue(Promise.resolve(article));
    });
    describe('findById method', () => {
        
        
        it('Should call with the correct id and return the correct article', () => {
            service.findById(article._id).then(art => {
                expect(art._id).toEqual(article._id);
            });
            expect(spyRepo.findById).toHaveBeenCalledWith(article._id);
        })
    })
})