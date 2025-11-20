import { useMouseStore } from "../store/mouseStore";

export function DotGridBackground() {
    const { x, y } = useMouseStore();

    return (
        <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
                backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
                maskImage: `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`,
                WebkitMaskImage: `radial-gradient(300px circle at ${x}px ${y}px, black, transparent)`,
            }}
        />
    );
}
