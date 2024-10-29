"use client";

import React, { useTransition, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
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
} from "@/components/ui/drawer";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import { DatePickerWithRange } from "@/utils/date-range-picker";
import { getSession } from "next-auth/react";
import axios from "axios";
import type { Vehicle } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";
import dayjs from "dayjs";

const BookingCards = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const calculateTotalCost = () => {
    if (!startDate || !endDate || !selectedVehicle) return 0;
    const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    return days * selectedVehicle.unitCostPerDay;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || !selectedVehicle) {
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
          vehiclePlateNumber: selectedVehicle.vehiclePlateNumber,
          unitCostPerDay: selectedVehicle.unitCostPerDay,
          totalCost: calculateTotalCost(),
          agencyName: selectedVehicle.agencyName,
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
          setSelectedVehicle(undefined);
        } else {
          setError("Booking failed. Please try again.");
        }
      }
      return;
    } catch (error) {
      handleAxiosError(error);
    }
  };

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
    <div className="grid grid-cols-2 gap-10 p-5">
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

      {data.map((vehicle) => (
        <div key={vehicle.id} className="cursor-pointer">
          <Card 
            className="transition-transform duration-200 shadow-lg hover:bg-pink-500" 
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <CardContent className="p-0">
              <Image
                src={vehicle.vehicleFrontImage}
                alt={`${vehicle.vehicleMake} ${vehicle.vehicleType}`}
                width={200}
                height={200}
                className="w-full h-96 object-cover rounded-lg"
              />
              <CardFooter className="flex justify-between items-center">
                <span>Availability: {vehicle.isVehicleActive}</span>
                <span>Cost: {vehicle.unitCostPerDay}</span>
              </CardFooter>
            </CardContent>
          </Card>

          {selectedVehicle && (
            <Drawer direction="right" open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(vehicle)}>
              <DrawerContent className="w-full h-screen px-10 overflow-y-auto overflow-x-hidden">
                <DrawerHeader>
                  <DrawerTitle>{selectedVehicle.vehicleMake} {selectedVehicle.vehicleType}</DrawerTitle>
                  <DrawerDescription>{selectedVehicle.vehiclePlateNumber}</DrawerDescription>
                </DrawerHeader>
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <Carousel orientation="horizontal">
                      <CarouselContent>
                        <CarouselItem key={selectedVehicle.id}>
                          <Image
                            src={selectedVehicle.vehicleFrontImage}
                            alt={`Carousel Image ${selectedVehicle.id + 1}`}
                            width={300}
                            height={400}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                        </CarouselItem>
                        <CarouselItem key={selectedVehicle.id}>
                          <Image
                            src={selectedVehicle.vehicleSideImage}
                            alt={`Carousel Image ${selectedVehicle.id + 1}`}
                            width={300}
                            height={400}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-4">Detailed description of the vehicle, including specifications, features, and terms.</p>
                    <ul className="space-y-2">
                      <li><strong>Availability:</strong> {selectedVehicle.isVehicleActive}</li>
                      <li><strong>Unit Cost Per Day:</strong> {selectedVehicle.unitCostPerDay}</li>
                      <li><strong>Total Cost:</strong> {}</li>
                      <li><strong>Specifications:</strong> Compact, 5-seater, SUV</li>
                      <li><strong>Features:</strong> GPS, air conditioning, USB charging ports</li>
                    </ul>
                    <div className="my-2">
                      <DatePickerWithRange 
                        className="mb-4"
                        onDateChange={(range) => {
                          if (range?.from) setStartDate(range.from);
                          if (range?.to) setEndDate(range.to);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <DrawerFooter className="flex justify-center gap-2">
                  <Button onClick={handleBooking} className="bg-pink-500">
                    Book Now
                  </Button>
                  <DrawerClose>Cancel</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingCards;
