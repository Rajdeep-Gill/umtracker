"use client";
import { useGetEvents } from "@/features/events/use-get-events";
import Link from "next/link";
import { Folder, Calendar, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const CourseDashboard = () => {
  const { data: eventsData, isLoading } = useGetEvents();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!eventsData?.courses.length) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            No courses found. Add some courses to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Select a course to view its assignments and events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventsData.courses.map((course) => {
          // Calculate counts for this course
          const courseEvents = eventsData.events.filter(
            (event) => event.courseCode === course.code
          );
          const assignmentCount = courseEvents.filter(
            (event) => event.eventType === "Assignment"
          ).length;
          const eventCount = courseEvents.filter(
            (event) => event.eventType === "Available"
          ).length;

          return (
            <Link
              key={course.code}
              href={`/courses/${course.code}`}
              className="block"
              prefetch={true}
            >
              <div
                className="w-full h-24 rounded-lg border p-4 hover:bg-accent transition-colors relative overflow-hidden group"
                style={{
                  borderColor: `${course.color}30`,
                  backgroundColor: `${course.color}05`,
                }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <Folder
                      className="w-8 h-8 flex-shrink-0"
                      style={{ color: course.color }}
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold truncate">
                          {course.code}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: `${course.color}30`,
                            color: course.color,
                          }}
                        >
                          {course.code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4" />
                      <span>{assignmentCount} Assignments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{eventCount} Events</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
