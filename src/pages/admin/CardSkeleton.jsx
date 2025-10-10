export const CardSkeleton = () => {
  return (
    <div
      className="relative bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 overflow-hidden"
    >
      {/* Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer" />

      <div className="relative z-10 animate-pulse">
        {/* Header Icons */}
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="w-10 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Title / Subtitle */}
        <div className="mt-5 space-y-3">
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Stats / Footer */}
        <div className="mt-6 space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
