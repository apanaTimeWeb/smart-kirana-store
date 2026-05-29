import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { UNIT_CONFIG, UNIT_GROUPS } from "./utils";

export function UnitSelector({
  value,
  onChange,
  triggerClassName = "h-12 text-sm font-medium px-3",
}: {
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedConfig = UNIT_CONFIG[value];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background", triggerClassName)}
        >
          {value ? (
            <div className="flex flex-col items-start truncate">
              <span className="font-medium">{selectedConfig?.label ?? value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select unit...</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search unit..." />
          <CommandList>
            <CommandEmpty>No unit found.</CommandEmpty>
            {UNIT_GROUPS.map((g) => (
              <CommandGroup key={g.group} heading={g.label}>
                {g.units.map((u) => {
                  const c = UNIT_CONFIG[u];
                  return (
                    <CommandItem
                      key={u}
                      value={c?.label ?? u}
                      onSelect={() => {
                        onChange(u);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{c?.label ?? u}</span>
                        <span className="text-[11px] text-muted-foreground">{c?.description}</span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === u ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
