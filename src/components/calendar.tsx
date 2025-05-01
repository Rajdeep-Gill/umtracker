"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CalendarDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Calculate the number of days in the month
  const daysInMonth = lastDayOfMonth.getDate();

  // Calculate the number of days to display from the previous month
  const daysFromPrevMonth = firstDayOfWeek;

  // Calculate the total number of days to display (including days from previous and next month)
  const totalDays = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;

  // Get the previous month's last days
  const prevMonthLastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  // Generate calendar days
  const calendarDays = [];

  // Add days from previous month
  for (let i = 0; i < daysFromPrevMonth; i++) {
    const day = prevMonthLastDay - daysFromPrevMonth + i + 1;
    calendarDays.push({
      date: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        day
      ),
      isCurrentMonth: false,
      day,
    });
  }

  // Add days from current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true,
      day: i,
    });
  }

  // Add days from next month
  const remainingDays = totalDays - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false,
      day: i,
    });
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg border bg-background p-4 h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{formatMonthYear(currentDate)}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-sm font-medium">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="pt-2 px-2 -mb-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Day Grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden border bg-muted flex-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`bg-background p-2 ${
              day.isCurrentMonth ? "" : "text-muted-foreground"
            }`}
          >
            <div className="flex justify-between items-start">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                  isToday(day.date) ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {day.day}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
