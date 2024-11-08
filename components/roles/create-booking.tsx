"use client";

import React, { useTransition, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import { DatePickerWithRange } from "@/utils/date-range-picker";
import { getSession } from "next-auth/react";
import axios from "axios";
import type { Booking, Vehicle } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";
import dayjs from "dayjs";

  const handleAxiosError = (error: unknown) => {
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
  };

const BookingCards = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending] = useTransition();
  const [data, setData] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVehicle(null);
  };

  useEffect(() => {
    const fetchActiveVehicles = async () => {
      try {
        const sessionToken = await getSession();
        const token = sessionToken?.user.accessToken;
        if (token) {
          const response = await axios.get('https://carhire.transfa.org/api/vehicles/active', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          if (response.status === 200) {
            setSuccess("Vehicles updated successfully!");
            const vehicles = response.data;
            setData(vehicles);
          } else {
            setError("Vehicles update failed! Try again later.");
          }
        }
        return;
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchActiveVehicles();
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

  const getStatusClassName = (vehicle: Vehicle) => {
    if (vehicle.isVehicleDeleted) return "bg-red-200"; 
    if (vehicle.isVehicleUnderMaintenance) return "bg-yellow-200"; 
    if (vehicle.isVehicleBooked) return "bg-red-300"; 
    if (vehicle.isVehicleActive) return "bg-green-200"; 
    return "bg-gray-200"; 
  };

  const checkVehicleAvailability = (vehicle: Vehicle) => {
    // TODO: Implement logic to check the vehicle's current bookings and determine when it will be free
    // This might involve comparing the current date with the booking's end date
    return null; 
  };

  // return (
  //   <div className="grid grid-cols-2 gap-10 p-5">
  //     {isPending && (
  //       <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  //         <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
  //       </div>
  //     )}
  //     {error && (
  //       <div className="fixed top-8 w-2/3 flex justify-center z-50">
  //         <Alert variant="destructive">
  //           <BsExclamationTriangle className="h-4 w-4"/>
  //           <AlertTitle>{error}</AlertTitle>
  //         </Alert>
  //       </div>
  //     )}
  //     {success && (
  //       <div className="fixed top-8 w-2/3 flex justify-center z-50">
  //         <Alert className="bg-green-400">
  //           <AlertTitle>{success}</AlertTitle>
  //         </Alert>
  //       </div>
  //     )}

  //     {data.map((vehicle) => (
  //       <div key={vehicle.id} className="cursor-pointer">
  //         <Drawer>
  //             <Card 
  //               className={`transition-transform duration-200 shadow-lg ${getStatusClassName(vehicle)}`} 
  //             >
  //           <DrawerTrigger asChild>
  //               <CardContent className="p-0">
  //                 <Image
  //                   src={vehicle.vehicleFrontImage}
  //                   alt={`${vehicle.vehicleMake} ${vehicle.vehicleType}`}
  //                   width={150}
  //                   height={150}
  //                   className="w-full h-80 object-cover rounded-none"
  //                 />
  //                 <CardFooter className="flex justify-center items-center">
  //                   <span>{ formatCurrency(vehicle.unitCostPerDay)} day</span>
  //                 </CardFooter>
  //               </CardContent>
  //           </DrawerTrigger>
  //             </Card>

  //           {selectedVehicle && (
  //           <DrawerContent className="w-full h-screen px-10 overflow-y-auto overflow-x-hidden">
  //               <DrawerHeader>
  //                 <DrawerTitle>{selectedVehicle.vehicleMake} {selectedVehicle.vehicleType}</DrawerTitle>
  //                 <DrawerDescription>{selectedVehicle.vehiclePlateNumber}</DrawerDescription>
  //               </DrawerHeader>
  //               <div className="grid grid-cols-2 gap-16">
  //                 <div>
  //                  carousel images**
  //                 </div>
    
  //                 <div>
  //                   <p className="text-gray-600 mb-4">Detailed description of the vehicle, including specifications, features, and terms.</p>
  //                   <ul className="space-y-2">
  //                     <strong>Availability:</strong> {getAvailabilityMessage(vehicle)}
  //                     {/* <li><strong>Availability:</strong> {getStatusClassName(vehicle)}</li> */}
  //                     <li><strong>Unit Cost Per Day:</strong> {formatCurrency(selectedVehicle.unitCostPerDay)}</li>
  //                     <li><strong>Total Cost:</strong> {formatCurrency(calculateTotalCost())}</li>
  //                     <li><strong>Specifications:</strong> Compact, 5-seater, SUV</li>
  //                     <li><strong>Features:</strong> GPS, air conditioning, USB charging ports</li>
  //                   </ul>
  //                   <div className="my-2">
  //                     <DatePickerWithRange 
  //                       className="mb-4"
  //                       onDateChange={(range) => {
  //                         if (range?.from) setStartDate(range.from);
  //                         if (range?.to) setEndDate(range.to);
  //                       }}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //               <DrawerFooter>
  //                 <Button onClick={handleBooking} variant="default">
  //                   Book Now
  //                 </Button>
  //                 <DrawerClose>
  //                   <Button variant="outline">Cancel</Button>
  //                 </DrawerClose>
  //               </DrawerFooter>
  //             </DrawerContent>
  //           )}
  //         </Drawer>
  //       </div>
  //     ))}
  //   </div>
  // );


  return (
    <div className="grid grid-cols-2 gap-10 p-5">
      <div className="cursor-pointer space-y-5">
        {data.map((vehicle) => (
          <Card key={vehicle.id} onClick={() => openDrawer(vehicle)} className="hover: shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription>{vehicle.vehicleMake} {vehicle.vehicleType}</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src={vehicle.vehicleFrontImage}
                width={150}
                height={150}
                alt="Vehicle Front Image"
                className="object-cover"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {isDrawerOpen && (
        <VehicleDrawer vehicle={selectedVehicle} onClose={closeDrawer}/> 
      )}
    </div>
  )
};


interface VehicleDrawerProps {
  vehicle: Vehicle | null;
  onClose: any;
}

const VehicleDrawer = ({ vehicle, onClose }: VehicleDrawerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");


  const calculateTotalCost = () => {
    if (!startDate || !endDate || !vehicle) return 0;
    const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    return days * vehicle.unitCostPerDay;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || !vehicle) {
      setError("Please select a date range and vehicle.");
      return;
    }

    try {
      const sessionToken = await getSession();
      const token = sessionToken?.user.accessToken;

      if (token) {
        const bookingData = {
          startDate,
          endDate,
          vehiclePlateNumber: vehicle?.vehiclePlateNumber,
          unitCostPerDay: vehicle?.unitCostPerDay,
          totalCost: calculateTotalCost(),
          agencyName: vehicle?.agencyName,
        };
        console.log("booking data", bookingData);

        const response = await axios.post('https://carhire.transfa.org/api/bookings/create', bookingData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.status === 201) {
          setSuccess("Booking successful!");
          // setSelectedVehicle(null);
        } else {
          setError("Booking failed. Please try again.");
        }
      }
      return;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-Kenya', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatToday = () => {
    return dayjs().format('MMMM D, YYYY'); 
  };

  const getAvailabilityMessage = (vehicle: Vehicle, booking?: Booking) => {
    if (vehicle.isVehicleActive) {
      return `Available for booking on ${formatToday()}`;
    } else if (vehicle.isVehicleBooked) {
      return `Currently booked until ${booking?.endDate}`; 
    } else if (vehicle.isVehicleUnderMaintenance) {
      return "Under maintenance; not available for booking.";
    } else if (vehicle.isVehicleDeleted) {
      return "This vehicle has been deleted.";
    } else if (!vehicle.isVehicleActive) {
      return "This vehicle is deactivated.";
    }
    return "Status unknown"; 
  };

  return (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="grid grid-cols-2 gap-4 max-h-[80h] overflow-y-auto p-4">
        <DrawerHeader>
          <DrawerTitle>{vehicle?.vehicleMake} {vehicle?.vehicleType}</DrawerTitle>
          <DrawerDescription>More details about the vehicle</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4">
          <Carousel orientation="horizontal">
            <CarouselContent>
              <CarouselItem key={`${vehicle?.id}-front`}>
                <Image
                  src={vehicle?.vehicleFrontImage ?? ""}
                  alt="Front View"
                  width={150}
                  height={150}
                  className="w-full h-60 object-contain rounded-lg"
                />
              </CarouselItem>
              <CarouselItem key={`${vehicle?.id}-side`}>
                <Image
                  src={vehicle?.vehicleSideImage ?? ""}
                  alt="Side View"
                  width={150}
                  height={150}
                  className="w-full h-60 object-contain rounded-lg"
                />
              </CarouselItem>
              <CarouselItem key={`${vehicle?.id}-back`}>
                <Image
                  src={vehicle?.vehicleBackImage ?? ""}
                  alt="Back View"
                  width={150}
                  height={150}
                  className="w-full h-60 object-contain rounded-lg"
                />
              </CarouselItem>
              <CarouselItem key={`${vehicle?.id}-interior-front`}>
                <Image
                  src={vehicle?.vehicleInteriorFrontImage ?? ""}
                  alt="Interior Front View"
                  width={150}
                  height={150}
                  className="w-full h-60 object-contain rounded-lg"
                />
              </CarouselItem>
              <CarouselItem key={`${vehicle?.id}-interior-back`}>
                <Image
                  src={vehicle?.vehicleInteriorBackImage ?? ""}
                  alt="Interior Back View"
                  width={150}
                  height={150}
                  className="w-full h-60 object-contain rounded-lg"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <DrawerFooter className="flex justify-end space-x-2">
            <Button onClick={handleBooking} variant="default">Book Now</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DrawerFooter>
        </div>

        <div>
          <DatePickerWithRange 
            className="mb-4"
            onDateChange={(range) => {
              if (range?.from) setStartDate(range.from);
              if (range?.to) setEndDate(range.to);
            }}
          />
          <ul className="space-y-2">
            <strong>Availability:</strong> {getAvailabilityMessage(vehicle!)}
            <li><strong>Unit Cost Per Day:</strong> {formatCurrency(vehicle?.unitCostPerDay ?? 0)}</li>
            <li><strong>Total Cost:</strong> {formatCurrency(calculateTotalCost())}</li>
            <li><strong>Specifications:</strong> Compact, 5-seater, SUV</li>
            <li><strong>Features:</strong> GPS, air conditioning, USB charging ports</li>
          </ul>
        </div>

      </DrawerContent>
    </Drawer>
  );
}


export default BookingCards;
