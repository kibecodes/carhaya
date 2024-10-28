'use client';

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Terminal } from "lucide-react"
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input"
import { BsExclamationTriangle } from "react-icons/bs";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RegisterSchema } from "@/schemas";

const CreateAgencyPage = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            location: "",
        },
    });

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError("");
                setSuccess("");
            }, 2000); 

            return () => clearTimeout(timer); 
        }
    }, [error, success]);

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setError("")
        setSuccess("")

        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields) {
            return { error: "Invalid fields!" };
        }

        startTransition(() => {
            
        });
    }

    return (
        <Card className="max-h-[600px]">
            <CardHeader>
                <CardTitle>Create Agency Account</CardTitle>
                <CardDescription>Enter your details below to create account.</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Agency Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="ABC Motors" 
                                        {...field} 
                                        disabled={isPending}
                                    />
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
                                    <Input 
                                        placeholder="mail@example.com" 
                                        {...field} 
                                        disabled={isPending}
                                    />
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
                                <FormLabel>Business Phone</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="123456789" 
                                        {...field} 
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office Location</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="123rd Street" 
                                            {...field} 
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {error && (
                            <Alert variant="destructive">
                                <BsExclamationTriangle className="h-4 w-4"/>
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="bg-green-400">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>{success}</AlertTitle>
                            </Alert>
                        )}

                        <CardFooter className="pl-0 pt-2">
                            <Button 
                                type="submit"
                            >
                                Submit
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>

    );
}

export default CreateAgencyPage;