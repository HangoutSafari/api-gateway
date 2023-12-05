import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const animalsProxy = createProxyMiddleware({
  target: 'http://msanimals:3010',
  changeOrigin: true,
});

router.use('/animals', cors(), animalsProxy);

export default router;
