"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, differenceInCalendarDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingSchema } from "@/schemas"; 
import axios from "axios";
import { getSession } from "next-auth/react";
import { BsExclamationTriangle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Spinner icon

const RentCarForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isFormDisabled, setFormDisabled] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof BookingSchema>>({
      resolver: zodResolver(BookingSchema),
      defaultValues: {
        startDate: undefined,
        endDate: undefined,
        vehiclePlateNumber: "",
        unitCostPerDay: undefined,
        totalCost: undefined,
        agencyName: "",
      },
    });

    const calculateTotalCost = () => {
    const { startDate, endDate, unitCostPerDay } = form.getValues();

    if (startDate && endDate && unitCostPerDay) {
      const numberOfDays = differenceInCalendarDays(new Date(endDate), new Date(startDate));

      if (numberOfDays >= 0) {
        const totalCost = numberOfDays * unitCostPerDay;
        form.setValue("totalCost", totalCost); 
      } else {
        form.setValue("totalCost", 0); 
      }
    } else {
      form.setValue("totalCost", 0);
    }
  };

    useEffect(() => {
      calculateTotalCost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch("startDate"), form.watch("endDate"), form.watch("unitCostPerDay")]);

    useEffect(() => {
      if (error || success) {
        const timer = setTimeout(() => {
          setError("");
          setSuccess("");
        }, 2000); 

        return () => clearTimeout(timer); 
      }
    }, [error, success]);

    function onSubmit(values: z.infer<typeof BookingSchema>) {
      const validatedFields = BookingSchema.safeParse(values);

      if (!validatedFields) {
        return { error: "Invalid Fields!" }
      }

      startTransition(async () => {
        setFormDisabled(true);

        try {
          const sessionToken = await getSession()
          const token = sessionToken?.user.accessToken;
  
          if (token){
            const response = await axios.post(`https://carhire.transfa.org/api/bookings/create`, 
              validatedFields.data,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
              }
            );
  
            if (response.status === 201) {
              setSuccess("Booking successfully created!");
              form.reset();
            } else {
              setError("Booking failed. Please try again.");
            }  
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error('Error response from server:', error.response.data);
              alert(`Booking failed: ${error.response.data.message}`);
            } else if (error.request) {
              // Request was made but no response received
              console.error('No response received:', error.request);
              alert('Booking failed: No response from server. Please try again later.');
            } else {
              // Error setting up the request
              console.error('Error in setup:', error.message);
              alert(`Booking failed: ${error.message}`);
            }
          } else {
            // Generic error (non-Axios)
            console.error('Unexpected error:', error);
            alert('Booking failed: An unexpected error occurred. Please try again.');
          }
        } finally {
          setFormDisabled(false);
        }
      });
    }

    const handleClear = () => {
      form.reset();
    }

  return (
    <div className="pt-5">
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
      
      <Card>
        <CardHeader>
          <CardTitle>Apply for a Rental Car</CardTitle>
          <CardDescription>Fill in the required details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isFormDisabled}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isFormDisabled}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehiclePlateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Plate Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ABC123" 
                          disabled={isFormDisabled}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitCostPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Cost Per Day</FormLabel>
                      <FormControl>
                        <Input 
                            type="number"
                            placeholder="100" 
                            disabled={isFormDisabled}
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber)
                              calculateTotalCost();
                            }}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Cost</FormLabel>
                      <FormControl>
                        <Input 
                            {...field} 
                            value={field.value ? field.value.toString() : ""}
                            placeholder="Total Cost" 
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Agency Name" 
                          {...field} 
                          disabled={isFormDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                variant="default" 
                className="mt-4"
                disabled={isFormDisabled || isPending}
              >
                Submit
              </Button>

            </form>
            <div className="flex w-full justify-end">
              <Button 
                onClick={handleClear}
                variant="destructive"
                className="mt-0"
              >Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentCarForm;
