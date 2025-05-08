"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ClockIcon, ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "./ui/separator";
import { useGetEvents } from "@/features/events/use-get-events";

type EventType = "Assignment" | "Available" | "Regular";

export const MobileCalendarDisplay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { data: eventsData } = useGetEvents();

  // Get the start of the current week (Sunday)
  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    return new Date(date.setDate(date.getDate() - day));
  };

  // Generate the week's dates
  const generateWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekStart = getWeekStart(new Date(currentDate));
  const weekDates = generateWeekDates(weekStart);

  // Navigate to previous week
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to next week
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
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
          <h2 className="text-xl font-medium">
            {weekStart.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week View */}
      <div className="space-y-2">
        {weekDates.map((date) => {
          const dayEvents = getEventsForDate(date);
          return (
            <Dialog key={date.toISOString()}>
              <DialogTrigger asChild>
                <div className="border rounded-lg p-3 hover:bg-accent/50 transition-colors h-[116px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                          isToday(date)
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      <span className="font-medium">
                        {date.toLocaleDateString("en-US", { weekday: "long" })}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dayEvents.length} events
                    </span>
                  </div>
                  <div className="space-y-1">
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
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[400px]">
                <DialogTitle>
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </DialogTitle>
                <DialogDescription>{dayEvents.length} events</DialogDescription>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
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
                              backgroundColor: getCourseColor(event.courseCode),
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
              </DialogContent>
            </Dialog>
          );
        })}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="text-sm font-medium flex items-center gap-2">
          <ListIcon className="w-4 h-4" />
          Filter By
        </div>
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
