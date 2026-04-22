'use server';

import mongo from '../mongo/mongo.js';

export async function komiFetch() {
  const data = await mongo
    .collection('mangas')
    .aggregate([{ $sample: { size: 1 } }])
    .project({
      _id: 0,
      id: 1,
      tag: 1,
      image: 1,
      page: {
        $arrayElemAt: [
          '$pages',
          {
            $floor: {
              $multiply: [{ $rand: {} }, { $size: '$pages' }],
            },
          },
        ],
      },
    })
    .toArray();

  return data.pop();
}

export async function komiSearch(search) {
  const data = await mongo.collection('mangas').findOne(
    { $text: { $search: search } },
    {
      projection: {
        _id: 0,
        id: 1,
        title: {
          $arrayElemAt: ['$titles', 0],
        },
      },
    }
  );

  return data;
}
