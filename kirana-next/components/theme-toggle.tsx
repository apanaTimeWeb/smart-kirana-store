"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-full justify-start gap-3 px-3 py-2.5 rounded-xl h-auto font-semibold text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle theme"
    >
      <Sun className="h-5 w-5 flex-shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 flex-shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <div className="flex flex-col leading-tight items-start">
        <span className="text-sm">Theme</span>
        <span className="text-[11px] font-normal text-muted-foreground">Light / Dark</span>
      </div>
    </Button>
  );
}
