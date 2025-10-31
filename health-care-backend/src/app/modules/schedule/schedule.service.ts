import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";

const insertScheduleIntoDB = async (payload: any) => {
    // Payload is expected to include a date range and daily time window
    // Example: { startDate: "2025-01-01", endDate: "2025-01-03", startTime: "10:00", endTime: "13:00" }
    console.log({ payload });
    const { startDate, endDate, startTime, endTime } = payload;

    // Each slot will be 30 minutes long
    const intervalTime = 30;
    const schedules = [];

    // Convert input dates (strings) to Date objects; these represent the day range
    const currentDate = new Date(startDate)
    console.log({ currentDate });
    const lastDate = new Date(endDate)
    console.log({ lastDate });

    // Iterate day by day from startDate through endDate (inclusive)
    while (currentDate <= lastDate) {
        // Build the day's starting DateTime by combining the current day with startTime
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        // Build the day's ending DateTime by combining the current day with endTime
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) //gives the hour
                ),
                Number(endTime.split(":")[1])
            )
        )

        // Walk through the time window for the day, creating 30-minute slots
        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime; // Example: 10:30
            const slotEndDateTime = addMinutes(startDateTime, intervalTime); // Example: 11:00

            // Candidate schedule record for this slot
            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }

            // Skip creating a duplicate if a schedule already exists for the exact same slot
            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            })

            if (!existingSchedule) {
                // Persist the new slot
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result)
            }

            // Advance to the next slot within the same day (mutates startDateTime via reference)
            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1)
    }

    // Return all newly created schedule records within the date range
    return schedules;
}

export const ScheduleService = {
    insertScheduleIntoDB
}