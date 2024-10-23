import type { Booking } from "@/types";
import { differenceInCalendarDays } from "date-fns";

export const formatDataArrayDates = (bookings: Booking[]) => {
  return bookings.map((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    const duration = differenceInCalendarDays(
      new Date(endDate),
      new Date(startDate)
    );

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid date format:", booking.startDate, booking.endDate);
      return booking;
    }

    const formattedBooking = {
      ...booking,
      startDate: `${startDate.getDate().toString().padStart(2, "0")}-${(
        startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${startDate.getFullYear()}`,
      endDate: `${endDate.getDate().toString().padStart(2, "0")}-${(
        endDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${endDate.getFullYear()}`,
      duration,
    };

    return formattedBooking;
  });
};

export const formatDataDates = (booking: Booking) => {
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  const duration = differenceInCalendarDays(
    new Date(endDate),
    new Date(startDate)
  );

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error("Invalid date format:", booking.startDate, booking.endDate);
    return booking;
  }

  const formattedBooking = {
    ...booking,
    startDate: `${startDate.getDate().toString().padStart(2, "0")}-${(
      startDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${startDate.getFullYear()}`,
    endDate: `${endDate.getDate().toString().padStart(2, "0")}-${(
      endDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${endDate.getFullYear()}`,
    duration,
  };

  return formattedBooking;
};
