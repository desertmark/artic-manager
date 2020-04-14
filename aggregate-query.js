db.articles.aggregate(
    [	
    { $match: { description: { $regex: /.*Abraz.*/ } } },	
        {	
            $lookup: {	
                from: 'categories',	
                localField: 'category',	
                foreignField: '_id',	
                as: 'category'	
            }	
        },	
        { $unwind: '$category' },	
    { $match: { description: { $regex: /.*Carbiz.*/ } } }	
    ]
).pretty()

db.articles.aggregate(
    [	
        { $match: { description: { $regex: /.*MEDIO.*/ } } },	
        {	
            $lookup: {	
                from: 'categories',	
                localField: 'category',	
                foreignField: '_id',	
                as: 'category'	
            }	
        },	
        { $unwind: '$category' },	
        { $match: { "category.description": { $regex: /.*Litoral.*/ } } },
        { $skip: 5 },
        { $limit: 5 },
    ]
).pretty()

db.articles.aggregate(
    [	
        {
            $facet: {
                total: [{ $count: "value" }],
                rows: [
                    { $project: { description: 1 } },
                    { $limit: 5 }
                ],
            }
        },

    ]
).pretty()

{ $unwind: '$rows' },
{ $unwind: '$total' },
{
    $replaceRoot: {
        newRoot: {
            rows: "$rows", total: "$total.value"
        }
    }
}