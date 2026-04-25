'use client';
import { useState, useEffect } from 'react';
import { komiFetch, komiSearch } from './komiFetch.js';

export default function Page() {
  const [game, $game] = useState({ is: 'wait', time: 12, score: 0, offset: 0 });
  const [manga, $manga] = useState();
  const [search, $search] = useState('');

  useEffect(() => {
    setInterval(() => {
      $game((game) => {
        if (game.is !== 'on') return game;
        if (game.time === 0) {
          setTimeout(() => $game({ ...game, is: 'over' }), 5000);
          return { ...game, is: 'timeup' };
        }

        return { ...game, time: game.time - 1 };
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!manga) return;
    const img = app.querySelector(`#im${manga.id}`);
    const onload = () =>
      $game((game) => {
        return { ...game, is: 'on' };
      });

    if (img.complete) return onload();
    img.onload = onload;
  }, [manga, $game]);

  async function gameOn(offset) {
    const data = await komiFetch(offset || game.offset);
    if (!data) {
      return $game((game) => {
        gameOn(offset + 1);
        return { ...game, offset: offset + 1 };
      });
    }
    $manga(data);
    $search('');
    $game((game) => {
      return { ...game, is: 'wait', time: 12 };
    });
  }

  async function guess(title) {
    if (game.is !== 'on') return;

    $search(title);
    const data = await komiSearch(title);

    if (!data) return;
    if (data.id !== manga.id) return;

    $game((game) => {
      // fixes those weird manga jumps :3
      if (game.is === 'win' || game.is === 'over') return game;

      setTimeout(() => gameOn(game.offset + 1), 5000);

      return {
        ...game,
        is: 'win',
        score: game.score + 1,
        offset: game.offset + 1,
      };
    });
  }

  async function gameContinue() {
    await gameOn();
    $game((game) => {
      return { ...game, score: 0 };
    });
  }

  if (game.is == 'over')
    return (
      <div className='box gameOver'>
        <div className='boxImg'>
          <div className='score'>Score: {game.score}</div>
          <img src='/komi-pat.png' />
        </div>
        <div className='about'>
          <div className='big'>Uh- Oh- time ran out-</div>
          <div className='mid'>You tried your best but you can do better!</div>
          <a className='btn' onClick={() => gameContinue()}>
            Play again!
          </a>
        </div>
      </div>
    );

  if (manga)
    return (
      <div className='mangaWrap'>
        <img
          className='banner'
          src={
            game.is === 'win' || game.is === 'timeup' ? manga.image : manga.page
          }
        />
        <div className='manga'>
          <div className='time'>{game.time}s</div>
          <div className='score' key={game.score}>
            Score: {game.score}
          </div>
          <div className='pageWrap'>
            <img
              className='page'
              id={`im${manga.id}`}
              key={
                game.is === 'win' || game.is === 'timeup'
                  ? manga.image
                  : manga.page
              }
              src={
                game.is === 'win' || game.is === 'timeup'
                  ? manga.image
                  : manga.page
              }
            />
            <div className={`tag ${manga.tag}`}>
              <img src={`/${manga.tag}.svg`} />
              {manga.tag}
            </div>
            {game.is === 'win' || game.is === 'timeup' ? (
              <div className={game.is === 'win' ? 'check' : 'wrong'}>
                <img
                  key={game.is}
                  src={game.is === 'win' ? 'check.svg' : 'wrong.svg'}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className='about'>
            <div className='head'>
              {game.is === 'timeup'
                ? 'Uh- Oh- time ran out-'
                : 'Guess this manga page?'}
            </div>
            <div className='guessWrap'>
              <input
                className='guess'
                onChange={(e) => guess(e.target.value)}
                placeholder='Your guess'
                value={
                  game.is === 'win' || game.is === 'timeup'
                    ? manga.titles.en || manga.titles['ja-ro']
                    : search
                }
              />
              <img src={game.is === 'timeup' ? 'wrong.svg' : 'compare.svg'} />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className='box'>
      <img src='/komi-cant-communicate.png' />
      <div className='about'>
        <div className='big'>Guess that manga?</div>
        <div className='mid'>
          Komi-san will show you a page from a manga and you'll have to guess
          that manga's title in 12s
        </div>
        <a className='btn' onClick={() => gameOn()}>
          Game on!
        </a>
      </div>
    </div>
  );
}
