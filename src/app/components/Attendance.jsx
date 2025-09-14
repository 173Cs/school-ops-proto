
export const AttendanceTrendChart = ({ data, timeframe = 'daily' }) => {
  // Generate sample attendance data for the chart
  const attendanceData = timeframe === 'daily' 
    ? [85, 88, 92, 90, 87, 95, 93] // Daily attendance percentages
    : [87, 89, 91, 93, 90, 92]; // Weekly attendance percentages

  const maxValue = Math.max(...attendanceData);
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Attendance Trend ({timeframe === 'daily' ? 'Daily' : 'Weekly'})
      </h3>
      <div className="h-64 flex items-end justify-between pt-10 px-4">
        {attendanceData.map((value, index) => (
          <div key={index} className="flex flex-col items-center" style={{ width: `${100 / attendanceData.length}%` }}>
            <div 
              className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(value / maxValue) * 80}%` }}
            ></div>
            <span className="text-xs mt-2 text-gray-800">
              {timeframe === 'daily' ? `Day ${index + 1}` : `Week ${index + 1}`}
            </span>
            <span className="text-xs font-semibold text-gray-800">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};