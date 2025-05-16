import { searchCourses } from '../repositories/courseRepository.js';

export const getCourses = async (criteria) => {
  return await searchCourses(criteria);
};
