export const KPICard = ({ title, value, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
      {description && <p className="text-sm mt-2 text-gray-500">{description}</p>}
      <div className={`mt-4 w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    </div>
  );
};