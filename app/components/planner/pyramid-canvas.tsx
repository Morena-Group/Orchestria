"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";

interface PyramidCanvasProps {
  panX: number;
  panY: number;
  zoom: number;
  onPanChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onResetView: () => void;
  children: ReactNode;
}

export function PyramidCanvas({
  panX,
  panY,
  zoom,
  onPanChange,
  onZoomChange,
  onResetView,
  children,
}: PyramidCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Wheel zoom with passive: false to allow preventDefault
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      onZoomChange(zoom + delta);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoom, onZoomChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, px: panX, py: panY };
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    },
    [panX, panY]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      onPanChange(panStart.current.px + dx, panStart.current.py + dy);
    },
    [onPanChange]
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden relative"
      style={{
        backgroundColor: "var(--color-bg-base)",
        backgroundImage:
          "radial-gradient(circle, var(--color-border-default) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        cursor: "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Pan + zoom container */}
      <div
        className="p-8 inline-block"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          minWidth: "100%",
          minHeight: "100%",
        }}
      >
        {children}
      </div>

      {/* Minimap */}
      <div
        className="absolute bottom-3 right-3 w-32 h-20 rounded-lg border overflow-hidden"
        style={{
          backgroundColor: "var(--color-bg-deep)",
          borderColor: "var(--color-border-default)",
          opacity: 0.85,
        }}
      >
        <div className="p-1.5">
          <div className="flex flex-col items-center gap-0.5">
            <div
              className="w-12 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <div className="flex gap-1">
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              <div
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-5 h-0.5 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              ))}
              <div
                className="w-5 h-0.5 rounded-full"
                style={{ backgroundColor: "#71717a" }}
              />
            </div>
          </div>
        </div>
        <span
          className="text-[8px] absolute bottom-0.5 right-1.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          minimap
        </span>
      </div>

      {/* Reset view */}
      <button
        onClick={onResetView}
        className="absolute bottom-3 left-3 px-2 py-1 rounded-lg border text-[10px]"
        style={{
          backgroundColor: "var(--color-bg-deep)",
          borderColor: "var(--color-border-default)",
          color: "var(--color-text-muted)",
        }}
      >
        Reset View
      </button>
    </div>
  );
}
