import { searchUniversityRepo,searchCourseRepo } from '../repositories/courseRepository.js';

export const searchUniversityService = async ({ district, course, grade }) => {
  const filters = {};

  if (district && district.trim() !== '') {
    filters.district = district.trim();
  }

  if (course && course.trim() !== '') {
    filters.course = formatCourseName(course);
  } else {
    throw new Error('Course is required.');
  }

  if (grade !== undefined && grade !== null && grade !== '') {
    const parsedGrade = parseFloat(grade);
    if (isNaN(parsedGrade)) {
      throw new Error('Grade must be a valid number.');
    }
    filters.grade = parsedGrade;
  }

  return await searchUniversityRepo(filters);
};

export const searchCourseService = async ({university, grade }) => {
  const filters = {};

  if (university && university.trim() !== '') {
    filters.university = university.trim();
  }else {
    throw new Error('University is required.');
  }

  if (grade !== undefined && grade !== null && grade !== '') {
    const parsedGrade = parseFloat(grade);
    if (isNaN(parsedGrade)) {
      throw new Error('Grade must be a valid number.');
    }
    filters.grade = parsedGrade;
  }

  const results =  await searchCourseRepo(filters);

  return results
};

const formatCourseName = (name) => {
  return name.trim().replace(/\s+/g, '_');
};
