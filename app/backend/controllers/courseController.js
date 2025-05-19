import {  searchUniversityService, searchCourseService } from '../services/courseService.js';

export const searchUniversity = async (req, res) => {
  try {
    const { district, course, grade } = req.body;

    const filters = { district, course, grade };
    const results = await searchUniversityService(filters);

    res.json(results);
  } catch (error) {
    console.error('Error searching for universities:', error.message);
    res.status(500).json({ error: 'Failed to search for universities.' });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const {university, grade } = req.body;

    const filters = { university, grade };
    const results = await searchCourseService(filters);

    res.json(results);
  } catch (error) {
    console.error('Error searching for courses:', error.message);
    res.status(500).json({ error: 'Failed to search for courses.' });
  }
};
