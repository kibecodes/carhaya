'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newPassword } from '@/actions/new-password';
import { useTransition, useState } from 'react';
import { Terminal } from "lucide-react"
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export const NewPasswordSchema = z.object({
  password: z.string().min(4, { message: "Minimum of 4 characters required" }),
});

const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>(''); 
    const [success, setSuccess] = useState<string | undefined>(''); 
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        },
    });

    const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {        
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values, token)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
            .then(() => form.reset())
            .catch((error: unknown) => console.log('error', error));
        });
    }

    return ( 
        <Card>
            <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Enter a new password</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                            placeholder="****" 
                                            type="password"
                                            {...field}
                                            disabled={isPending}
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            disabled={isPending} 
                            type='submit' 
                            className='w-full' 
                            variant="default"
                        >Reset password</Button>
                    </form>
                </Form>
                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle className='text-red-400'>{error}</AlertTitle>
                    </Alert>
                )}
                {success && (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle className='text-green-400'>{success}</AlertTitle>
                    </Alert>
                )}

                <Button 
                    className='w-full pt-5' 
                    variant="link"
                >
                    <Link href="/auth">back to login</Link>
                </Button>
            </CardContent>
           
        </Card>
    );
}
 
export default NewPasswordForm;