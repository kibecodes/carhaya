"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ThemeToggler() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={null}
          className="bg-white border-0 mr-5 p-2 relative"
        >
          <Sun
            className={`h-[1.2rem] w-[1.2rem] absolute transition-all ${
              theme === "dark"
                ? "rotate-[360deg] scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
            style={{
              transition: "transform 0.5s, opacity 0.5s",
            }}
          />
          <Moon
            className={`h-[1.2rem] w-[1.2rem] absolute transition-all ${
              theme === "dark"
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-[360deg] scale-0 opacity-0"
            }`}
            style={{
              transition: "transform 0.5s, opacity 0.5s",
            }}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggler;