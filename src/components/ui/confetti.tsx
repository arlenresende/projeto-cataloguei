"use client";

import { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;

    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!visible) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={150}
      gravity={0.15}
      colors={["#FFD400", "#0A0A0A", "#FFED4A", "#FFA500", "#F5F5F0"]}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
