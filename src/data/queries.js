// matchea articles.categoryId === category._id y embebe el category object en la propiedad category.

// $lookup hace el matching y crea un array categories.
// Como solo hay 1 category para cada article, $replaceRoot mergea el documnto resultado con un documento {category: categories[0]}
// $project filtra las propiedades categoryId y categories ya que el unico elemento de categories ahora esta bajo la propiedad category con su respectivo id y descripcion
//  por lo que el array y el id no son necesarios
db.articles.aggregate([
    {
        $lookup: {
            from: "categories",
            localField: 'categoryId',
            foreignField: '_id',
            as: "categories"
        }
    }
,{
    $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT",{category: {$arrayElemAt: ["$categories", 0]}}] } }
},
{
    $project: { categories:0, categoryId:0 }
},
{
    $limit: 1
}])
