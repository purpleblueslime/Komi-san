import '../styles/all.scss';

export default function html({ children }) {
  return (
    <html>
      <head>
        <link rel='icon' type='image/png' href='/komi.png' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Jua&display=swap'
        />
        <title>Komi-san: Guess that manga</title>
      </head>
      <body id='app' style={{ minHeight: '100vh' }}>
        <div id='links'>
          <a href='https://github.com/purpleblueslime/Komi-san'>github</a>/
          <a href='https://discord.com/invite/uytxJWFqBR'>discord</a>
        </div>
        {children}
      </body>
    </html>
  );
}
