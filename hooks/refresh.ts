import { useRouter } from "next/navigation";
import { useState } from "react";

export const useRefreshAfterDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deleteVehicle = async (
    id: number,
    handleDelete: (id: number) => Promise<any>
  ) => {
    setIsDeleting(true);
    try {
      const res = await handleDelete(id);
      if (res?.success) {
        alert("Vehicle deleted successfully!");
        // Refresh the page
        router.refresh();
      } else {
        alert(res?.error || "Delete failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the vehicle.");
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteVehicle, isDeleting };
};
