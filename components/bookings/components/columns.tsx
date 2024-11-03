"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import type { Booking } from "@/types";
import BookingActionCell from "@/utils/bookings-actions-cell";

const getBookingStatus = (booking: Booking) => {
  if (booking.isBookingCompleted) {
    return "Completed";
  } else if (booking.isBookingCancelled) {
    return "Canceled";
  } else if (booking.isBookingDeleted) {
    return "Deleted";
  }
  return "Unknown";  
};

export const getColumns = (userRole: string | undefined, showActions: boolean): ColumnDef<Booking>[] => {
  const columns: ColumnDef<Booking>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...(userRole === "Admin" 
      ? [
          {
            accessorKey: "agencyName",
            header: "Agency",
          },
        ]
      : []), 
    {
      accessorKey: "vehiclePlateNumber",
      header: "Plate No.",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Link 
            className="text-blue-500 hover:underline"
            href={{
                pathname: `all-bookings/status/${booking.id}`,
                query: {
                  id: booking.id,
                  plates: booking.vehiclePlateNumber,
                }
              }} 
          >
            {booking.vehiclePlateNumber}
          </Link>
        )
      }
    },
    {
      accessorKey: "unitCostPerDay",
      header: "Cost Per Day"
    },
    {
      accessorKey: "startDate",
      header: "Start"
    },
    {
      accessorKey: "endDate",
      header: "End"
    },
    {
      accessorKey: "duration",
      header: "Duration (days)",
      cell: ({ row }) => {
        const booking = row.original;

        return <div className="justify-self-center">{booking.duration}</div> 
      }
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const booking = row.original;
        const status = getBookingStatus(booking);
        
        return (
          <span
            className={`${
              status === "Completed" ? "text-green-500" : 
              status === "Deleted" ? "text-red-500" :
              status === "Canceled" ? "text-yellow-500" : "text-gray-500"
            }`}
          >
            {status}
          </span>
        );
      },
    },

    {
      accessorKey: "totalCost",
      header: () => <div className="text-right">Amount Paid</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalCost"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "KES",
        }).format(amount)
  
        return <div className="text-right font-medium">{formatted}</div>
      }
    },
    ...(userRole === "Admin" && showActions
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: CellContext<Booking, unknown>) => {
              const booking = row.original;
              
              return (
                <div className="flex flex-row">
                  <BookingActionCell booking={booking}/>
                </div>
              );
            },
            enableSorting: false, 
            enableHiding: false, 
          },
        ]
      : []), 

    {
      id: "actions",
      cell: ({ row }) => {
        const booking = row.original
   
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(booking.userId)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link 
                  href={{
                    pathname: `all-bookings/booking/${booking.id}`,
                    query: {
                      id: booking.id, 
                      plates: booking.vehiclePlateNumber,
                      total: booking.totalCost,
                      paymentStatus: booking.paymentStatus,
                    }
                  }}
                >
                  View Booking
                </Link>
              </DropdownMenuItem>              
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
