"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import type { Vehicle } from "@/types";
import Link from "next/link";
import React from "react";
import ActionsCell from "@/utils/vehicles-actions-cell";

const getVehicleStatus = (vehicle: Vehicle) => {
  if (vehicle.isVehicleDeleted) {
    return "Deleted";
  } else if (vehicle.isVehicleUnderMaintenance) {
    return "Under Maintenance";
  } else if (vehicle.isVehicleBooked) {
    return "Booked";
  } else if (vehicle.isVehicleActive) {
    return "Active";
  } else if (!vehicle.isVehicleActive) {
    return "Deactivated";
  }
  return "Inactive";  
};

export const columns: ColumnDef<Vehicle>[] = [
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
  {
    accessorKey: "vehiclePlateNumber",
    header: "Plate No.",
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <Link 
          className="text-blue-500 hover:underline"
          href={{
              pathname: `/vehicles/all-vehicles/status/${vehicle.id}`,
              query: {
                id: vehicle.id,
                make: vehicle.vehicleMake,
                model: vehicle.vehicleType,
                plateNumber: vehicle.vehiclePlateNumber,
              }
            }} 
        >
          {vehicle.vehiclePlateNumber}
        </Link>
      )
    }
  },
  {
    accessorKey: "vehicleMake",
    header: "Make",
  },
  {
    accessorKey: "vehicleType",
    header: "Model",
  },
  {
    accessorKey: "vehicleYearOfManufacture",
    header: "Year of Manufacture"
  },
  {
    accessorKey: "vehicleBodyType",
    header: "Body Type"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const vehicle = row.original;
        const status = getVehicleStatus(vehicle);

        return (
            <span
                className={`${
                    status === "Active" ? "text-green-500" : 
                    status === "Booked" ? "text-yellow-500" :
                    status === "Under Maintenance" ? "text-orange-500" : 
                    status === "Deleted" ? "text-red-500" : "text-gray-500"
                }`}
            >
          {status}
        </span>
        )
    }
  },
  {
    accessorKey: "vehicleEngineCapacity",
    header: "Engine Capacity"
  },
  {
    accessorKey: "unitCostPerDay",
    header: () => <div className="text-center">Price Per Day</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unitCostPerDay"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount)

      return <div className="text-center font-medium">{formatted}</div>
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vehicle = row.original;

      return (
        <ActionsCell vehicle={vehicle}/>
      );
    },
    enableSorting: false, 
    enableHiding: false, 
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original
 
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
              onClick={() => navigator.clipboard.writeText(vehicle.ownerUserId)}
            >
              Copy owner userID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`all-vehicles/details/${vehicle.id}`}>
                View vehicle details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]