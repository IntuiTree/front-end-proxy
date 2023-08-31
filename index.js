const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');  // Require the cors package

const app = express();
const PORT = 59000; // You can change this if needed

app.use(cors({ 
    origin: 'http://localhost:3000',  // Note the http:// prefix
    credentials: true 
}));

app.use('/', createProxyMiddleware({
    target: 'https://intuitree.io:8000',
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
        // Set the header before the proxy request is made
        proxyReq.setHeader('x-requested-from', 'CLIENT_DEV');
    },
    onProxyRes: (proxyRes) => {
        // Remove the strict-origin-when-cross-origin Referrer-Policy which can block referrer from being sent.
        proxyRes.headers['referrer-policy'] = 'no-referrer-when-downgrade';
        
        // Remove the access-control-allow-origin header from the original server
        delete proxyRes.headers['access-control-allow-origin'];
    }
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});