"use client"

import ThemeToggler from "./theme-toggler";
import { IoMenuSharp } from "react-icons/io5";
import { useSidebar } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  const handleLogout = async() => {
        
        await signOut({
            redirectTo: "/login"
        });
        
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");

    }

    return (
        <div 
            style={{ backgroundColor: "hsl(var(--chart-5))", color: 'black' }}
            className="flex justify-between items-center pl-0 pr-4 text-black outline-none p-1"
        >
            <div className="cursor-pointer" onClick={toggleSidebar}>
                <IoMenuSharp size={30}/>
            </div>
            <div className="flex items-center gap-5">
                <LogOut onClick={handleLogout} className="cursor-pointer"/>
                <ThemeToggler />
            </div>
        </div>

    )
}
 
export default Navbar;  