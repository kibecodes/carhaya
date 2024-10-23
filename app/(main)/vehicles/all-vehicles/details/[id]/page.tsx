"use client"

import { useState, useEffect } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import axios from "axios";
import { getSession } from "next-auth/react";
import { Vehicle } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";

export interface VehicleProps {
    params: {
        id: number;
    }
}

export const fetchVehicleById = async (id: number) => {
    try {
        const token = await getSession();
        if (token) {
            const response = await axios.get(`https://carhire.transfa.org/api/vehicles/getbyid/${id}`, {
                headers: {
                    Authorization: `Bearer ${token.user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });   

            if (response.status !== 200) {
                throw new Error("Failed to fetch vehicle");
            }
            return response.data;

        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Error response from server:', error.response.data);
                alert(`Fetching failed: ${error.response.data.message}`);
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
};

const VehicleDetails = ({ params }: VehicleProps) => {
    const [vehicle, setVehicle] = useState<Vehicle>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getVehicle = async() => {
            try {
                const data = await fetchVehicleById(params.id);

                if (data) {
                    const formattedUnitCost = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "KES",
                    }).format(data.unitCostPerDay);

                    const formattedData = {
                        ...data,
                        unitCostPerDay: formattedUnitCost,
                    };

                    setVehicle(formattedData);
                }
            } catch (error) {
                console.log("error", error);
            } finally {
                setLoading(false);
            }
        }

        getVehicle();
    }, [params.id]);

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
                        <BreadcrumbPage>Vehicle Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>{vehicle?.agencyName}</CardTitle>
                    <CardDescription>Vehicle Information</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-2">
                    <div className="col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Plate No. {vehicle?.vehiclePlateNumber}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Carousel>
                                    <CarouselContent>
                                            <CarouselItem className="p-5">
                                                <Image
                                                    key={`${vehicle?.id}-001`}
                                                    src={vehicle?.vehicleFrontImage ?? ""}
                                                    alt={`Vehicle Front Image`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-auto rounded-md object-cover"
                                                />
                                            </CarouselItem>
                                            <CarouselItem className="p-0">
                                                <Image
                                                    key={`${vehicle?.id}-001`}
                                                    src={vehicle?.vehicleBackImage ?? ""}
                                                    alt={`Vehicle Back Image`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-auto rounded-md object-cover"
                                                />
                                            </CarouselItem>
                                            <CarouselItem className="p-0">
                                                <Image
                                                    key={`${vehicle?.id}-001`}
                                                    src={vehicle?.vehicleSideImage ?? ""}
                                                    alt={`Vehicle Side Image`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-auto rounded-md object-cover"
                                                />
                                            </CarouselItem>
                                            <CarouselItem className="p-0">
                                                <Image
                                                    key={`${vehicle?.id}-001`}
                                                    src={vehicle?.vehicleInteriorFrontImage ?? ""}
                                                    alt={`Vehicle Front Interior Image`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-auto rounded-md object-cover"
                                                />
                                            </CarouselItem>
                                            <CarouselItem className="p-0">
                                                <Image
                                                    key={`${vehicle?.id}-001`}
                                                    src={vehicle?.vehicleInteriorBackImage ?? ""}
                                                    alt={`Vehicle Back Interior Image`}
                                                    width={150}
                                                    height={150}
                                                    className="w-full h-auto rounded-md object-cover"
                                                />
                                            </CarouselItem>
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </CardContent>
                        </Card>
                    </div> 

                    <div className="col-span-1 px-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Info</CardTitle>
                                <CardDescription>email: {}</CardDescription>
                                <CardDescription>address {}</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                                <CardDescription>Unit cost per day: {vehicle?.unitCostPerDay}</CardDescription>
                                <CardDescription>Payment Option: <span className="font-bold">M-Pesa</span></CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <div className="text-sm text-gray-500">Invoice #123456</div>
                            </CardFooter>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <div></div>
        </div>
    );
}
 
export default VehicleDetails;