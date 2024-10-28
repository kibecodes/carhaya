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
import type { DeleteParams } from "../all-vehicles/page";
import { handleDeleteVehicle } from "../all-vehicles/page";
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
  }
  else if (!vehicle.isVehicleActive) {
    return "Deactivated";
  }
  return "Inactive";  
};

const deleteVehicle = async({ params }: DeleteParams) => {  
  try {
    const res = await handleDeleteVehicle(params.id);
    if (res?.success) {
      alert("Vehicle deleted successfully!");
      return { success: res.success };
    } else {
      alert(res?.error || "Delete failed!");
      return { error: "Delete failed!" };
    }
  } catch (error) {
    console.log("Error:", error);
    alert("An error occurred while deleting the vehicle.");
  }
}

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
        // <div className="flex space-x-2">
        //   <Button
        //     className="bg-blue-500 text-white hover:bg-blue-600"
        //     onClick={() => {
        //     }}
        //   >
        //     <Link 
        //         href={{
        //           pathname: `/upload/fleet/${vehicle.id}`,
        //           query: {
        //             ownerId: vehicle.ownerUserId,
        //             id: vehicle.id,
        //             make: vehicle.vehicleMake,
        //             model: vehicle.vehicleType,
        //             year: vehicle.vehicleYearOfManufacture,
        //             plates: vehicle.vehiclePlateNumber,
        //             color: vehicle.vehicleColor,
        //             body: vehicle.vehicleBodyType,
        //             seats: vehicle.vehicleSeatsCapacity,
        //             mileage: vehicle.vehicleMillage,
        //             engine: vehicle.vehicleEngineCapacity,
        //             unitCost: vehicle.unitCostPerDay,
        //             agency: vehicle.agencyName,
        //             front: vehicle.vehicleFrontImage,
        //             side: vehicle.vehicleSideImage,
        //             back: vehicle.vehicleBackImage,
        //             interiorFront: vehicle.vehicleInteriorFrontImage,
        //             interiorBack: vehicle.vehicleInteriorBackImage,
        //           }
        //         }}
        //       >
        //         Edit
        //       </Link>
        //   </Button>
        //   <Button
        //     variant="destructive"
        //     className="text-white hover:bg-red-600"
        //     onClick={() => deleteVehicle({ params: { id: vehicle.id } })}
        //   >
        //     Delete
        //   </Button>
        // </div>
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