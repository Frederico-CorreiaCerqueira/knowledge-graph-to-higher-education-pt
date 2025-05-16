import express from 'express';
import { search } from '../controllers/courseController.js';

const router = express.Router();

router.get('/search', search);

export default router;
