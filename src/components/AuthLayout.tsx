import { useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { GalaxyBackground } from "./GalaxyBackground";
import { useTheme } from "./ThemeContext";
import { useMouseStore } from "../store/mouseStore";
import { DotGridBackground } from "./DotGridBackground";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const setMousePosition = useMouseStore((state) => state.setMousePosition);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition(
                    event.clientX - rect.left,
                    event.clientY - rect.top
                );
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [setMousePosition]);

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
                className="auth-layout-cursor min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300"
            >
                <div className="absolute top-4 right-4 z-50">
                    <ThemeToggle />
                </div>

                {/* Backgrounds */}
                {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? (
                    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                        <GalaxyBackground
                            mouseRepulsion={true}
                            mouseInteraction={true}
                            density={1.5}
                            glowIntensity={0.5}
                            saturation={0.8}
                            hueShift={240}
                        />
                    </div>
                ) : (
                    /* Dot Grid Pattern with Reveal Mask for Light Mode */
                    <DotGridBackground />
                )}

                {/* Content */}
                <div className="relative z-10 w-full max-w-md p-4">
                    {children}
                </div>
            </div>
        </>
    );
}
