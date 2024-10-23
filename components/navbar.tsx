"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ThemeToggler from "./theme-toggler";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoMenuSharp } from "react-icons/io5";
import { signOut } from "next-auth/react";

const Navbar = () => {

    const handleLogout = async() => {
        
        await signOut({
            redirectTo: "/login"
        });
        
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");

    }

    return (
        <div className="flex justify-between items-center pl-0 pr-4 text-black outline-none dark:bg-gray-600 rounded-sm p-1">
            <div>
                <IoMenuSharp size={30}/>
            </div>
            <div className="flex items-center">
                <ThemeToggler />
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback className="text-black">BT</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
            
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href='/profile'>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

    )
}
 
export default Navbar;  