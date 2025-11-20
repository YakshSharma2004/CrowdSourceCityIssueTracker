import { create } from 'zustand';

interface MouseState {
    x: number;
    y: number;
    setMousePosition: (x: number, y: number) => void;
}

export const useMouseStore = create<MouseState>((set) => ({
    x: 0,
    y: 0,
    setMousePosition: (x, y) => set({ x, y }),
}));
