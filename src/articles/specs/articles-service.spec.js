const ArticleService = require('../articles-service.js');
// const ArticleRepository = require('../articles-repository');
const Article = require('../articles.js');
describe('Articles Service', () => {
    beforeEach(() => {
        this.article = new Article();
        this.spyRepo = jasmine.createSpyObj('articleRepository',['findById']);

        this.service = new ArticleService({articleRepository: this.spyRepo});
    });
    describe('findById method', () => {
        this.spyRepo.findById.and.returnValue(Promise.resolve(this.article));
        it('Should call with the correct id and return the correct article', () => {
            this.service.findById(this.article._id).then(art => {
                expect(art._id).toEqual(this.article._id);
            });
            expect(this.spyRepo.findById).toHaveBeenCalledWith(this.article._id);
        })
    })
})