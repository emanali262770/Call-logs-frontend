import React, { useState } from "react";
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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // December 2, 2021
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
    if (viewMode === "day") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 1
        )
      );
    } else if (viewMode === "week") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 7
        )
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        )
      );
    } else if (viewMode === "week") {
      setCurrentDate(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 7
        )
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title) {
      alert("Please add a title for the event");
      return;
    }

    const event = {
      id: events.length + 1,
      ...newEvent,
    };

    setEvents([...events, event]);
    setShowEventForm(false);
    setNewEvent({
      title: "",
      date: selectedDate,
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      participants: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setNewEvent({ ...newEvent, date: new Date(e.target.value) });
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
              className={`h-8 flex items-center justify-center cursor-pointer rounded-full transition-all relative ${
                isSelected
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
    if (viewMode === "day") {
      const dayEvents = getEventsForDate(selectedDate);

      return (
        <div className="h-96 overflow-y-auto p-4 bg-gray-50 rounded-xl">
          <div className="text-xl font-bold mb-4 flex items-center gap-2 text-newPrimary">
            <FiCalendar className="text-newPrimary" />
            {days[selectedDate.getDay()]}, {months[selectedDate.getMonth()]}{" "}
            {selectedDate.getDate()}, {selectedDate.getFullYear()}
          </div>
          <div className="space-y-3">
            {dayEvents.length > 0 ? (
              dayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-blue-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all"
                >
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <FiUser className="text-blue-500" /> {event.title}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                    <FiClock className="text-blue-500" /> {event.startTime} -{" "}
                    {event.endTime}
                  </div>
                  {event.description && (
                    <div className="text-sm text-gray-600 mt-2">
                      {event.description}
                    </div>
                  )}
                  {event.participants && (
                    <div className="text-sm text-gray-600 mt-1">
                      With: {event.participants}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No events scheduled for this day
              </div>
            )}
          </div>
        </div>
      );
    }

    if (viewMode === "week") {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());

      return (
        <div className="h-96 overflow-y-auto bg-gray-50 rounded-xl p-2">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = new Date(weekStart);
              day.setDate(weekStart.getDate() + i);
              const isSelected = isSameDay(selectedDate, day);
              const isToday = isSameDay(day, new Date());
              const dayEvents = getEventsForDate(day);

              return (
                <div
                  key={i}
                  className={`rounded-xl p-3 border transition-all ${
                    isSelected
                      ? "bg-newPrimary/10 border-newPrimary"
                      : "bg-white border-gray-100"
                  } ${isToday ? "ring-2 ring-blue-100" : ""}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="font-medium text-gray-500 text-sm">
                    {days[day.getDay()]}
                  </div>
                  <div
                    className={`text-lg font-bold my-1 ${
                      isToday ? "text-newPrimary" : "text-gray-800"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map((event, j) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1.5 rounded-lg truncate ${
                          j % 2 === 0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Month view
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays = [];
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || dayCount > daysInMonth) {
          calendarDays.push(
            <div
              key={`empty-${i}-${j}`}
              className="h-24 border border-gray-100 rounded-lg bg-gray-50"
            ></div>
          );
        } else {
          const dayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayCount
          );
          const isSelected = isSameDay(selectedDate, dayDate);
          const isToday = isSameDay(dayDate, new Date());
          const dayEvents = getEventsForDate(dayDate);

          calendarDays.push(
            <div
              key={`day-${dayCount}`}
              className={`h-24 border border-gray-100 p-2 rounded-lg transition-all ${
                isSelected
                  ? "bg-newPrimary/10 border-newPrimary"
                  : "bg-white hover:bg-gray-50"
              } ${isToday ? "ring-2 ring-blue-100" : ""}`}
              onClick={() => handleDateClick(dayCount)}
            >
              <div
                className={`text-right font-medium ${
                  isToday ? "text-newPrimary" : "text-gray-700"
                }`}
              >
                {dayCount}
              </div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 2).map((event, j) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${
                      j % 2 === 0
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
          dayCount++;
        }
      }
    }
    return (
      <div className="grid grid-cols-7 gap-2 overflow-y-auto h-96 bg-gray-50 p-2 rounded-xl">
        {calendarDays}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
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
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-newPrimary focus:border-newPrimary"
            />
          </div>

          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
            onClick={() => setShowEventForm(true)}
          >
            <FiPlus className="text-lg" />
            <span>Add Event</span>
          </button>
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

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {filteredEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="bg-blue-50 p-3 rounded-lg border border-blue-100"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <FiClock size={12} />
                    {months[event.date.getMonth()]} {event.date.getDate()},{" "}
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <div className="text-center text-gray-500 py-2">
                  No events found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="w-full lg:w-2/3 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <FiChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800">
                {viewMode === "day"
                  ? `${days[selectedDate.getDay()]}, ${
                      months[selectedDate.getMonth()]
                    } ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                  : viewMode === "week"
                  ? `Week of ${
                      months[currentDate.getMonth()]
                    } ${currentDate.getDate()}, ${currentDate.getFullYear()}`
                  : `${
                      months[currentDate.getMonth()]
                    } ${currentDate.getFullYear()}`}
              </h3>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <FiChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {["day", "week", "month"].map((mode) => (
                <button
                  key={mode}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    viewMode === mode
                      ? "bg-white shadow-sm text-newPrimary font-medium"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
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
const EventForm = ({
  newEvent,
  onClose,
  onInputChange,
  onDateChange,
  onAddEvent,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-newPrimary">Add New Event</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-newPrimary focus:border-newPrimary"
            placeholder="Meeting name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={newEvent.date.toISOString().split("T")[0]}
            onChange={onDateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-newPrimary focus:border-newPrimary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={newEvent.startTime}
              onChange={onInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-newPrimary focus:border-newPrimary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={newEvent.endTime}
              onChange={onInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-newPrimary focus:border-newPrimary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={newEvent.description}
            onChange={onInputChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-newPrimary focus:border-newPrimary"
            placeholder="Event details"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participants
          </label>
          <input
            type="text"
            name="participants"
            value={newEvent.participants}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-newPrimary focus:border-newPrimary"
            placeholder="Who is attending?"
          />
        </div>

        <button
          onClick={onAddEvent}
          className="w-full bg-newPrimary text-white py-2 rounded-lg hover:bg-primaryDark transition-all"
        >
          Add Event
        </button>
      </div>
    </div>
  </div>
);

export default Calendar;
