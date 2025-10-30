import { useCallback, useEffect, useRef, useState } from "react";

type UseOrbitOptions = {
  a?: number;
  b?: number;
  friction?: number;
  idle?: number;
};

export function useOrbit(itemCount: number, { a = 300, b = 180, friction = 0.95, idle = 0.001 }: UseOrbitOptions) {
  const [theta, setTheta] = useState(
    Array.from({ length: itemCount }, (_, index) => (index * 2 * Math.PI) / itemCount)
  );
  const speed = useRef(idle);
  const lastInteraction = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lastInteraction.current = Date.now();
  }, []);

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const timeSinceInteraction = now - lastInteraction.current;

      setTheta((currentTheta) => currentTheta.map((angle) => angle + speed.current));

      if (timeSinceInteraction > 3000) {
        speed.current = idle;
      } else if (Math.abs(speed.current) > Math.abs(idle)) {
        speed.current *= friction;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [friction, idle]);

  const onDrag = useCallback((deltaX: number) => {
    speed.current += deltaX * 0.002;
    lastInteraction.current = Date.now();
  }, []);

  const onWheel = useCallback((deltaY: number) => {
    speed.current += deltaY * 0.0001;
    lastInteraction.current = Date.now();
  }, []);

  const onKeyboard = useCallback((direction: number) => {
    speed.current += direction * 0.01;
    lastInteraction.current = Date.now();
  }, []);

  return { theta, onDrag, onWheel, onKeyboard, a, b };
}
