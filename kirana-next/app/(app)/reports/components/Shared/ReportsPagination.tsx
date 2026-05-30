"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReportsConstants } from "../../constants/ReportsSharedConstants";

interface ReportsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReportsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ReportsPaginationProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--reports-border)] mt-auto">
      <p className="text-xs text-[var(--reports-muted-text)]">
        {ReportsConstants.TEXTS.PAGE} {totalPages === 0 ? 0 : currentPage}{" "}
        {ReportsConstants.TEXTS.OF} {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-[var(--reports-background)] border-[var(--reports-border)] text-[var(--reports-foreground)] hover:bg-[var(--reports-muted-hover-bg)]"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 bg-[var(--reports-background)] border-[var(--reports-border)] text-[var(--reports-foreground)] hover:bg-[var(--reports-muted-hover-bg)]"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
