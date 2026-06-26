'use server';
import axios from 'axios';

const baseUrl = 'https://api.mangadex.org';
const artUrl = 'https://uploads.mangadex.org/covers';

export async function komiFetch(offset) {
  const seed = 100;
  const { data: mangas } = await axios({
    method: 'GET',
    url: `${baseUrl}/manga`,
    params: {
      limit: 1,
      offset: ~~(Math.random() * (seed + offset)),
      includes: ['cover_art'],
      order: {
        followedCount: 'desc',
      },
      excludedTags: [
        'f5ba408b-0e7a-484d-8d49-4e9125ac96de',
        '891cf039-b895-47f0-9229-bef4c96eccd4',
      ],
    },
  });

  if (!mangas.data) return;
  const manga = mangas.data.pop();

  const art = manga.relationships.find(({ type }) => type === 'cover_art');
  const image = `${artUrl}/${manga.id}/${art.attributes.fileName}`;

  const { data: chps } = await axios({
    method: 'GET',
    url: `${baseUrl}/manga/${manga.id}/feed`,
    params: {
      translatedLanguage: ['en', 'gb', 'es', 'pl', 'zh', 'fr'], // gimme any at this point ;-;
    },
  });

  if (!chps.data) return;
  if (chps.data.length <= 45) manga.tag = 'hard';
  else if (chps.data.length <= 90) manga.tag = 'mid';
  else manga.tag = 'easy';

  const chp = chps.data[~~(Math.random() * chps.data.length)];
  if (!chp) return;

  const { data: pages } = await axios({
    method: 'GET',
    url: `${baseUrl}/at-home/server/${chp.id}`,
  });

  if (!pages.chapter.hash || !pages.chapter.dataSaver[7]) return; // happens smtimes idk why ask mangadex
  const page = `${pages.baseUrl}/data-saver/${pages.chapter.hash}/${pages.chapter.dataSaver[7]}`;

  return {
    id: manga.id,
    titles:
      manga.attributes.altTitles.find(({ en }) => en) || manga.attributes.title,
    image: image,
    page: page,
    tag: manga.tag, // we created this `.tag` :3
  };
}

export async function komiSearch(title) {
  const { data } = await axios({
    method: 'GET',
    url: `${baseUrl}/manga`,
    params: {
      title: title,
      limit: 1,
      order: {
        followedCount: 'desc',
      },
    },
  });

  if (!data.data) return;
  return data.data.pop();
}
