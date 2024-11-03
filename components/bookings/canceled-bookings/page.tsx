"use client"

import { useState, useEffect, useTransition } from "react";
import { getColumns } from "../components/columns";
import DataTable from "../components/data-table";
import axios from "axios";
import { getSession } from "next-auth/react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";
import { Booking } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDataArrayDates } from "@/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CanceledBookingsPage = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [data, setData] = useState<Booking[]>([]);
    const [tableColumn, setTableColumn] = useState<ColumnDef<Booking>[]>([]);
    const [isPending, startTransition] = useTransition();

    const fetchCanceledBookings = () => {
        try {
            startTransition(async() => {
                const sessionToken = await getSession();
                const token = sessionToken?.user.accessToken;
                if (token) {
                    const columns = getColumns(sessionToken?.user.role, false);
    
                    const response = await axios.get('https://carhire.transfa.org/api/bookings/cancelled', 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                        }
                    );
    
                    if (response.status === 200) {  
                        setSuccess("Bookings updated successfully!");
                        let bookings = response.data;
    
                        bookings = formatDataArrayDates(bookings);
    
                        setData(bookings);
                        setTableColumn(columns);
                    } else {
                        setError("Bookings update failed! Try again later.")
                    }
                }   
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 401) {
                        // Redirect to login page to get a new accessToken
                        console.error('Unauthorized (401) error. Redirecting to login.');
                        alert('Session expired. Redirecting to login page.');
                        window.location.href = '/'; // Redirect to login page
                    } else {
                        console.error('Error response from server:', error.response.data);
                        alert(`Fetching failed: ${error.response.data.message}`);
                    }
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('No response received:', error.request);
                    alert('Fetching failed: No response from server. Please try again later.');
                } else {
                    // Error setting up the request
                    console.error('Error in setup:', error.message);
                    alert(`Fetching failed: ${error.message}`);
                }
            } else {
                // Generic error (non-Axios)
                console.error('Unexpected error:', error);
                alert('Fetching failed: An unexpected error occurred. Please try again.');
            }
        } 
    }

    useEffect(() => {
      if (error || success) {
        const timer = setTimeout(() => {
          setError("");
          setSuccess("");
        }, 2000); 

        return () => clearTimeout(timer); 
      }
    }, [error, success]);

    useEffect(() => {
        fetchCanceledBookings();
    }, []);

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
                columns={tableColumn} 
                data={data} 
                title="Canceled Bookings"
                description=""
            />
        </div>
    );
}
 
export default CanceledBookingsPage;

