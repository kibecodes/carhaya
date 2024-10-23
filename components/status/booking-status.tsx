"use client"

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios";
import { getSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert component
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const allStatus = ["Completed", "Canceled"];

const BookingStatusPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);  
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    if (!id) {
        setError("Invalid booking ID");;
    }
    const bookingId = Number(id);
    const plates = searchParams.get("plates");

    const apiEndpoints: { [key: string]: string } = {
        complete: `https://carhire.transfa.org/api/bookings/complete?id=${bookingId}`, 
        cancel: `https://carhire.transfa.org/api/bookings/cancel?id=${bookingId}`,
    };

    const handleSubmit = async () => {
        setError(null); 
        setSuccessMessage(null); 

        if (!selectedStatus) {
            setError("Please select a status before submitting.");
            return;
        }

        try {
            setIsSubmitting(true);
            const sessionToken = await getSession();
            const token = sessionToken?.user.accessToken 
            if (token) {
                const response = await axios.post(apiEndpoints[selectedStatus], 
                    {   
                        status: selectedStatus 
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type":'application/json'
                        },
                    }
                );
                setSuccessMessage(response.data);
            }
            return;
        } catch (error) {
            setError(`Error updating booking status: ${error || "Something went wrong."}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                router.back(); 
            }, 1500); 

            return () => clearTimeout(timer); 
        }
    }, [router, successMessage]);

    const handleCancel = () => {
        setSelectedStatus(null);
        setError(null);
        setSuccessMessage(null);
        router.back();
    };

    return (
        <div className="pt-5 space-y-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/bookings">Bookings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              ... {} {}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Set Booking Status</CardTitle>
          <CardDescription>
            You are setting the status for{" "}
            <strong>
              {} {}
            </strong>{" "}
            (Plate No: <strong>{plates}</strong>).
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-5">
            <RadioGroup
              value={selectedStatus || ""}
              onValueChange={(status) => {
                setSelectedStatus(status);
                setError(null); 
              }}
            >
              {allStatus.map((status, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={`status-${idx}`} />
                  <Label htmlFor={`status-${idx}`}>{status}</Label>
                </div>
              ))}
            </RadioGroup>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert variant="default">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div>
              <CardFooter className="flex justify-between">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Status"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              </CardFooter>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    );
}
 
export default BookingStatusPage;