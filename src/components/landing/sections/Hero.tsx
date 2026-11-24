import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroProductAnimation from "../HeroProductAnimation";

export function Hero() {
  return (
    <section
      className="py-12 sm:py-16"
      style={{
        background: "var(--ds-sidebar)",
        borderBottom: "1px solid var(--ds-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight"
              style={{ color: "var(--ds-text)" }}
            >
              System that tracks your customers, your business, and collects
              feedback.
            </h1>

            <p
              className="mt-5 text-lg leading-relaxed max-w-xl"
              style={{ color: "var(--ds-text-2)" }}
            >
              Guests scan a QR code at their table to leave a rating and a
              comment. Each table&apos;s feedback and customer service reports
              are collected, so you can read everything in one dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="lp-btn-primary inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-semibold"
              >
                Start for free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                href="/login"
                className="lp-btn-outline inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-medium"
              >
                Log in to dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <HeroProductAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
