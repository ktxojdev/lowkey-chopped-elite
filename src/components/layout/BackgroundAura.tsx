"use client";

export default function BackgroundAura() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Primary ambient purple glow in center bottom */}
      <div 
        className="absolute w-[800px] h-[650px] rounded-full blur-[140px] opacity-30 bottom-[-150px] left-[15%]"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 70%)"
        }}
      />
      {/* Secondary subtle magenta glow */}
      <div 
        className="absolute w-[600px] h-[500px] rounded-full blur-[160px] opacity-20 top-[-100px] right-[10%]"
        style={{
          background: "radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(126, 34, 206, 0.1) 60%, transparent 75%)"
        }}
      />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/90" />
    </div>
  );
}
