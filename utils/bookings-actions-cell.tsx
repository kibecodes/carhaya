"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRefreshAfterCancel, useRefreshAfterComplete, useRefreshAfterDelete } from '@/hooks/refresh';
import type { Booking } from '@/types';
import { handleCompleteBooking, handleDeleteBooking } from '@/components/bookings/all-bookings/page';
import { handleCancelBooking } from '@/components/bookings/all-bookings/page';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/react";

interface ActionsCellProps {
  booking: Booking;
}

const schema = z.object({
  newPlates: z.string().min(1, { message: 'Enter new number plates' }),
})

const BookingActionsCell: React.FC<ActionsCellProps> = ({ booking }) => {
  const { deleteById, isDeleting } = useRefreshAfterDelete();
  const { cancelById, isCanceling } = useRefreshAfterCancel();
  const { completeById, isCompleting } = useRefreshAfterComplete();

  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();


  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPlates: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    const validatedFields = schema.safeParse(values);

    if(!validatedFields.success) {
      setError("Invalid Fields!")
      return;
    }

    const { newPlates } = validatedFields.data;

    startTransition(async() => {
      try {
        setError("");
        setSuccess("");

        const sessionToken = await getSession();
        const token = sessionToken?.user.accessToken;

        if (token) {
          const response = await axios.post(
            `https://carhire.transfa.org/api/bookings/re-assign/vehicle?id=${booking.id}&plateNumber=${newPlates}`,{},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (response.status === 200) {
            setSuccess(response.data);
            setError("");
            setPopoverOpen(false);
          } else {
            setError("Error re-assigning vehicle! Please try again later.");
            setSuccess("");
          }
        }

      } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error('Error response from server:', error.response.data);
              alert(`Fetching failed: ${error.response.data.message}`);
            } else if (error.request) {
              console.error('No response received:', error.request);
              alert('Fetching failed: No response from server. Please try again later.');
            } else {
              console.error('Error in setup:', error.message);
              alert(`Fetching failed: ${error.message}`);
            }
          } else {
          console.error('Unexpected error:', error);
          alert('Fetching failed: An unexpected error occurred. Please try again.');
        }
      }
    })
  }

  const handleCancel = () => {
    form.reset();
    setError("");
    setSuccess("");
    setPopoverOpen(false);
  }

  return (
    <div className="flex space-x-2">
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Alert variant="destructive">
            <BsExclamationTriangle className="h-4 w-4"/>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        </div>
      )}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Alert className="bg-green-400">
            <AlertTitle>{success}</AlertTitle>
          </Alert>
        </div>
      )}
      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => setPopoverOpen(true)}
          >
            Re-assign New Vehicle
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <div className="p-4">
            <p className="text-gray-500 mb-2">Agency: {booking.agencyName}</p>
            <p className="text-gray-500 mb-2">Booking ID: {booking.id}</p>

            <div className="mb-4">
              <label htmlFor="currentPlate" className="block text-sm font-medium text-gray-700">
                Current Vehicle Plate
              </label>
              <Input
                id="currentPlate"
                type="text"
                value={booking.vehiclePlateNumber}
                readOnly
                disabled
                className="bg-gray-200 blur-sm mt-1 block w-full" 
              />
            </div>

            <div className="mb-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                  <FormField
                    control={form.control}
                    name="newPlates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Vehicle Number Plates</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter new vehicle Plates"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="w-full justify-between flex mt-4">
                    <Button
                      variant="default"
                      type="submit"
                    >
                      Re-assign
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        className="bg-blue-400 hover:bg-blue-600 text-white"
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
