"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
 
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
 
const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
})


const Profile = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

    return ( 
      <>
        <div className="w-full h-screen pt-5">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-sm font-normal text-gray-500 pb-4">This is how your details will appear in the site.</p>
            <Separator />

            <p className="text-md font-normal pt-5 pb-2">Username</p>
            <Input className="outline-none" placeholder="Your username"/>
            <p className="text-sm font-normal text-gray-500 pt-2">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 pt-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md font-normal">Email</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="m@example.com">m@example.com</SelectItem>
                                <SelectItem value="m@google.com">m@google.com</SelectItem>
                                <SelectItem value="m@support.com">m@support.com</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            You can manage email addresses in your{" "}
                            <Link href="/examples/forms">email settings</Link>.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
              />
              <div className="pt-8 flex flex-row gap-10 w-fit">
                <Button type="submit">Submit</Button>
                <Button type="submit" variant="destructive">Cancel</Button>
              </div>
            </form>
          </Form>
        </div>    
      </>
    );
}
 
export default Profile;