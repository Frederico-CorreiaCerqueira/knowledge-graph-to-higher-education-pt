import express from 'express';
import { searchUniversity,searchCourse } from '../controllers/courseController.js';

const router = express.Router();

router.post('/searchUniversity', searchUniversity);
router.post('/searchCourse', searchCourse);

export default router;
