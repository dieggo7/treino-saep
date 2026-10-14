const serverless = require('serverless-http');
const app = require('../../back/app');

// Normaliza o caminho para que as rotas /api/* do Express funcionem
// tanto via redirect (/api/...) quanto pela URL direta da função.
const handler = serverless((req, res) => {
    req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '');
    if (!req.url.startsWith('/api')) req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
    return app(req, res);
});

module.exports.handler = handler;
