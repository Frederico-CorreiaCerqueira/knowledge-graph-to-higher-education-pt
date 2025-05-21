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
    institution_code: result.institutionCode.value,
    institution_name: result.institutionName.value,
    grade: result.grade.value,
    course_code: result.courseCode.value,
    course_name: result.courseName.value,
  }));
};

export const searchCourseRepo = async ({university, grade, scientificArea }) => {
  const criteria = {
    university: university,
    grade,
    scientificArea
  };

  const query = buildQuerySearchCourse(criteria);

  const response = await axios.get(graphDBEndpoint, {
    params: { query },
    headers: {
      'Accept': 'application/sparql-results+json',
    },
  });
  return response.data.results.bindings.map((result) => ({
    institution_Name: result.institutionName.value,
    course: result.courseName.value,
    grade: result.grade.value,
    scientific_Area: result.scientificArea.value,
    degree: result.degree.value
  }));
};





