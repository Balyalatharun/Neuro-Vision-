export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative z-10">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    {children}
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="relative z-20 flex items-center justify-center h-full p-8">
                    <div className="max-w-md space-y-4">
                        <blockquote className="space-y-2">
                            <p className="text-lg text-white/80 italic">
                                "Mental health needs a great deal of attention. It's the final taboo and it needs to be faced and dealt with."
                            </p>
                            <footer className="text-sm text-white/50">— Adam Ant</footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}
