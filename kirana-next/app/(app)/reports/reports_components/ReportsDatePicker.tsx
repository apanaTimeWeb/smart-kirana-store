"use client";

import React from "react";
import type { DateRange } from "react-day-picker";
import { format, isSameDay, subDays } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useReports } from "./ReportsContext";
import { ReportsConstants } from "./ReportsConstants";

export function ReportsDatePicker() {
  const { dateRange, setDateRange, calOpen, setCalOpen } = useReports();
  const today = new Date();

  function handleRangeSelect(range: DateRange | undefined) {
    if (!range) {
      setDateRange({ from: undefined, to: undefined });
      return;
    }
    setDateRange(range);
    if (range.from && range.to && !isSameDay(range.from, range.to)) {
      setCalOpen(false);
    }
  }

  function clearFilter() {
    setDateRange({ from: subDays(today, 14), to: today });
  }

  function rangeLabelText() {
    if (!dateRange.from) return ReportsConstants.TEXTS.SELECT_DATE_RANGE;
    if (!dateRange.to || isSameDay(dateRange.from, dateRange.to)) {
      return format(dateRange.from, "dd MMM yyyy");
    }
    return `${format(dateRange.from, "dd MMM")} - ${format(dateRange.to, "dd MMM yyyy")}`;
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={calOpen} onOpenChange={setCalOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 w-full gap-2 text-sm font-medium sm:min-w-[210px] justify-start bg-[var(--reports-background)] border-[var(--reports-border)] text-[var(--reports-foreground)]",
              !dateRange.from && "text-[var(--reports-muted-text)]"
            )}
            data-testid="button-date-filter"
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-[var(--reports-primary)]" />
            <span className="flex-1 text-left">{rangeLabelText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-lg bg-[var(--reports-card-bg)] border-[var(--reports-border)]" align="end" sideOffset={6}>
          <div className="border-b border-[var(--reports-border)] p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--reports-muted-text)]">
              {ReportsConstants.TEXTS.DATE_RANGE}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--reports-muted-text)]">
              {ReportsConstants.TEXTS.DATE_RANGE_DESC}
            </p>
          </div>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleRangeSelect}
            disabled={{ after: today }}
            numberOfMonths={1}
            defaultMonth={dateRange.from ?? today}
          />
          <div className="flex items-center justify-between gap-2 border-t border-[var(--reports-border)] p-3">
            <div className="flex flex-wrap gap-1">
              {ReportsConstants.QUICK_DATES.map((quick) => (
                <button
                  key={quick.label}
                  onClick={() => {
                    setDateRange({ from: subDays(today, quick.days), to: today });
                    if (quick.days > 0) setCalOpen(false);
                  }}
                  className="rounded-md border border-[var(--reports-border)] px-2.5 py-1 text-xs font-medium transition-colors hover:bg-[var(--reports-muted-hover-bg)] text-[var(--reports-foreground)]"
                >
                  {quick.label}
                </button>
              ))}
            </div>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-[var(--reports-foreground)]" onClick={() => setCalOpen(false)}>
              {ReportsConstants.TEXTS.DONE}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {dateRange.from && (
        <button
          onClick={clearFilter}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--reports-border)] text-[var(--reports-muted-text)] transition-colors hover:bg-[var(--reports-muted-hover-bg)] hover:text-[var(--reports-foreground)]"
          title="Filter clear karein"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
