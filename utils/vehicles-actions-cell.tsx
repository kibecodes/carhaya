import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRefreshAfterDelete } from '@/hooks/refresh';
import { handleDeleteVehicle } from '@/components/vehicles/all-vehicles/page';
import type { Vehicle } from '@/types';

interface ActionsCellProps {
  vehicle: Vehicle;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ vehicle }) => {
  const { deleteVehicle, isDeleting } = useRefreshAfterDelete();

  return (
    <div className="flex space-x-2">
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        <Link
          href={{
            pathname: `/upload/fleet/${vehicle.id}`,
            query: {
              id: vehicle.id,
            }
          }}
        >
          Edit
        </Link>
      </Button>
      <Button
        variant="destructive"
        className="text-white hover:bg-red-600"
        onClick={() => deleteVehicle(vehicle.id, handleDeleteVehicle)}
        disabled={isDeleting} 
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default ActionsCell;
