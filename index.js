import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

const port = 3000;
const publicPath = path.join(process.cwd(), "./public");


const middleware = async (req, res) => {
  const filePath = (url.endsWith("/") ? [publicPath, url, "index.html"] : [publicPath, url]).join('');
  const statusCode = await fileExists(filePath) ? 200 : 404;
  console.log(`${req.method} ${req.url} ${statusCode}`);
};
const notFound = async (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/html'
});
res.end('<h1>404!</h1');
}

const mimeTypes = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

async function fileExists(pathString) {
  return await fs.promises.access(pathString).then(() => true, () => false)
}

function createHTTPServer(port, handler) {
  return new Promise((resolve, reject) => {
    let server = http.createServer(handler)
      .once('error', reject)
      .on('listening', () => resolve(server))
      .listen(port);
  });
}

await createHTTPServer(port, async ({ url, headers, method }, res) => {
  const filePath = (url.endsWith("/") ? [publicPath, url, "index.html"] : [publicPath, url]).join('');
  const statusCode = await fileExists(filePath) ? 200 : 404;
  const contentType =
    headers.accept?.includes('text/html')
      ? mimeTypes.html
      : mimeTypes[path.extname(filePath).substring(1).toLowerCase()] || mimeTypes.default;

  res.writeHead(statusCode, { "Content-Type": contentType });

  fs.createReadStream(statusCode === 200 ? filePath : notFound)
    .pipe(res);

  console.log(`
  Method: ${method}
  URL: ${url}
  Code: ${statusCode}
  Content-Type: ${contentType}
  `);
  
});

console.log(`Server running at http://localhost:${port}/`);