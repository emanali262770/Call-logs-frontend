export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="w-10 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-4">
        <div className="w-16 h-6 bg-gray-200 rounded mb-2"></div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
