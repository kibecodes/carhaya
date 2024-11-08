"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { FiImage } from "react-icons/fi";
import { TfiTrash } from "react-icons/tfi";
import Image from "next/image";
import axios from "axios";
import { getSession } from "next-auth/react";
import { BsExclamationTriangle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
import { Alert, AlertTitle } from "@/components/ui/alert";
import { VehicleSchema } from "@/schemas";
import Compressor from "compressorjs";

const NewFleetVehicle = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isFormDisabled, setFormDisabled] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    const [images, setImages] = useState({
        vehicleFrontImage: null as File | null,
        vehicleFrontImageURL: null as string | null,
        vehicleSideImage: null as File | null,
        vehicleSideImageURL: null as string | null,
        vehicleBackImage: null as File | null,
        vehicleBackImageURL: null as string | null,
        vehicleInteriorFrontImage: null as File | null,
        vehicleInteriorFrontImageURL: null as string | null,
        vehicleInteriorBackImage: null as File | null,
        vehicleInteriorBackImageURL: null as string | null,
    });

    const form = useForm<z.infer<typeof VehicleSchema>>({
        resolver: zodResolver(VehicleSchema),
        defaultValues: {
            vehicleType: "",
            vehiclePlateNumber: "",
            vehicleMake: "",
            vehicleColor: "",
            vehicleEngineCapacity: "",
            vehicleSeatsCapacity: "",
            vehicleYearOfManufacture: "",
            vehicleBodyType: "",
            vehicleMillage: "",
            vehicleFrontImage: null,
            vehicleSideImage: null,
            vehicleBackImage: null,
            vehicleInteriorFrontImage: null,
            vehicleInteriorBackImage: null,
            unitCostPerDay: 0,
            agencyName: "",
        },
    });
    
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const compressImage = (file: File, quality = 0.7, maxSize = 400 * 1024): Promise<File> => {
        return new Promise((resolve, reject) => {
            const compress = (currentQuality: number) => {
                new Compressor(file, {
                    quality: currentQuality,
                    success(result: Blob) {
                        const compressedFile = new File([result], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });

                        // Check if the file size is under the max size (400 KB)
                        if (compressedFile.size <= maxSize || currentQuality <= 0.1) {
                            resolve(compressedFile);
                        } else {
                            // If the file is still too large, recursively try again with reduced quality
                            compress(currentQuality - 0.1);
                        }
                    },
                    error(err) {
                        reject(err);
                    },
                });
            };

            // Start compression with the initial quality
            compress(quality);
        });
    };


    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        imageType: keyof typeof images
    ) => {
        setFormDisabled(true);
        startTransition(async() => {
            const file = e.target.files?.[0];
            if (file) {
                const compressedFile = await compressImage(file, 0.6);
                const base64 = await convertToBase64(compressedFile);
    
                const formData = new FormData();
                formData.append("image", base64);
    
                try {
                    const response = await axios.post("https://bucket.transfa.org/files/single_image.php", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
    
                    if (response.status === 200 || response.status === 201) {
                        const imageUrl = response.data.url;
                        setImages((prev) => ({
                            ...prev,
                            [imageType]: compressedFile,
                            [`${imageType}URL`]: imageUrl,
                        }));
    
                    } else {
                        console.log("Unexpected response:", response);
                        setError("Failed to upload image. Please try again.");
                    }
                } catch (error) {
                    console.error("Image upload failed:", error);
                    if (axios.isAxiosError(error)) {
                        console.error("Error details:", error.response?.data);
                        setError("Failed to upload image. Please try again.");
                    } else {
                        setError("An unexpected error occurred. Please try again.");
                    }
                } finally {
                    setFormDisabled(false);
                }
            }
            return;
        });
    };

    const removeImage = (imageType: keyof typeof images) => {
        setImages((prev) => ({
            ...prev,
            [imageType]: null,
            [`${imageType}URL`]: null,
        }));
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

    function onSubmit(values: z.infer<typeof VehicleSchema>) {
      const validatedFields = VehicleSchema.safeParse(values);

      if (!validatedFields.success) {
        return { error: "Invalid Fields!" }
      }

      let validatedData = validatedFields.data;

        validatedData = {
            ...values,
            vehicleFrontImage: images.vehicleFrontImageURL,
            vehicleSideImage: images.vehicleSideImageURL,
            vehicleBackImage: images.vehicleBackImageURL,
            vehicleInteriorFrontImage: images.vehicleInteriorFrontImageURL,
            vehicleInteriorBackImage: images.vehicleInteriorBackImageURL,
        };

      startTransition(async () => {
        setFormDisabled(true);

        try {
          const sessionToken = await getSession()
          const token = sessionToken?.user.accessToken;
  
          if (token){
            const response = await axios.post(`https://carhire.transfa.org/api/vehicles/create`, 
                validatedData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
              }
            );
  
            if (response.status === 201) {
              setSuccess("Vehicle added successfully!");
              form.reset();
              setImages({
                    vehicleFrontImage: null,
                    vehicleFrontImageURL: null,
                    vehicleSideImage: null,
                    vehicleSideImageURL: null,
                    vehicleBackImage: null,
                    vehicleBackImageURL: null,
                    vehicleInteriorFrontImage: null,
                    vehicleInteriorFrontImageURL: null,
                    vehicleInteriorBackImage: null,
                    vehicleInteriorBackImageURL: null,
                });
              console.log('response data', response.data);
            } else {
              setError("Vehicle upload failed. Please try again.");
            }  
          }
        } catch (error) {
          handleAxiosError(error);
        } finally {
          setFormDisabled(false);
        }
      });
    }

    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("Error response from server:", error.response.data);
                alert(`Vehicle upload failed: ${error.response.data.message}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("Vehicle upload failed: No response from server. Please try again later.");
            } else {
                console.error("Error in setup:", error.message);
                alert(`Vehicle upload failed: ${error.message}`);
            }
        } else {
            console.error("Unexpected error:", error);
            alert("Vehicle upload failed: An unexpected error occurred. Please try again.");
        }
    };

    const handelCancel = () => {
        form.reset();
        setImages({
            vehicleFrontImage: null,
            vehicleFrontImageURL: null,
            vehicleSideImage: null,
            vehicleSideImageURL: null,
            vehicleBackImage: null,
            vehicleBackImageURL: null,
            vehicleInteriorFrontImage: null,
            vehicleInteriorFrontImageURL: null,
            vehicleInteriorBackImage: null,
            vehicleInteriorBackImageURL: null,
        });
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
                    <CardTitle>Add new fleet vehicle</CardTitle>
                    <CardDescription>Fill in vehicle details and upload pictures.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-3 gap-5">
                                <FormField
                                    control={form.control}
                                    name="vehicleMake"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Make</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Toyota, Mercedes ..." 
                                                    {...field} 
                                                    disabled={isFormDisabled}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleType"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Civic, C-Class ..." 
                                                {...field} 
                                                disabled={isFormDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleYearOfManufacture"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Year of Manufacture</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="2020" 
                                                {...field} 
                                                disabled={isFormDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehiclePlateNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Plate Number</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="KAA123" 
                                                {...field} 
                                                disabled={isFormDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleColor"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="black, white, gray ..." 
                                                {...field} 
                                                disabled={isFormDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleBodyType"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Body Type</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="sedan, SUV ..." 
                                                {...field} 
                                                disabled={isFormDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleSeatsCapacity"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Seats Capacity</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="5,6,7 ..." 
                                                {...field} 
                                                disabled={isFormDisabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleMillage"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Mileage</FormLabel>
                                        <FormControl>
                                            <Input placeholder="total miles/kms driven" {...field}  disabled={isFormDisabled} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleEngineCapacity"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Engine Capacity</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2000cc ..." {...field} disabled={isFormDisabled}/>
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
                                                placeholder="$55 Per Day" 
                                                {...field} 
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                disabled={isFormDisabled}
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
                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="vehicleFrontImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Front</FormLabel>
                                            {!images.vehicleFrontImage ? (
                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <label
                                                            htmlFor="front-image-upload"
                                                            className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition"
                                                        >
                                                        <FiImage size={40} className="text-gray-500 mb-3" />
                                                        <span className="text-gray-500 text-sm">Upload Front Image</span>
                                                        </label>
                                                        <Input
                                                            id="front-image-upload"
                                                            type="file"
                                                            onChange={(e) => handleImageUpload(e, "vehicleFrontImage")}
                                                            accept="image/*"
                                                            className="hidden"
                                                            name={field.name}
                                                            ref={field.ref}
                                                            disabled={isFormDisabled}
                                                        />
                                                    </div>
                                                </FormControl>
                                            ) : (
                                                <div className="relative group">
                                                    {images.vehicleFrontImageURL && (
                                                        <>
                                                            <Image 
                                                                src={images.vehicleFrontImageURL} 
                                                                alt="Front Image" 
                                                                width={150} 
                                                                height={150} 
                                                                className="w-full h-50 object-contain rounded-md" 
                                                            />
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm" 
                                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                                                                onClick={() => removeImage("vehicleFrontImage")}>
                                                                <TfiTrash size={18} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}                             
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="vehicleSideImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Side</FormLabel>
                                            {!images.vehicleSideImage ? (
                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <label htmlFor="side-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                            <FiImage size={40} className="text-gray-500 mb-3" />
                                                            <span className="text-gray-500 text-sm">Upload Side Image</span>
                                                        </label>
                                                        <Input
                                                            id="side-image-upload"
                                                            type="file"
                                                            onChange={(e) => handleImageUpload(e, "vehicleSideImage")}
                                                            accept="image/*"
                                                            className="hidden"
                                                            name={field.name}
                                                            ref={field.ref}
                                                            disabled={isFormDisabled}
                                                        />
                                                    </div>
                                                </FormControl>
                                            ) : (
                                                <div className="relative group">
                                                    {images.vehicleSideImageURL && (
                                                        <>
                                                            <Image src={images.vehicleSideImageURL} alt="Side Image" width={150} height={150} className="w-full h-50 object-contain rounded-md" />
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm" 
                                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                                                                onClick={() => removeImage("vehicleSideImage")}>
                                                                <TfiTrash size={18} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="vehicleBackImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Back</FormLabel>
                                            {!images.vehicleBackImage ? (
                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <label htmlFor="back-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                            <FiImage size={40} className="text-gray-500 mb-3" />
                                                            <span className="text-gray-500 text-sm">Upload Back Image</span>
                                                        </label>
                                                        <Input
                                                            id="back-image-upload"
                                                            type="file"
                                                            onChange={(e) => handleImageUpload(e, "vehicleBackImage")}
                                                            accept="image/*"
                                                            className="hidden"
                                                            name={field.name}
                                                            ref={field.ref}
                                                            disabled={isFormDisabled}
                                                        />
                                                    </div>
                                                </FormControl>
                                            ) : (
                                                <div className="relative group">
                                                    {images.vehicleBackImageURL && (
                                                        <>
                                                            <Image src={images.vehicleBackImageURL} alt="Back Image" width={150} height={150} className="w-full h-50 object-contain rounded-md" />
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm" 
                                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                                                                onClick={() => removeImage("vehicleBackImage")}>
                                                            <TfiTrash size={18} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="vehicleInteriorFrontImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Front Interior</FormLabel>
                                            {!images.vehicleInteriorFrontImage ? (
                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <label htmlFor="front-interior-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                            <FiImage size={40} className="text-gray-500 mb-3" />
                                                            <span className="text-gray-500 text-sm">Upload Front Interior Image</span>
                                                        </label>
                                                        <Input
                                                            id="front-interior-image-upload"
                                                            type="file"
                                                            onChange={(e) => handleImageUpload(e, "vehicleInteriorFrontImage")}
                                                            accept="image/*"
                                                            className="hidden"
                                                            name={field.name}
                                                            ref={field.ref}
                                                            disabled={isFormDisabled}
                                                        />
                                                    </div>
                                                </FormControl>
                                            ) : (
                                                <div className="relative group">
                                                    {images.vehicleInteriorFrontImageURL && (
                                                        <>
                                                            <Image 
                                                                src={images.vehicleInteriorFrontImageURL} 
                                                                alt="Front Interior Image" 
                                                                width={150} 
                                                                height={150} 
                                                                className="w-full h-50 object-contain rounded-md" 
                                                            />
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm" 
                                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                                                                onClick={() => removeImage("vehicleInteriorFrontImage")}>
                                                            <TfiTrash size={18} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="vehicleInteriorBackImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Back Interior</FormLabel>
                                            {!images.vehicleInteriorBackImage ? (
                                                <>
                                                    <FormControl>
                                                        <div className="flex flex-col items-center justify-center">
                                                            <label htmlFor="back-interior-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                                <FiImage size={40} className="text-gray-500 mb-3" />
                                                                <span className="text-gray-500 text-sm">Upload Back Interior Image</span>
                                                            </label>
                                                            <Input
                                                                id="back-interior-image-upload"
                                                                type="file"
                                                                onChange={(e) => handleImageUpload(e, "vehicleInteriorBackImage")}
                                                                accept="image/*"
                                                                className="hidden"
                                                                name={field.name}
                                                                ref={field.ref}
                                                                disabled={isFormDisabled}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                </>
                                            ) : (
                                                <div className="relative group">
                                                    {images.vehicleInteriorBackImageURL && (
                                                        <>
                                                            <Image 
                                                                src={images.vehicleInteriorBackImageURL} 
                                                                alt="Back Interior Image" 
                                                                width={150} 
                                                                height={150} 
                                                                className="w-full h-50 object-contain rounded-md" 
                                                            />
                                                            <Button 
                                                                variant="destructive" 
                                                                size="sm" 
                                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                                                                onClick={() => removeImage("vehicleInteriorBackImage")}>
                                                                    <TfiTrash size={18} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button 
                        type="submit" 
                        variant="default" 
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isFormDisabled || isPending}
                    >
                        {isFormDisabled || isPending ? "Submitting..." : "Submit"}
                    </Button>
                    <Button 
                        variant="destructive"
                        onClick={handelCancel}
                    >Cancel
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
 
export default NewFleetVehicle;