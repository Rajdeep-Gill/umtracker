"use server";
import ICAL from "ical.js";
import { db } from "@/db";
import { calendarEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function fetchIcsData(url: string) {
  try {
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return { error: "Invalid URL format" };
    }

    // Fetch the ICS file
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return {
        error: `Failed to fetch ICS file: ${response.status} ${response.statusText}`,
      };
    }

    const icsData = await response.text();

    return icsData;
  } catch (error) {
    return { error: "Failed to fetch ICS file" };
  }
}

export async function parseAndStoreEvents(icsData: string, userId: string) {
  try {
    // Parse the ICS data
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    // Delete existing events for this user
    await db.delete(calendarEvents).where(eq(calendarEvents.userId, userId));

    // Process each event
    const events = vevents.map((vevent) => {
      const event = new ICAL.Event(vevent);
      const summary = event.summary;

      // Location is actually the course code and section.
      // For example: "ECE-4830-A01 - Signal Processing 2"
      // Course Code is ECE-4830
      // Course section is A01
      // Course name is Signal Processing 2

      // If we cannot cannot extract the course code then we just skip this particular event
      const courseDetails = event.location.split("-");
      if (courseDetails.length < 2) {
        return null;
      }
      const courseCode = courseDetails[0] + "-" + courseDetails[1];
      const courseName = courseDetails[courseDetails.length - 1];

      if (courseCode.length > 10) {
        return null; // Something went wrong with the course code so invalid event
      }

      // Check what the event.summary ends with
      // If it ends with " - Due" then we need to categorize it as a due date
      // If it ends with " - Avaliable" then we need to categorize it in the available events
      // Else we need to categorize it as a regular event

      let eventType = "Regular";
      if (summary.endsWith(" - Due")) {
        eventType = "Assignment";
        event.summary = summary.slice(0, -5);
      } else if (summary.endsWith(" - Available")) {
        eventType = "Available";
        event.summary = summary.slice(0, -11);
      }

      return {
        id: nanoid(),
        userId,
        title: event.summary,
        description: event.description,
        endTime: event.endDate.toJSDate(),
        courseCode,
        courseName,
        eventType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Store events in database
    if (events.length > 0) {
      await db
        .insert(calendarEvents)
        .values(events.filter((event) => event !== null)); // store only non-null events
    }

    return { success: true, count: events.length };
  } catch (error) {
    console.error("Error parsing ICS data:", error);
    return { error: "Failed to parse ICS data" };
  }
}
