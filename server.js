const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'interviews.json');
const ADMIN_PASSWORD = 'admin123';

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read data:', err);
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function renderPage(title, content) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<header>
  <h1>Prestij Mekan</h1>
  <nav><a href="/">Anasayfa</a> | <a href="/admin">Admin</a></nav>
</header>
<main>${content}</main>
<footer>
  <p>&copy; 2024 Prestij Mekan</p>
</footer>
</body>
</html>`;
}

function handleHome(req, res) {
  const interviews = loadData();
  let items = interviews.map(i => `<li><a href="/interview?id=${i.id}">${i.company}</a> - ${i.location}</li>`).join('\n');
  if (!items) items = '<li>Henüz röportaj eklenmedi.</li>';
  const content = `<h2>Mekanlar</h2><ul>${items}</ul>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(renderPage('Anasayfa', content));
}

function handleInterview(req, res, query) {
  const data = loadData();
  const item = data.find(i => String(i.id) === query.id);
  if (!item) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(renderPage('Bulunamadı', '<p>Röportaj bulunamadı.</p>'));
    return;
  }
  const content = `<h2>${item.company}</h2><p><strong>Lokasyon:</strong> ${item.location}</p><p>${item.description}</p><article>${item.interview}</article>`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(renderPage(item.company, content));
}

function isAuthenticated(req) {
  const cookie = req.headers['cookie'] || '';
  return cookie.includes('auth=1');
}

function handleAdmin(req, res) {
  if (!isAuthenticated(req)) {
    const form = `<form method="POST" action="/admin/login"><input type="password" name="pass" placeholder="Şifre"/><button type="submit">Giriş</button></form>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderPage('Admin Giriş', form));
    return;
  }
  const data = loadData();
  const list = data.map(i => `<li>${i.company} <a href="/admin/delete?id=${i.id}">Sil</a></li>`).join('\n');
  const form = `<h2>Röportaj Ekle</h2><form method="POST" action="/admin/add">
<label>Firma: <input name="company"/></label><br/>
<label>Lokasyon: <input name="location"/></label><br/>
<label>Açıklama: <input name="description"/></label><br/>
<label>Röportaj: <textarea name="interview"></textarea></label><br/>
<button type="submit">Kaydet</button></form>`;
  const content = `<h2>Röportajlar</h2><ul>${list}</ul>${form}`;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(renderPage('Admin Panel', content));
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => callback(qs.parse(body)) );
}

function handleLogin(req, res) {
  parseBody(req, body => {
    if (body.pass === ADMIN_PASSWORD) {
      res.writeHead(302, { 'Set-Cookie': 'auth=1', 'Location': '/admin' });
      res.end();
    } else {
      res.writeHead(401, { 'Content-Type': 'text/html' });
      res.end(renderPage('Hata', '<p>Şifre yanlış</p>'));
    }
  });
}

function handleAdd(req, res) {
  if (!isAuthenticated(req)) { res.writeHead(403); res.end('Forbidden'); return; }
  parseBody(req, body => {
    const data = loadData();
    const id = Date.now();
    const item = { id, company: body.company || 'Firma', location: body.location || '', description: body.description || '', interview: body.interview || '' };
    data.push(item);
    saveData(data);
    res.writeHead(302, { 'Location': '/admin' });
    res.end();
  });
}

function handleDelete(req, res, query) {
  if (!isAuthenticated(req)) { res.writeHead(403); res.end('Forbidden'); return; }
  let data = loadData();
  data = data.filter(i => String(i.id) !== query.id);
  saveData(data);
  res.writeHead(302, { 'Location': '/admin' });
  res.end();
}

function serveStatic(req, res, pathname) {
  const filePath = path.join(__dirname, 'public', pathname);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.html': 'text/html'
  };
  const contentType = types[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  if (pathname === '/') return handleHome(req, res);
  if (pathname === '/interview') return handleInterview(req, res, parsed.query);
  if (pathname === '/admin' && req.method === 'GET') return handleAdmin(req, res);
  if (pathname === '/admin/login' && req.method === 'POST') return handleLogin(req, res);
  if (pathname === '/admin/add' && req.method === 'POST') return handleAdd(req, res);
  if (pathname === '/admin/delete' && req.method === 'GET') return handleDelete(req, res, parsed.query);
  if (pathname.startsWith('/')) {
    return serveStatic(req, res, pathname.slice(1));
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
