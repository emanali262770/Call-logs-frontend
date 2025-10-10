// ChartSkeleton.jsx
import React from "react";

export const PerformanceSummarySkeleton = () => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer" />

      <div className="relative z-10">
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-40 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Three circular chart placeholders */}
        <div className="flex justify-center gap-10 md:gap-16 lg:gap-20 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <div className="relative">
                {/* Outer ring */}
                <div className="w-32 h-32 md:w-36 md:h-36 bg-gray-200 rounded-full"></div>
                {/* Inner small shimmer center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-5 bg-gray-300 rounded"></div>
                </div>
              </div>
              {/* Label */}
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WeeklyCallVolumeSkeleton = () => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer" />

      <div className="relative z-10">
        {/* Title Row */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-44 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Chart area */}
        <div className="h-64 relative mt-2 flex flex-col justify-end border-l border-b border-gray-200 px-3 pb-2">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full border-t border-gray-100"
              ></div>
            ))}
          </div>

          {/* Bars */}
          <div className="relative flex items-end justify-between h-full">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 bg-gray-200 rounded-t"
                  style={{
                    height: [
                      20, // Sun
                      10, // Mon
                      10, // Tue
                      40, // Wed
                      70, // Thu
                      25, // Fri
                      10, // Sat
                    ][i],
                  }}
                ></div>
                <div className="w-6 h-3 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MonthlyCallTrendsSkeleton = () => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-48 h-5 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Calls text */}
        <div className="w-28 h-7 bg-gray-200 rounded mb-4"></div>

        {/* Bar Chart Placeholder */}
        <div className="h-64 relative flex items-end justify-between border-l border-b border-gray-200 px-3 pb-2">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full border-t border-gray-100"></div>
            ))}
          </div>

          {/* Bars for Jan–Dec */}
          {[
            "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
          ].map((month, i) => (
            <div key={month} className="flex flex-col items-center gap-1">
              <div
                className="w-3 md:w-4 bg-gray-200 rounded-t"
                style={{
                  height: [
                    15, 10, 10, 8, 10, 10, 15, 15, 60, 70, 10, 10,
                  ][i],
                }}
              ></div>
              <div className="w-4 h-2 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FollowUpMeetingsSkeleton = () => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-48 h-5 bg-gray-200 rounded"></div>
          <div className="w-24 h-5 bg-gray-200 rounded-md"></div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
          {/* Weekday header placeholders */}
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-full h-4 bg-gray-200 rounded mx-auto my-1"
            ></div>
          ))}

          {/* Date placeholders (roughly 31 days) */}
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              className={`p-2 rounded-full ${
                i % 5 === 0
                  ? "bg-gray-300"
                  : "bg-gray-100"
              }`}
            ></div>
          ))}
        </div>

        {/* Bottom summary row */}
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};