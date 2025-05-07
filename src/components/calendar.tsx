"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ClockIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetEvents } from "@/features/events/use-get-events";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./ui/separator";

type EventType = "Assignment" | "Available" | "Regular";

export const CalendarDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { data: eventsData, isLoading } = useGetEvents();

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

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!eventsData?.events) return [];
    const events = eventsData.events.filter((event) => {
      const eventDate = new Date(event.endTime);
      const dateMatch =
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();

      const typeMatch =
        selectedEventTypes.length === 0 ||
        selectedEventTypes.includes(event.eventType as EventType);

      const courseMatch =
        selectedCourses.length === 0 ||
        (event.courseCode && selectedCourses.includes(event.courseCode));

      return dateMatch && typeMatch && courseMatch;
    });

    return events;
  };

  // Get course color
  const getCourseColor = (courseCode: string) => {
    const course = eventsData?.courses.find((c) => c.code === courseCode);
    return course?.color || "#000000";
  };

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg border bg-background p-4 h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-medium pl-2 inline-flex">
            {formatMonthYear(currentDate)}
            {isLoading && (
              <div className="text-muted-foreground text-sm gap-2 inline-flex items-center">
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                Loading events...
              </div>
            )}
          </h2>
        </div>
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
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          return (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <div
                  className={`bg-background p-2 min-h-[100px] ${
                    day.isCurrentMonth ? "" : "text-muted-foreground"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                        isToday(day.date)
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {day.day}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs truncate px-2 py-1 rounded-full border"
                        style={{
                          backgroundColor: event.courseCode
                            ? `${getCourseColor(event.courseCode)}5`
                            : "#00000005",
                          color: "#000000",
                          borderColor: event.courseCode
                            ? `${getCourseColor(event.courseCode)}30`
                            : "#00000030",
                        }}
                      >
                        <div className="flex items-center gap-1 justify-between">
                          <div className="flex items-center gap-1 min-w-0 flex-1">
                            {event.courseCode && (
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: getCourseColor(
                                    event.courseCode
                                  ),
                                }}
                              />
                            )}
                            <span className="truncate font-medium">
                              {event.title}
                            </span>
                          </div>
                          <span className="font-medium text-muted-foreground flex-shrink-0 ml-2">
                            {new Date(event.endTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-96">
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {day.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <Separator />
                    {dayEvents.length === 0 && (
                      <div className="text-muted-foreground text-md">
                        No events for this day
                      </div>
                    )}
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: event.courseCode
                            ? `${getCourseColor(event.courseCode)}5`
                            : "#00000005",
                          borderColor: event.courseCode
                            ? `${getCourseColor(event.courseCode)}30`
                            : "#00000030",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {event.courseCode && (
                            <Badge
                              style={{
                                backgroundColor: getCourseColor(
                                  event.courseCode
                                ),
                              }}
                            >
                              {event.courseCode}
                            </Badge>
                          )}
                          <span className="text-sm font-medium break-words">
                            {event.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                          <ClockIcon className="w-4 h-4" />
                          {new Date(event.endTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground break-words">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
      <div>Filter By:</div>
      <div className="flex flex-col gap-4">
        {/* Event Type Filter */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Event Type</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedEventTypes.length === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedEventTypes([])}
            >
              All
            </Button>
            {["Assignment", "Available", "Regular"].map((type) => (
              <Button
                key={type}
                variant={
                  selectedEventTypes.includes(type as EventType)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => {
                  if (selectedEventTypes.includes(type as EventType)) {
                    setSelectedEventTypes(
                      selectedEventTypes.filter((t) => t !== type)
                    );
                  } else {
                    setSelectedEventTypes([
                      ...selectedEventTypes,
                      type as EventType,
                    ]);
                  }
                }}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Filter */}
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">Course</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCourses.length === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCourses([])}
            >
              All
            </Button>
            {eventsData?.courses.map((course) => (
              <Button
                key={course.code}
                variant={
                  selectedCourses.includes(course.code) ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  if (selectedCourses.includes(course.code)) {
                    setSelectedCourses(
                      selectedCourses.filter((c) => c !== course.code)
                    );
                  } else {
                    setSelectedCourses([...selectedCourses, course.code]);
                  }
                }}
                style={{
                  backgroundColor: selectedCourses.includes(course.code)
                    ? course.color
                    : undefined,
                  color: selectedCourses.includes(course.code)
                    ? "#fff"
                    : undefined,
                }}
              >
                {course.code}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
