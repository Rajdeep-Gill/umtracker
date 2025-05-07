"use client";
import { useGetEventsByCourseCode } from "@/features/events/use-get-events";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, CalendarIcon } from "lucide-react";

interface AssignmentCardProps {
  title: string;
  description?: string | null;
  endTime: string;
  courseCode: string;
  courseColor: string;
}

const AssignmentCard = ({
  title,
  description,
  endTime,
  courseCode,
  courseColor,
}: AssignmentCardProps) => {
  const dueDate = new Date(endTime);

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: `${courseColor}05`,
        borderColor: `${courseColor}30`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge style={{ backgroundColor: courseColor }}>{courseCode}</Badge>
        <span className="text-sm font-medium break-words">{title}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <CalendarIcon className="w-4 h-4" />
          {dueDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <ClockIcon className="w-4 h-4" />
          {dueDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          })}
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground break-words mt-3">
          {description}
        </p>
      )}
    </div>
  );
};

export const AssignmentDetails = ({ courseCode }: { courseCode: string }) => {
  const { data: eventsData, isLoading } = useGetEventsByCourseCode(courseCode);

  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!eventsData?.events.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No assignments found for this course
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {eventsData.events.map((event) => (
        <AssignmentCard
          key={event.id}
          title={event.title}
          description={event.description}
          endTime={event.endTime}
          courseCode={event.courseCode || courseCode}
          courseColor={eventsData.course.color}
        />
      ))}
    </div>
  );
};
