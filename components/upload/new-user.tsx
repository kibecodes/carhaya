"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaFileUpload } from "react-icons/fa";
import { TfiTrash } from "react-icons/tfi";

const formSchema = z.object({
    name: z.string().min(2, { message: "First and last name required" }),  
    email: z.string().min(1, { message: "email required" }).email(),
    phone: z.string().min(1, { message: "Phone is required" })
    .refine((value) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone format
        return phoneRegex.test(value);
    }, { message: "Enter a valid phone number" }),
    nationalId: z.string().min(1, { message: "National ID is required" }),
    driversLicense: z.string().min(1, { message: "Driver's License is required" }),
    dob: z.date({ required_error: "A date of birth is required." }),  
});

const NewUserPage = () => {
    const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);     
    const [documentURLs, setDocumentURLs] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            nationalId: "",
            driversLicense: "",
        },
    });

    // Handle image upload and generate preview URLs
    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const selectedFiles = Array.from(files);
            setUploadedDocuments((prev) => [...prev, ...selectedFiles]);

            // Generate preview URLs
            const newImageURLs = selectedFiles.map((file) => URL.createObjectURL(file));
            setDocumentURLs((prev) => [...prev, ...newImageURLs]);
        }
    };

    // Remove an image from the preview
    const removeDocument = (index: number) => {
        const newUploadedDocuments = [...uploadedDocuments];
        const newDocumentURLs = [...documentURLs];

        newUploadedDocuments.splice(index, 1);
        newDocumentURLs.splice(index, 1);

        setUploadedDocuments(newUploadedDocuments);
        setDocumentURLs(newDocumentURLs);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return ( 
        <div className="pt-5">
            <Card>
                <CardHeader>
                    <CardTitle>Add new user</CardTitle>
                    <CardDescription>Fill in user details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Full name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="mail@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="nationalId"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>National ID</FormLabel>
                                        <FormControl>
                                        <Input placeholder="12345678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123456789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="driversLicense"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Driver&apos;s License</FormLabel>
                                        <FormControl>
                                        <Input placeholder="DL123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col pt-2">
                                            <FormLabel>Date of birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
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
                                                    disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Your date of birth is used to calculate your age.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                           <FormItem>
                                <FormLabel>Upload Documents</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col items-center justify-center">
                                        <label
                                            htmlFor="document-upload"
                                            className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <FaFileUpload size={40} className="text-gray-500 mb-3" />
                                            <span className="text-gray-500 text-sm">Upload Documents</span>
                                        </label>
                                        <input
                                            id="document-upload"
                                            type="file"
                                            multiple
                                            onChange={handleDocumentUpload}
                                            accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt,"
                                            className="hidden"
                                        />
                                    </div>
                                </FormControl>

                                {uploadedDocuments.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {uploadedDocuments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between w-full bg-gray-100 p-2 rounded-lg">
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="ml-2"
                                                    onClick={() => removeDocument(index)}
                                                >
                                                    <TfiTrash size={18} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {uploadedDocuments.length > 0 && (
                                    <FormMessage>{uploadedDocuments.length} document(s) selected.</FormMessage>
                                )}
                            </FormItem>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="gap-10">
                    <Button type="submit">Submit</Button>
                    <Button variant="destructive">Cancel</Button>
                </CardFooter>
            </Card>
        </div>

    );
}
 
export default NewUserPage;

