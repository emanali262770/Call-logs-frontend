import React, { useState, useCallback, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiPlus,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [calendar, setCalendar] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // 'day', 'week', or 'month'
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Meeting with Client",
      date: new Date(2021, 11, 2),
      startTime: "10:00",
      endTime: "11:00",
      description: "Discuss project requirements",
      participants: "John Doe, Jane Smith",
    },
    {
      id: 2,
      title: "Product Demo",
      date: new Date(2021, 11, 3),
      startTime: "14:00",
      endTime: "15:00",
      description: "Demo new features to team",
      participants: "Development Team",
    },
    {
      id: 3,
      title: "Customer Review",
      date: new Date(2021, 11, 21),
      startTime: "09:30",
      endTime: "10:30",
      description: "Monthly customer review meeting",
      participants: "Customer ABC",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    participants: "",
  });


  // ✅ Fetch Meetings by Month
  const fetchCustomerData = useCallback(async () => {
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const monthParam = `${year}-${month}`;

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/meetings/calendar?month=${monthParam}`
      );

      const result = await response.json();

      if (result.success) {
        setCalendar(result.data || []);
        console.log("📅 Calendar Data:", result.data);
      } else {
        toast.error("Failed to load calendar data");
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      toast.error("Error fetching calendar data");
    }
  }, [currentDate]);


  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setNewEvent({ ...newEvent, date: newDate });
  };

  const handlePrev = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNext = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };




  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.participants.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventsForDate = (date) => {
    return filteredEvents.filter((event) => isSameDay(event.date, date));
  };

  const renderMiniCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const miniDays = [];
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || dayCount > daysInMonth) {
          miniDays.push(<div key={`empty-${i}-${j}`} className="h-8"></div>);
        } else {
          const isSelected = isSameDay(
            selectedDate,
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              dayCount
            )
          );
          const isToday = isSameDay(
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              dayCount
            ),
            new Date()
          );
          const hasEvents =
            getEventsForDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                dayCount
              )
            ).length > 0;

          miniDays.push(
            <div
              key={`day-${dayCount}`}
              className={`h-8 flex items-center justify-center cursor-pointer rounded-full transition-all relative ${isSelected
                ? "bg-newPrimary text-white"
                : isToday
                  ? "bg-blue-100 text-newPrimary font-medium"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => handleDateClick(dayCount)}
            >
              {dayCount}
              {hasEvents && (
                <div className="absolute bottom-1 w-1 h-1 bg-newPrimary rounded-full"></div>
              )}
            </div>
          );
          dayCount++;
        }
      }
    }
    return miniDays;
  };

  const renderMainCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // ✅ Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendarDays = [];

    // Empty boxes before the 1st
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-3" />);
    }

    // ✅ Loop through all days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toLocaleDateString("en-CA");


      // ✅ Filter meetings matching this date
      const meetingsForDay = calendar.filter(meeting =>
        meeting.dates.some(d => d.startsWith(dateStr))
      );
      //  console.log("meetingsForDay", meetingsForDay);

      calendarDays.push(
        <div
          key={day}
          onClick={() => setSelectedDate(new Date(year, month, day))}
          className={`border rounded-lg p-2 min-h-[80px] cursor-pointer hover:bg-blue-50 transition-all ${selectedDate.getDate() === day ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
        >
          <div className="text-sm font-semibold text-gray-800">{day}</div>

          {/* ✅ Display person & time */}
          <div className="mt-1 space-y-1">
            {meetingsForDay.map((m, idx) => {
              // Find the index of this date
              const matchedIndexes = m.dates
                .map((d, i) => (d.startsWith(dateStr) ? i : -1))
                .filter(i => i !== -1);

              // Extract only the times for those matched dates
              const timesForThisDate = matchedIndexes.map(i => m.times[i]);

              return (
                <div
                  key={idx}
                  className="text-xs text-gray-700 bg-green-300 p-1 rounded-md truncate"
                  title={`${m.person} - ${timesForThisDate.join(", ")}`}
                >
                  <strong>{m.companyName}</strong>
                  <div className="text-[10px] text-gray-600">
                    {timesForThisDate.join(", ")}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-2">{calendarDays}</div>;
  };


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col">
      {showEventForm && (
        <EventForm
          newEvent={newEvent}
          onClose={() => setShowEventForm(false)}
          onInputChange={handleInputChange}
          onDateChange={handleDateChange}
          onAddEvent={handleAddEvent}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Calendar
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your schedule and appointments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Mini Calendar */}
        <div className="w-full lg:w-1/3 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="text-md font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FiCalendar className="text-newPrimary" />
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div
                key={`${day}-${idx}`}
                className="text-center text-xs text-gray-500 font-medium py-1"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderMiniCalendar()}</div>

          {/*  Upcoming Meetings */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Upcoming Meetings
            </h3>

            <div className="space-y-2">
              {calendar && calendar.length > 0 ? (
                calendar
                  // ✅ Flatten all meetings with their individual date & time
                  .flatMap(meeting =>
                    meeting.dates.map((date, i) => ({
                      companyName: meeting?.companyName,
                      person: meeting?.person,
                      date: new Date(date),
                      time: meeting.times?.[i] || "N/A",
                    }))
                  )
                  // ✅ Filter upcoming only (today or later)
                  .filter(m => m.date >= new Date())
                  // ✅ Sort ascending by date/time
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  // ✅ Map into UI cards
                  .map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {m?.companyName ? `${m.companyName} — ${m.person}` : m?.person}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <FiClock size={12} />
                        {months[m.date.getMonth()]} {m.date.getDate()}, {m.date.getFullYear()} — {m.time}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500 py-2">No upcoming meetings</div>
              )}
            </div>
          </div>

        </div>

        {/* Main Calendar */}
        <div className="w-full lg:w-2/3 bg-white flex flex-col flex-1 p-5 rounded-xl shadow-sm border border-gray-100 min-h-[calc(100vh-120px)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <FiChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              <h3 className="text-lg font-semibold text-gray-800">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>

              <button
                onClick={handleNext}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <FiChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>


          </div>

          {viewMode === "month" && (
            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-600 p-2"
                >
                  {day}
                </div>
              ))}
            </div>
          )}

          {renderMainCalendar()}
        </div>
      </div>
    </div>
  );
};
export default Calendar;
