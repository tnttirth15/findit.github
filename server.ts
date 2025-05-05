// server.ts or server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
const entryServer = require('./dist/entry-server');  // Adjust if your dist path is different
const render = entryServer?.render || (() => '');

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('*', (req, res) => {
  const appHtml = render();

  const html = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');

  res.send(html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`));
});

app.listen(5000, () => {
  console.log('SSR server is running at http://localhost:5000');
});
