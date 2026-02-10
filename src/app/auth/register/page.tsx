"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true);
        try {
            const api = (await import("@/lib/api")).default;
            await api.post('/auth/register', {
                email: data.email,
                password: data.password,
                full_name: data.name
            });

            alert("Account created! Redirecting to login...");
            router.push('/auth/login');
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || "Registration Failed";
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
                Create an account
            </h1>
            <p className="text-sm text-muted-foreground pb-6">
                Begin your journey with NeuroVision
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 text-left">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-white">Full Name</label>
                    <input
                        {...register("name")}
                        type="text"
                        className={cn(
                            "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white",
                            errors.name && "border-destructive focus-visible:ring-destructive"
                        )}
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-white">Email</label>
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
                    <label className="text-sm font-medium leading-none text-white">Password</label>
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

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-white">Confirm Password</label>
                    <input
                        {...register("confirmPassword")}
                        type="password"
                        className={cn(
                            "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white",
                            errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                        )}
                    />
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full mt-6"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Creating Account...
                        </span>
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground pt-4">
                <Link href="/auth/login" className="hover:text-primary underline underline-offset-4">
                    Already have an account? Sign In
                </Link>
            </p>
        </div>
    );
}
