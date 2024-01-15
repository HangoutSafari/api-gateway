import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const eventsProxy = createProxyMiddleware({
    target: 'http://msevents:3011',
    changeOrigin: true,
});

const usersProxy = createProxyMiddleware({
    target: 'http://msusers:3012',
    changeOrigin: true,
});

const animalsProxy = createProxyMiddleware({
    target: 'http://msanimals:3013',
    changeOrigin: true,
});

const modelsProxy = createProxyMiddleware({
    target: 'http://msmodels:3014',
    changeOrigin: true,
});

router.use('/events', eventsProxy);
router.use('/animals', animalsProxy);
router.use('/users', usersProxy);
router.use('/models', modelsProxy);

export default router;
