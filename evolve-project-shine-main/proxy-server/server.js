const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const target = url.searchParams.get('url');

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (!target || !target.startsWith('http')) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing or invalid url param' }));
    return;
  }

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 30000);
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: ac.signal,
    });
    clearTimeout(t);

    let html = await response.text();
    html = html.replace(/<base\s[^>]*\/?>/gi, '');
    html = html.replace(/<\/head>/i, `<base href="${target}">\n</head>`);
    html = html.replace(
      /<frame(?:set)?[^>]*>[\s\S]*?<\/frame(?:set)?>/gi,
      '<div style="padding:20px;text-align:center;color:#888;">Zawartość w ramkach nie jest dostępna przez proxy</div>'
    );

    const headers = {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'ALLOWALL',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    res.writeHead(response.status, headers);
    res.end(html);
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: `Proxy error: ${e.message}` }));
  }
});

server.listen(PORT, () => console.log(`EduNex Proxy running on port ${PORT}`));
module.exports = server;
