import { useState, useEffect, useRef } from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <>
            <style>
                {`
          .auth-layout-cursor, .auth-layout-cursor * {
            cursor: url('/minecraft%20pickaxe.cur'), auto !important;
          }
        `}
            </style>
            <div
                ref={containerRef}
                className="auth-layout-cursor min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden"
            >
                {/* Dot Grid Pattern with Reveal Mask */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                        maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                        WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                    }}
                />

                {/* Content */}
                <div className="relative z-10 w-full max-w-md p-4">
                    {children}
                </div>
            </div>
        </>
    );
}
