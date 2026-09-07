import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 5173;
const PHOTOS_DIR = join(__dirname, 'photos');
if (!existsSync(PHOTOS_DIR)) mkdirSync(PHOTOS_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  let url = req.url.split('?')[0];

  // Photo upload
  if (req.method === 'POST' && url === '/api/photo') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const b64 = body.toString('utf8').trim();
      const match = b64.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
      if (!match) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid image data' }));
        return;
      }
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const filename = 'photo-' + Date.now() + '.' + ext;
      const imgBuffer = Buffer.from(match[2], 'base64');
      writeFileSync(join(PHOTOS_DIR, filename), imgBuffer);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ url: '/photos/' + filename }));
    });
    return;
  }

  if (url === '/') url = '/index.html';

  const filePath = join(__dirname, url);

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
