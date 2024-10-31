'use client';

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input"
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoginSchema } from "@/schemas";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { BsExclamationTriangle } from "react-icons/bs";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Spinner icon


const LoginPage = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isFormDisabled, setFormDisabled] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError("");
                setSuccess("");
            }, 2000); 

            return () => clearTimeout(timer); 
        }
    }, [error, success]);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) {
        setError("")
        setSuccess("")

        try {
            startTransition(() => {
                setFormDisabled(true);
                signIn("credentials", {
                    email: values.email,
                    password: values.password,
                    redirectTo: DEFAULT_LOGIN_REDIRECT, 
                })
                .then((result) => {
                    if (result?.error) {
                        setError(result.error);
                    } else {
                        setSuccess("Login successful!")
                        form.reset();
                    }
                })
                .catch((error) => console.log("signIn error", error));
            });
        } catch (error) {
            console.log("error", error);
        } finally {
            setFormDisabled(false);
        }
    }

    return (
        <>
            {isPending && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
                </div>

            )}
            <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your email below to login into your account</CardDescription>
                </CardHeader>
            
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email/Phone</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Email or Phone" 
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="****" 
                                            {...field} 
                                            disabled={isFormDisabled}
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
                            
                            <Button 
                                type="submit"
                                disabled={isFormDisabled || isPending}
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardContent>
                    <div className="flex items-center mb-5">
                        <div className="border-t border-gray-300 flex-grow"></div>
                        <span className="mx-4 text-gray-500">OR CONTINUE WITH</span>
                        <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full gap-4">
                        <Button 
                            variant="outline"
                            className="w-full text-black"
                        >
                            <FaGoogle className="w-5 h-5" />
                            <h2 className="font-semibold pl-2">Google</h2>
                        </Button>
                        <Button 
                            variant="outline"
                            className="w-full text-black"
                        >
                            <FaFacebook className="w-5 h-5" />
                            <h2 className="font-semibold pl-2">Facebook</h2>
                        </Button>
                    </div>
                </CardContent>

            </Card>
        </>

    );
}
 
export default LoginPage;