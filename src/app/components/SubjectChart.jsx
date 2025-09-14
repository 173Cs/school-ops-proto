
const MOCK_ASSESSMENTS = [
    { studentId: '1', subject: 'Math', score: 92, term: 'Q1' },
    { studentId: '2', subject: 'Math', score: 75, term: 'Q1' },
    { studentId: '3', subject: 'Math', score: 60, term: 'Q1' },
    { studentId: '1', subject: 'Science', score: 88, term: 'Q1' },
    { studentId: '2', subject: 'Science', score: 80, term: 'Q1' },
    { studentId: '3', subject: 'Science', score: 70, term: 'Q1' },
    { studentId: '1', subject: 'English', score: 85, term: 'Q1' },
    { studentId: '2', subject: 'English', score: 78, term: 'Q1' },
    { studentId: '3', subject: 'English', score: 65, term: 'Q1' },
    { studentId: '1', subject: 'History', score: 90, term: 'Q1' },
    { studentId: '2', subject: 'History', score: 82, term: 'Q1' },
    { studentId: '3', subject: 'History', score: 72, term: 'Q1' },
];

export const AvgScoreBySubjectChart = ({ data }) => {
  // Calculate average scores by subject from the mock data
  const subjectScores = MOCK_ASSESSMENTS.reduce((acc, assessment) => {
    if (!acc[assessment.subject]) {
      acc[assessment.subject] = { total: 0, count: 0 };
    }
    acc[assessment.subject].total += assessment.score;
    acc[assessment.subject].count += 1;
    return acc;
  }, {});

  const subjects = Object.keys(subjectScores).map(subject => ({
    name: subject,
    score: Math.round(subjectScores[subject].total / subjectScores[subject].count)
  }));

  const maxScore = Math.max(...subjects.map(s => s.score));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Average Score by Subject</h3>
      <div className="h-64 flex items-end justify-between pt-10 px-4">
        {subjects.map((subject, index) => (
          <div key={index} className="flex flex-col items-center" style={{ width: `${100 / subjects.length}%` }}>
            <div 
              className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
              style={{ height: `${(subject.score / maxScore) * 80}%` }}
            ></div>
            <span className="text-xs mt-2 text-gray-800">{subject.name}</span>
            <span className="text-xs font-semibold text-gray-800">{subject.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};