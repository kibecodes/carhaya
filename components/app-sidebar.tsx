"use client"

import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";
import { Home, Settings, CarFront, FolderOpen, Bell, AudioWaveform, CarIcon, Library, Book, ClipboardPlus, UserRoundCog, ChartArea, BookPlus, LucideProps, Hammer } from "lucide-react"
import { IoChevronForward, IoChevronDown } from "react-icons/io5"; 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { usePathname } from "next/navigation";

interface SubMenuItem {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

interface MenuItem {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    open: boolean;
    submenu: SubMenuItem[];
}

interface MenuState {
  bookings: MenuItem[];
  vehicles: MenuItem[];
  actions: MenuItem[];
}

const dashboard: SubMenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartArea,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FolderOpen,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "ProTrack",
    url: "/dashboard/protrack",
    icon: AudioWaveform,
  },
]

const vehicles: MenuItem[] = [
    {
        title: "All Vehicles",
        url: "/vehicles/all-vehicles",
        icon: CarFront,
        open: false,
        submenu: [
            {
                title: "Active",
                url: "/vehicles/active-vehicles",
                icon: CarIcon,
            },
            {
                title: "Inactive",
                url: "/vehicles/inactive-vehicles",
                icon: CarIcon,
            },
            {
                title: "Deleted",
                url: "/vehicles/deleted-vehicles",
                icon: CarIcon,
            },
            {
                title: "Under Maintenance",
                url: "/vehicles/maintenance",
                icon: CarIcon,
            },
        ]
    },
]

const bookingsData: MenuItem[] = [
  {
    title: "All Bookings",
    url: "/bookings/all-bookings",
    icon: Library,
    open: false,
    submenu: [
      {
        title: "Active",
        url: "/bookings/active-bookings",
        icon: Book,
      },
      {
        title: "Completed",
        url: "/bookings/completed-bookings",
        icon: Book,
      },
      {
        title: "Canceled",
        url: "/bookings/canceled-bookings",
        icon: Book,
      },
      {
        title: "Deleted",
        url: "/bookings/deleted-bookings",
        icon: Book,
      },
    ],
  },
];

const actionStuff: MenuItem[] = [
    {
        title: "New Action",
        url: "#",
        icon: Hammer,
        open: false,
        submenu: [
            {
                title: "Add Vehicle",
                url: "/upload/fleet",
                icon: BookPlus,
            },
            {
                title: "Create Booking",
                url: "/book-car",
                icon: BookPlus,
            },
            {
                title: "New Agency",
                url: "/agency",
                icon: ClipboardPlus,
            },
            {
                title: "New Role",
                url: "/roles",
                icon: ClipboardPlus,
            },
        ]
    },
]

const settings: SubMenuItem[] = [
    {
        title: "Profile",
        url: "/settings/profile",
        icon: Settings,
    },
    {
        title: "Account",
        url: "/settings/account",
        icon: UserRoundCog,
    },
]

export function AppSidebar() {
  const [menuState, setMenuState] = useState<MenuState>({
    bookings: bookingsData.map((item) => ({ ...item, open: false })),
    vehicles: vehicles.map((item) => ({ ...item, open: false })),
    actions: actionStuff.map((item) => ({ ...item, open: false })),
  });

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const pathname = usePathname(); 

  const toggleOpen = (section: "bookings" | "vehicles" | "actions", index: number) => {
    setMenuState((prevState) => ({
      ...prevState,
      [section]: prevState[section].map((item, i) =>
        i === index ? { ...item, open: !item.open } : item
      ),
    }));
  };

  useEffect(() => {
    const currentMenu = dashboard.find(item => item.url === pathname) 
        || bookingsData.flatMap(item => item.submenu).find(subItem => subItem.url === pathname)
        || vehicles.flatMap(item => item.submenu).find(subItem => subItem.url === pathname) 
        || actionStuff.flatMap(item => item.submenu).find(subItem => subItem.url === pathname)

        if (currentMenu) {
            setActiveItem(currentMenu.url);
        }
        
  }, [pathname]);

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
            <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback className="text-black">BT</AvatarFallback>
            </Avatar>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {dashboard.map((item) => (
                        <SidebarMenuItem key={item.title} className={pathname === item.url ? "bg-pink-500 text-white" : ""}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>

            <SidebarGroupLabel>Vehicles</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {menuState.vehicles.map((item, index) => (
                        <SidebarMenuItem key={item.title}>
                        <Collapsible open={item.open} className="group/collapsible">
                            <CollapsibleTrigger asChild>
                            <SidebarMenuButton asChild>
                                <div
                                    className="flex items-center cursor-pointer justify-between w-full"
                                    onClick={() => toggleOpen("vehicles", index)}
                                >
                                    <div className="flex items-center">
                                        <item.icon />
                                        <span className="ml-2">{item.title}</span>
                                    </div>
                                    <div className="mr-2">
                                        {item.open ? <IoChevronDown /> : <IoChevronForward />}
                                    </div>
                                </div>
                            </SidebarMenuButton>
                            </CollapsibleTrigger>
                            {item.submenu && (
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                {item.submenu.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title} className={pathname === subItem.url ? "bg-pink-500 text-white" : ""}>
                                    <SidebarMenuSubButton asChild>
                                        <a href={subItem.url} className="flex items-center pl-0">
                                            <subItem.icon />
                                            <span className="ml-2">{subItem.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                            )}
                        </Collapsible>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>

                <SidebarGroupLabel>Bookings</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {menuState.bookings.map((item, index) => (
                        <SidebarMenuItem key={item.title} className={pathname === item.url ? "bg-pink-500 text-white" : ""}>
                        <Collapsible open={item.open} className="group/collapsible">
                            <CollapsibleTrigger asChild>
                            <SidebarMenuButton asChild>
                                <div
                                    className="flex items-center cursor-pointer justify-between w-full"
                                    onClick={() => toggleOpen("bookings", index)}
                                >
                                    <div className="flex items-center">
                                        <item.icon />
                                        <span className="ml-2">{item.title}</span>
                                    </div>
                                    <div className="mr-2">
                                        {item.open ? <IoChevronDown /> : <IoChevronForward />}
                                    </div>
                                </div>
                            </SidebarMenuButton>
                            </CollapsibleTrigger>
                            {item.submenu && (
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                {item.submenu.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title} className={pathname === subItem.url ? "bg-pink-500 text-white" : ""}>
                                    <SidebarMenuSubButton asChild>
                                        <a href={subItem.url} className="flex items-center pl-0">
                                            <subItem.icon />
                                            <span className="ml-2">{subItem.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                            )}
                        </Collapsible>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>

                <SidebarGroupLabel>Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {menuState.actions.map((item, index) => (
                        <SidebarMenuItem key={item.title} className={pathname === item.url ? "bg-pink-500 text-white" : ""}>
                        <Collapsible open={item.open} className="group/collapsible">
                            <CollapsibleTrigger asChild>
                            <SidebarMenuButton asChild>
                                <div
                                    className="flex items-center cursor-pointer justify-between w-full"
                                    onClick={() => toggleOpen("actions", index)}
                                >
                                    <div className="flex items-center">
                                        <item.icon />
                                        <span className="ml-2">{item.title}</span>
                                    </div>
                                    <div className="mr-2">
                                        {item.open ? <IoChevronDown /> : <IoChevronForward />}
                                    </div>
                                </div>
                            </SidebarMenuButton>
                            </CollapsibleTrigger>
                            {item.submenu && (
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                {item.submenu.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title} className={pathname === subItem.url ? "bg-pink-500 text-white" : ""}>
                                    <SidebarMenuSubButton asChild>
                                        <a href={subItem.url} className="flex items-center pl-0">
                                            <subItem.icon />
                                            <span className="ml-2">{subItem.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                            )}
                        </Collapsible>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>

            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {settings.map((item) => (
                        <SidebarMenuItem key={item.title} className={activeItem === item.title ? "bg-pink-500 text-white" : ""}>
                            <SidebarMenuButton asChild>
                                <a href={item.url} onClick={() => setActiveItem(item.title)}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
