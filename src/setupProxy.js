const { createProxyMiddleware } = require('http-proxy-middleware');

const apiBaseURL = "http://m.pasturecoachnz.co.nz";
const summariesBaseURL = "http://pasturecoachnz.co.nz/api/";

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: apiBaseURL,
            changeOrigin: true,
        })
    );
    app.use(
        '/summary',
        createProxyMiddleware({
            target: summariesBaseURL,
            changeOrigin: true,
        })
    );
};