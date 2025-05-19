import express from 'express';
import { searchUniversity,searchCourse } from '../controllers/courseController.js';

const router = express.Router();

router.get('/searchUniversity', searchUniversity);
router.get('/searchCourse', searchCourse);

export default router;
