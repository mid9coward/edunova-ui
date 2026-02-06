"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface BankTransferDetailsProps {
  amount: string;
  orderCode?: string;
}

export function BankTransferDetails({
  amount,
  orderCode,
}: BankTransferDetailsProps) {
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  }

  function formatAmount(amount: string) {
    return new Intl.NumberFormat("vi-VN").format(parseInt(amount)) + "đ";
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
        Method 2: Manual bank transfer using the following details
      </h3>

      <div className="bg-card border border-border rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
        {/* Bank Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Image
              src="/images/vcb-icon.png"
              alt="OCB Bank"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </div>
          <h4 className="text-center font-semibold mt-1.5 sm:mt-2 text-sm sm:text-base text-foreground">
            VIETCOMBANK
          </h4>
        </div>

        {/* Bank Details */}
        <div className="p-3 sm:p-4">
          <div className="space-y-0">
            {/* Account Holder */}
            <div className="flex justify-between items-center py-2 border-b border-border/60 gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0">
                Account holder:
              </span>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                  VU TRUNG HIEU
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard("Vũ Trung Hiếu")}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted flex-shrink-0"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex justify-between items-center py-2 border-b border-border/60 gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0">
                Account number:
              </span>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-foreground">
                  1062403854
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard("1062403854")}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted flex-shrink-0"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="flex justify-between items-center py-2 border-b border-border/60 gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0">
                Amount:
              </span>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                  {formatAmount(amount || "0")}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(amount || "")}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted flex-shrink-0"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Transfer Content */}
            <div className="flex justify-between items-center py-2 gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0">
                Transfer note:
              </span>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                  {orderCode}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(orderCode || "")}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted flex-shrink-0"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-accent/15 border border-accent/40 rounded-lg">
            <p className="text-xs sm:text-sm text-accent-foreground leading-relaxed">
              <strong>Note:</strong> Please keep the transfer note{" "}
              <span className="font-semibold bg-accent/30 px-1 rounded">
                {orderCode}
              </span>{" "}
              unchanged for automatic payment confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
