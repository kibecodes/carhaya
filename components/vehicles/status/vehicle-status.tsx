"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert component
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const allStatus = ["activate", "deactivate", "maintenance"];

const VehicleStatusPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const vehicleId = Number(id);
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const plateNumber = searchParams.get("plateNumber");

  const apiEndpoints: { [key: string]: string } = {
    activate: `https://carhire.transfa.org/api/vehicles/activate?id=${vehicleId}`, 
    deactivate: `https://carhire.transfa.org/api/vehicles/deactivate?id=${vehicleId}`,
    maintenance: `https://carhire.transfa.org/api/vehicles/maintenance?id=${vehicleId}`,
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
            status: selectedStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );
        setSuccessMessage(response.data);
      }
      return;
    } catch (error: unknown) {
      setError(`Error updating vehicle status: ${error || "Something went wrong."}`);
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
            <BreadcrumbLink href="/pages/vehicles">Vehicles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              ... {model} {make}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Set Vehicle Status</CardTitle>
          <CardDescription>
            You are setting the status for{" "}
            <strong>
              {model} {make}
            </strong>{" "}
            (Plate No: <strong>{plateNumber}</strong>).
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
                  {isSubmitting ? "Submitting..." : "Update Status"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              </CardFooter>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleStatusPage;
