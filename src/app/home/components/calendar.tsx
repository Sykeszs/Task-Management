"use client";
import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameMonth, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths } from "date-fns";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const header = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Prev
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const days = [];
    const startDate = startOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-gray-600">
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const cells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = startOfWeek(addDays(monthEnd, 6));
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        days.push(
          <div
            key={day.toString()}
            className={`p-2 text-center cursor-pointer ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400"
                : isSameDay(day, selectedDate)
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      {header()}
      {daysOfWeek()}
      {cells()}
    </div>
  );
};

export default CalendarPage;
