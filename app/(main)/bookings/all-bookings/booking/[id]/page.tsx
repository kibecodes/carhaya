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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios";
import { getSession } from "next-auth/react";
import { Booking } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { formatDataDates } from "@/utils";


interface BookingProps {
  params: {
    id: number;
  };
}

const fetchBookingById = async (id: number) => {
    try {
        const token = await getSession();
        if (token) {
            const response = await axios.get(`https://carhire.transfa.org/api/bookings/getbyid/${id}`, {
                headers: {
                    Authorization: `Bearer ${token.user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });   

            if (response.status !== 200) {
                throw new Error("Failed to fetch booking");
            }
            return response.data;

        }
    } catch (error) {
        console.log("Error", error);
    }
};

const BookingDetails = ({ params }: BookingProps) => {
    const [booking, setBooking] = useState<Booking>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBooking = async() => {
            try {
                let data = await fetchBookingById(params.id);

                if (data) {
                    data = formatDataDates(data);

                    const formattedTotalCost = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "KES",
                    }).format(data.totalCost);

                    const formattedData = {
                        ...data,
                        totalCost: formattedTotalCost,
                    };

                    setBooking(formattedData);
                }
            } catch (error) {
                console.log("error", error);
            } finally {
                setLoading(false);
            }
        }

        getBooking();
    }, [booking?.totalCost, params.id]);

    return (
         <div className="flex flex-col gap-5 pt-5">
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
                </div>
            )}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="">...</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Booking Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>{booking?.agencyName}</CardTitle>
                    <CardDescription>Booking Information</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 w-full md:grid-cols-2 gap-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehicle Hire Duration</CardTitle>
                            <CardDescription>Start: {booking?.startDate}</CardDescription>
                            <CardDescription>End: {booking?.endDate}</CardDescription>
                            <CardDescription>Duration: {booking?.duration} day(s)</CardDescription>
                            <CardDescription>Unit cost per day: {booking?.unitCostPerDay}</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Status: {booking?.paymentStatus}</CardTitle>
                            <CardDescription>Amount Due: {booking?.totalCost}</CardDescription>
                            <CardDescription>Payment Method: <span className="font-bold">M-Pesa</span></CardDescription>
                            <CardDescription className="text-sm text-gray-500">Invoice #123456</CardDescription>
                        </CardHeader>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
 
export default BookingDetails;