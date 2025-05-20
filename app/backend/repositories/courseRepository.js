import axios from 'axios';
import { graphDBEndpoint } from '../config.js';
import { buildQuerySearchUniversity,buildQuerySearchCourse } from '../queries/getQueries.js';

export const searchUniversityRepo = async ({ district, course, grade }) => {
  const criteria = {
    course: course,
    location: district,
    grade,
  };

  const query = buildQuerySearchUniversity(criteria);

  const response = await axios.get(graphDBEndpoint, {
    params: { query },
    headers: {
      'Accept': 'application/sparql-results+json',
    },
  });
  return response.data.results.bindings.map((result) => ({
    code: result.code.value,
    name: result.name.value,
    grade: result.grade.value,
  }));
};

export const searchCourseRepo = async ({university, grade }) => {
  const criteria = {
    university: university,
    grade,
  };

  const query = buildQuerySearchCourse(criteria);

  const response = await axios.get(graphDBEndpoint, {
    params: { query },
    headers: {
      'Accept': 'application/sparql-results+json',
    },
  });
  return response.data.results.bindings.map((result) => ({
    course: result.courseName.value,
    grade: result.grade.value
  }));
};





