import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Account = () => {
    return ( 
        <div className="h-screen w-full pt-5">
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="text-sm font-normal text-gray-500 pb-4">Update your account settings. Set your preferred language and timezone.</p>
            <Separator />    

            <p className="text-md font-normal pt-5 pb-2">Name</p>
            <Input className="outline-none" placeholder="Your name"/>
            <p className="text-sm font-normal text-gray-500 pt-2">This is the name that will be displayed on your profile and in emails.</p>

            <div className="pt-8 flex flex-row gap-10 w-fit">
                <Button type="submit">Update account</Button>
                <Button type="submit" variant="destructive">Cancel</Button>
            </div>
        </div>
    );
}
 
export default Account;