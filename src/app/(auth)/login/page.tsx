"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ArrowRight,
  MessageSquare,
  BarChart3,
  GitBranch,
  AlertCircle,
} from "lucide-react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { AuthResponse, ApiError } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const stats = [
  { value: "10k+", label: "Feedback collected" },
  { value: "4.7", label: "Avg. rating lift" },
  { value: "3 min", label: "Setup time" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    setLoginError("");

    try {
      const { data } = await api.post<AuthResponse>("/api/auth/login", values);

      login(data);
      toast.success("Welcome back!");

      router.push(data.role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const status = axiosErr.response?.status;

      if (status === 401) {
        setLoginError("Invalid email or password. Please try again.");
      } else {
        setLoginError(
          axiosErr.response?.data?.error ||
            "Unable to sign in. Please try again.",
        );
      }
    }
  }

  return (
    <main className="min-h-screen flex" style={{ background: "var(--ds-bg)" }}>
      <aside
        className="hidden lg:flex lg:w-[46%] xl:w-5/12 flex-col justify-between relative overflow-hidden p-12 xl:p-16"
        style={{
          background: "var(--ds-sidebar)",
          borderRight: "1px solid var(--ds-border)",
        }}
      >
        <div
          className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(122,14,34,0.18), transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-[-180px] right-[-160px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(245,124,0,0.07), transparent 70%)",
          }}
        />

        <Link
          href="/"
          aria-label="Spice Route home"
          className="relative z-10 inline-flex w-fit"
        >
          <Image
            src="/spice-route-logo.webp"
            alt="Spice Route"
            width={150}
            height={76}
            priority
            className="object-contain"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.95 }}
          />
        </Link>

        <div className="relative z-10 max-w-lg py-10">
          <p
            className="text-[11px] font-semibold tracking-widest uppercase mb-6"
            style={{ color: "var(--ds-accent-text)" }}
          >
            Restaurant feedback platform
          </p>

          <h1
            className="text-4xl xl:text-5xl font-bold leading-[1.15] tracking-tight"
            style={{ color: "var(--ds-text)" }}
          >
            Every guest
            <br />
            has a voice.
            <br />
            <span style={{ color: "var(--ds-accent-text)" }}>
              Make it count.
            </span>
          </h1>

          <p
            className="mt-5 text-sm xl:text-base leading-relaxed"
            style={{ color: "var(--ds-text-2)", maxWidth: "22rem" }}
          >
            Collect, analyse, and act on customer feedback across every branch —
            from one dashboard.
          </p>

          <div className="mt-10 flex items-center gap-6">
            {stats.map((s, i) => (
              <div key={i}>
                <p
                  className="text-xl font-bold"
                  style={{ color: "var(--ds-text)" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--ds-text-3)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-10 mb-8 h-px"
            style={{ background: "var(--ds-border)" }}
          />

          <div className="space-y-4">
            <FeatureItem
              icon={<MessageSquare className="h-4 w-4" />}
              title="Centralized feedback inbox"
              description="Every guest opinion, filtered and organized."
            />
            <FeatureItem
              icon={<BarChart3 className="h-4 w-4" />}
              title="Actionable analytics"
              description="Turn ratings into decisions your team can act on."
            />
            <FeatureItem
              icon={<GitBranch className="h-4 w-4" />}
              title="Multi-branch management"
              description="All locations in one view. Managers see only their branch."
            />
          </div>

          <div
            className="mt-10 rounded-lg p-5"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid var(--ds-border)",
            }}
          >
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  viewBox="0 0 20 20"
                  className="w-3.5 h-3.5"
                  style={{ fill: "var(--ds-orange)" }}
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034-1.539-1.118 1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--ds-text-2)" }}
            >
              &ldquo;Our average rating went from 3.8 to 4.6 in three months. We
              now respond to every concern the same day.&rdquo;
            </p>

            <p className="text-xs mt-3" style={{ color: "var(--ds-text-3)" }}>
              — General Manager, Dhaka branch
            </p>
          </div>
        </div>

        <div
          className="relative z-10 flex items-center justify-between text-xs"
          style={{ color: "var(--ds-text-3)" }}
        >
          <span>© {new Date().getFullYear()} Spice Route</span>
          <span>Built for better dining experiences.</span>
        </div>
      </aside>

      <section
        className="flex flex-1 flex-col justify-center items-center px-6 py-10 sm:px-10 relative"
        style={{ background: "var(--ds-bg)" }}
      >
        <div
          className="lg:hidden absolute top-0 left-0 right-0 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(122,14,34,0.1), transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[400px]">
          <Link
            href="/"
            className="lg:hidden flex items-center justify-center mb-10"
          >
            <Image
              src="/spice-route-logo.webp"
              alt="Spice Route"
              width={130}
              height={66}
              priority
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <div className="mb-8">
            <h2
              className="text-2xl sm:text-[28px] font-bold tracking-tight"
              style={{ color: "var(--ds-text)" }}
            >
              Welcome back
            </h2>

            <p className="text-sm mt-2" style={{ color: "var(--ds-text-2)" }}>
              Sign in to your restaurant dashboard.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@restaurant.com"
                autoComplete="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                className={`h-11 ${errors.email ? "border-[var(--ds-red)]" : ""}`}
              />

              {errors.email && (
                <p className="text-xs" style={{ color: "var(--ds-red-text)" }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className={`h-11 pr-11 ${errors.password ? "border-[var(--ds-red)]" : ""}`}
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                  style={{ color: "var(--ds-text-3)" }}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs" style={{ color: "var(--ds-red-text)" }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginError && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2 rounded-md border px-3 py-3 text-sm"
                style={{
                  color: "var(--ds-red-text)",
                  background: "var(--ds-red-muted)",
                  borderColor: "var(--ds-red)",
                }}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 font-semibold text-sm mt-2"
              style={{ background: "var(--ds-accent)", color: "#fff" }}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div
            className="mt-7 pt-6 text-center"
            style={{ borderTop: "1px solid var(--ds-border)" }}
          >
            <p className="text-sm" style={{ color: "var(--ds-text-3)" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold hover:underline"
                style={{ color: "var(--ds-accent-text)" }}
              >
                Register your restaurant
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "var(--ds-elevated)",
          color: "var(--ds-accent-text)",
          border: "1px solid var(--ds-border)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div>
        <p
          className="text-xs font-semibold"
          style={{ color: "var(--ds-text)" }}
        >
          {title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--ds-text-3)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
