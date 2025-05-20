import React, { useState } from 'react';
import axios from 'axios';

const SearchPage = () => {
  const [courseForm, setCourseForm] = useState({ university: '', grade: '', scientificArea: ''});
  const [universityForm, setUniversityForm] = useState({ district: '', course: '', grade: '' });

  const [courseResults, setCourseResults] = useState([]);
  const [universityResults, setUniversityResults] = useState([]);
  const [error, setError] = useState('');

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
  };

  const handleUniversityChange = (e) => {
    setUniversityForm({ ...universityForm, [e.target.name]: e.target.value });
  };

  const searchCourses = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/courses/searchCourse', courseForm);
      setCourseResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching courses');
    }
  };

  const searchUniversities = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/courses/searchUniversity', universityForm);
      setUniversityResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching universities');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center">University & Course Search</h1>

      {/* Search Courses Form */}
      <form onSubmit={searchCourses} className="bg-gray-50 p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">🔎 Search Courses</h2>
        <input
          type="text"
          name="university"
          value={courseForm.university}
          onChange={handleCourseChange}
          placeholder="University"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="grade"
          value={courseForm.grade}
          onChange={handleCourseChange}
          placeholder="Minimum Grade"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="scientificArea"
          value={courseForm.scientificArea}
          onChange={handleCourseChange}
          placeholder="Scientific Area"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search Courses
        </button>
      </form>

      {/* Course Results */}
      {courseResults.length > 0 && (
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-bold mb-2">📘 Course Results</h3>
          <ul className="space-y-2">
            {courseResults.map((course, idx) => (
              <li key={idx} className="border-b pb-2">
                {Object.entries(course).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <strong>{key}:</strong> {value}<br />
                  </React.Fragment>
                ))}   
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search Universities Form */}
      <form onSubmit={searchUniversities} className="bg-gray-50 p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">🏫 Search Universities</h2>
        <input
          type="text"
          name="district"
          value={universityForm.district}
          onChange={handleUniversityChange}
          placeholder="District"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="course"
          value={universityForm.course}
          onChange={handleUniversityChange}
          placeholder="Course Name (e.g., Engenharia Informática)"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="grade"
          value={universityForm.grade}
          onChange={handleUniversityChange}
          placeholder="Minimum Grade"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Search Universities
        </button>
      </form>

      {/* University Results */}
      {universityResults.length > 0 && (
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-bold mb-2">🎓 University Results</h3>
          <ul className="space-y-2">
            {universityResults.map((uni, idx) => (
              <li key={idx} className="border-b pb-2">
                {Object.entries(uni).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <strong>{key}:</strong> {value}<br />
                  </React.Fragment>
                ))}                
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded border border-red-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
