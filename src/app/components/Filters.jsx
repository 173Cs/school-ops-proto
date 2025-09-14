import React, { useState } from 'react';

export const Filters = ({ classes, terms, onFilterChange }) => {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('all');

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    onFilterChange({ class: e.target.value, term: selectedTerm });
  };

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
    onFilterChange({ class: selectedClass, term: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex space-x-4">
      <div>
        <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
        <select 
          id="class-filter" 
          value={selectedClass} 
          onChange={handleClassChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">All Classes</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="term-filter" className="block text-sm font-medium text-gray-700 mb-1">Term</label>
        <select 
          id="term-filter" 
          value={selectedTerm} 
          onChange={handleTermChange}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">All Terms</option>
          {terms.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
      </div>
    </div>
  );
};