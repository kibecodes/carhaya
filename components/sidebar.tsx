import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Link from "next/link";

const Sidebar = () => {
    return ( 
        <Command className="max-w-fill">
            <CommandList className="max-h-fit">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Dashboard">
                    <Link href="/">
                        <CommandItem>Home</CommandItem>
                    </Link>
                    <Link href="/dashboard/analytics">
                        <CommandItem>Analytics</CommandItem>
                    </Link>
                    <Link href="/dashboard/reports">
                        <CommandItem>Reports</CommandItem>
                    </Link>
                    <Link href="/dashboard/notifications">
                        <CommandItem>Notifications</CommandItem>
                    </Link>
                    <Link href="/dashboard/protrack">
                        <CommandItem>ProTrack</CommandItem>
                    </Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Vehicles">
                    <Link href="/vehicles/all-vehicles">
                        <CommandItem>All Vehicles</CommandItem>
                    </Link>
                    <Link href="/vehicles/active-vehicles">
                        <CommandItem>Active</CommandItem>
                    </Link>
                    <Link href="/vehicles/inactive-vehicles">
                        <CommandItem>Inactive</CommandItem>
                    </Link>
                    <Link href="/vehicles/maintenance">
                        <CommandItem>Under Maintenance</CommandItem>
                    </Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Bookings">
                    <Link href="/bookings/all-bookings">
                        <CommandItem>All Bookings</CommandItem>
                    </Link>
                    <Link href="/bookings/active-bookings">
                        <CommandItem>Active</CommandItem>
                    </Link>
                    <Link href="/bookings/completed-bookings">
                        <CommandItem>Completed</CommandItem>
                    </Link>
                    <Link href="/bookings/canceled-bookings">
                        <CommandItem>Canceled</CommandItem>
                    </Link>
                    <Link href="/bookings/deleted-bookings">
                        <CommandItem>Deleted</CommandItem>
                    </Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                    <Link href="/upload/fleet">
                        <CommandItem>Add Vehicle</CommandItem>
                    </Link>
                    <Link href="/book-car">
                        <CommandItem>Create Booking</CommandItem>
                    </Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Create Role & Agency">
                    <Link href="/agency">
                        <CommandItem>New Agency</CommandItem>
                    </Link>
                    <Link href="/roles">
                        <CommandItem>New Role</CommandItem>
                    </Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <Link href="/settings/profile">
                        <CommandItem>Profile</CommandItem>
                    </Link>
                    <Link href="/settings/account">
                        <CommandItem>Account</CommandItem>
                    </Link>
                </CommandGroup>
            </CommandList>
        </Command>

    );
}
 
export default Sidebar;