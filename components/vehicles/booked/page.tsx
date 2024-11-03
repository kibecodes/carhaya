"use client"

import { useState, useEffect, useTransition } from "react";
import { columns } from "../components/columns";
import DataTable from "../components/data-table";
import axios from "axios";
import { getSession } from "next-auth/react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";
import type { Vehicle } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const BookedVehiclesPage = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [data, setData] = useState<Vehicle[]>([]);
    const [isPending, startTransition] = useTransition();

    const bookedColumns = columns(true, "booked-vehicles");

    const fetchBookedVehicles = () => {
        try {
            startTransition(async() => {
                const sessionToken = await getSession();
                const token = sessionToken?.user.accessToken;
                if (token) {
                    const response = await axios.get('https://carhire.transfa.org/api/vehicles/booked', 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                        }
                    );
    
                    if (response.status === 200) {  
                        setSuccess("Vehicles updated successfully!");
                        const vehicles = response.data;
                        setData(vehicles);
                        return vehicles;
                    } else {
                        setError("Vehicles update failed! Try again later.")
                    }
                }   
            })
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
    }

    useEffect(() => {
      fetchBookedVehicles();
    }, []);

    useEffect(() => {
      if (error || success) {
        const timer = setTimeout(() => {
          setError("");
          setSuccess("");
        }, 2000); 

        return () => clearTimeout(timer); 
      }
    }, [error, success]);

    return ( 
        <div className="container mx-auto">
            {isPending && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
                </div>
            )}
            {error && (
                <div className="fixed top-8 w-2/3 flex justify-center z-50">
                <Alert variant="destructive">
                    <BsExclamationTriangle className="h-4 w-4"/>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
                </div>
            )}
            {success && (
                <div className="fixed top-8 w-2/3 flex justify-center z-50">
                <Alert className="bg-green-400">
                    <AlertTitle>{success}</AlertTitle>
                </Alert>
                </div>
            )}
            <DataTable 
                columns={bookedColumns} 
                data={data} 
                title="Booked Vehicles"
                description=""
            />
        </div>
    );
}

export default BookedVehiclesPage;