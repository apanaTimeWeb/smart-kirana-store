"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, MessageCircle, Printer } from "lucide-react";

interface HistoryBillReturnSuccessScreenProps {
  /** Current value of the WhatsApp phone number input */
  phoneNumber: string;
  /** Called when phone number input changes */
  onPhoneChange: (value: string) => void;
  /** Called when "Send Updated Bill" (WhatsApp) button is clicked */
  onSend: () => void;
  /** Called when "Print Thermal Receipt" button is clicked */
  onPrint: () => void;
  /** Called when "Close" button is clicked */
  onClose: () => void;
}

/**
 * HistoryBillReturnSuccessScreen
 *
 * Displayed inside HistoryBillDetailsDialog after a return is
 * successfully processed. Shows:
 *   - Green success checkmark with confirmation message
 *   - WhatsApp phone number input (pre-filled if customer has phone)
 *   - "Send Updated Bill" button → opens wa.me link
 *   - "Print Thermal Receipt" button → triggers thermal print
 *   - "Close" button → closes the dialog
 *
 * All action handlers are passed in from the parent dialog
 * (which has access to the updated bill data and utility functions).
 */
export function HistoryBillReturnSuccessScreen({
  phoneNumber,
  onPhoneChange,
  onSend,
  onPrint,
  onClose,
}: HistoryBillReturnSuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
      {/* Success icon */}
      <div className="h-16 w-16 bg-[var(--history-success-bg)] text-[var(--history-success-text)] rounded-full flex items-center justify-center shrink-0">
        <Check className="h-8 w-8" />
      </div>

      {/* Confirmation text */}
      <div>
        <h2 className="text-xl font-bold">Return Successful</h2>
        <p className="text-[var(--history-muted-text)] mt-1 text-sm">
          Stock aur Khata (agar applicable) adjust ho gaye hain.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col w-full gap-3 mt-4">
        <div className="space-y-1.5">
          <Input
            placeholder="WhatsApp Number (e.g. 9876543210)"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
            type="tel"
            className="w-full"
          />
        </div>

        <Button
          onClick={onSend}
          className="w-full gap-2 bg-[var(--history-success-btn-bg)] hover:bg-[var(--history-success-btn-hover)] text-[var(--history-success-btn-text)]"
        >
          <MessageCircle className="h-5 w-5" />
          Send Updated Bill
        </Button>

        <Button onClick={onPrint} variant="outline" className="w-full gap-2">
          <Printer className="h-5 w-5" />
          Print Thermal Receipt
        </Button>

        <Button variant="ghost" onClick={onClose} className="w-full mt-2">
          Close
        </Button>
      </div>
    </div>
  );
}
