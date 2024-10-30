import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRefreshAfterCancel, useRefreshAfterComplete, useRefreshAfterDelete } from '@/hooks/refresh';
import type { Booking } from '@/types';
import { handleCompleteBooking, handleDeleteBooking } from '@/components/bookings/all-bookings/page';
import { handleCancelBooking } from '@/components/bookings/all-bookings/page';

interface ActionsCellProps {
  booking: Booking;
}

const BookingActionsCell: React.FC<ActionsCellProps> = ({ booking }) => {
  const { deleteById, isDeleting } = useRefreshAfterDelete();
  const { cancelById, isCanceling } = useRefreshAfterCancel();
  const { completeById, isCompleting } = useRefreshAfterComplete();

  return (
    <div className="flex space-x-2">
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => alert('editing booking')}
      >
        <Link
          href={{
            pathname: ``,
            query: {
              id: booking.id,
            }
          }}
        >
          Edit
        </Link>
      </Button>
      <Button
        variant="outline"
        className=' hover:bg-red-600'
        onClick={() => cancelById(booking.id, handleCancelBooking)}
        disabled={isCanceling}
      >
        {isCanceling ? "Canceling..." : "Cancel"}
      </Button>
      <Button
        variant="destructive"
        className="text-white hover:bg-red-600"
        onClick={() => deleteById(booking.id, handleDeleteBooking, "Booking")}
        disabled={isDeleting} 
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      <Button
        className="text-white bg-green-400 hover:bg-green-600"
        onClick={() => completeById(booking.id, handleCompleteBooking)}
        disabled={isCompleting}
      >
        {isCompleting ? "Completing..." : "Complete"}
      </Button>
    </div>
  );
};

export default BookingActionsCell;
