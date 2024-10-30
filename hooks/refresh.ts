import { useRouter } from "next/navigation";
import { useState } from "react";

type ActionResponse = {
  success: string;
  error?: string;
};

export const useRefreshAfterDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deleteById = async (
    id: number,
    handleDelete: (id: number) => Promise<ActionResponse>,
    entityType: "Booking" | "Vehicle"
  ) => {
    setIsDeleting(true);
    try {
      const res = await handleDelete(id);
      if (res?.success) {
        alert(`${entityType} deleted successfully!`);
        router.refresh();
      } else {
        alert(res?.error || `Failed to delete ${entityType.toLowerCase()}!`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `An error occurred while deleting the ${entityType.toLowerCase()}.`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteById, isDeleting };
};

export const useRefreshAfterCancel = () => {
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const cancelById = async (
    id: number,
    handleCancel: (id: number) => Promise<ActionResponse>
  ) => {
    setIsCanceling(true);
    try {
      const res = await handleCancel(id);
      if (res.success) {
        alert("Booking canceled successfully!");
        router.refresh();
      } else {
        alert(res?.error || `Failed to cancel booking!`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while canceling booking.`);
    } finally {
      setIsCanceling(false);
    }
  };

  return { isCanceling, cancelById };
};

export const useRefreshAfterComplete = () => {
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();

  const completeById = async (
    id: number,
    handleComplete: (id: number) => Promise<ActionResponse>
  ) => {
    setIsCompleting(true);
    try {
      const res = await handleComplete(id);
      if (res.success) {
        alert("Booking completed successfully!");
        router.refresh();
      } else {
        alert(res?.error || `Failed to complete booking!`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while completing booking.`);
    } finally {
      setIsCompleting(false);
    }
  };

  return { completeById, isCompleting };
};
