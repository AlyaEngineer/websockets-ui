import fs from 'fs';
import path from 'path';
import http, { IncomingMessage, ServerResponse } from 'http';

const PORT = 8181;

export const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const __dirname = path.resolve();
  const requestedPath = req.url === '/' ? '/front/index.html' : `/front${req.url}`;
  const filePath = path.join(__dirname, requestedPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found', details: err.message }));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

httpServer.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});
