"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true);
        try {
            const api = (await import("@/lib/api")).default;

            // Send JSON payload to new Next.js internal API
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password
            });

            localStorage.setItem('token', response.data.access_token);
            // Optional: Store user info if needed
            // localStorage.setItem('user', JSON.stringify(response.data.user));

            router.push('/dashboard/chat');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || "Login Failed. Please check your credentials.";
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col space-y-2 text-center items-center">
            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back
            </h1>
            <p className="text-sm text-muted-foreground pb-6">
                Enter your credentials to access your dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 text-left">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className={cn(
                            "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white",
                            errors.email && "border-destructive focus-visible:ring-destructive"
                        )}
                        placeholder="m@example.com"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        className={cn(
                            "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white",
                            errors.password && "border-destructive focus-visible:ring-destructive"
                        )}
                    />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-4"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Signing in...
                        </span>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground pt-4">
                <Link href="/auth/register" className="hover:text-primary underline underline-offset-4">
                    Don't have an account? Sign Up
                </Link>
            </p>
        </div>
    );
}
