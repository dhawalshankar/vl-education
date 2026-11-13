"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { enrollmentAPI, paymentsAPI, PaymentVerificationRequest } from "@/app/lib/api";
import { ShieldCheck } from "lucide-react";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayPaymentResponse = PaymentVerificationRequest;

interface RazorpayPaymentFailedEvent {
  error?: {
    description?: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (event: RazorpayPaymentFailedEvent) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Checkout is only available in a browser"));
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Razorpay checkout")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout"));
    document.body.appendChild(script);
  }).catch((error) => {
    razorpayScriptPromise = null;
    throw error;
  });

  return razorpayScriptPromise;
}

export interface RazorpayCheckoutProps {
  courseId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  itemName?: string;
  instructor?: string;
  mode?: string;
  price?: number | string;
}

export default function RazorpayCheckout({
  courseId,
  onSuccess,
  onError,
  itemName,
  instructor,
  mode = "Online Course",
  price,
}: RazorpayCheckoutProps) {
  const [processing, setProcessing] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const processingRef = useRef(false);

  const resetWithError = (message: string) => {
    processingRef.current = false;
    setProcessing(false);
    onError(message);
  };

  const handlePayment = async () => {
    if (!agreed) {
      onError("Please agree to the Terms, Privacy Policy, and Refund Policy to proceed.");
      return;
    }

    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    onError("");

    try {
      const order = await paymentsAPI.createOrder(courseId);
      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable");

      const razorpay = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const verification = await paymentsAPI.verifyPayment(response);
            if (verification.success === false) throw new Error(verification.message || "Payment verification failed");
            await enrollmentAPI.enroll(courseId);
            sessionStorage.setItem(
              "paymentSuccess",
              JSON.stringify({
                courseId,
                completedAt: Date.now(),
              })
            );
            processingRef.current = false;
            setProcessing(false);
            onSuccess();
          } catch (error) {
            resetWithError(error instanceof Error ? error.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => resetWithError("Payment was cancelled."),
        },
      });

      razorpay.on("payment.failed", (event) => {
        resetWithError(event.error?.description || "Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (error) {
      resetWithError(error instanceof Error ? error.message : "Could not start payment");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Itemised summary if item details provided */}
      {(itemName || price !== undefined) && (
        <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 text-xs space-y-2">
          {itemName && (
            <div className="flex justify-between items-start gap-2">
              <span className="text-stone-400">Item:</span>
              <span className="min-w-0 break-words text-stone-200 font-medium text-right">{itemName}</span>
            </div>
          )}
          {instructor && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-stone-400">Instructor:</span>
              <span className="text-stone-200 font-medium">{instructor}</span>
            </div>
          )}
          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-400">Mode:</span>
            <span className="text-stone-200 font-medium">{mode}</span>
          </div>
          {price !== undefined && (
            <div className="flex justify-between items-center gap-2 pt-2 border-t border-stone-800 font-semibold text-sm">
              <span className="text-stone-300">Total Payable:</span>
              <span className="text-white font-mono">₹{price}</span>
            </div>
          )}
        </div>
      )}

      {/* Consent checkbox and policy links */}
      <div className="text-[11px] text-stone-400 leading-snug">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-stone-700 bg-stone-950 text-amber-500 accent-amber-500"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="text-amber-400 underline hover:text-amber-300">
              Terms &amp; Conditions
            </Link>
            ,{" "}
            <Link href="/privacy" target="_blank" className="text-amber-400 underline hover:text-amber-300">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/refund-policy" target="_blank" className="text-amber-400 underline hover:text-amber-300">
              Refund &amp; Cancellation Policy
            </Link>
            .
          </span>
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={processing || !agreed}
        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white disabled:opacity-50 transition-all shadow-md"
      >
        {processing ? "Processing payment…" : "Pay and enroll"}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Payments securely processed by Razorpay in INR (₹)</span>
      </div>
    </div>
  );
}
