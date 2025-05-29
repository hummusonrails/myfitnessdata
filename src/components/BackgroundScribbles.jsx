import React from 'react';

// These are SVG scribbles matching the color palette from the screenshot
export default function BackgroundScribbles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top left yellow (animated, moved down) */}
      <svg className="absolute left-0 top-0 mt-12 w-40 h-32 animate-float-slow" style={{animationDelay: '0s'}} viewBox="0 0 160 128" fill="none">
        <path d="M10 70 Q40 10 70 70 T130 70" stroke="#FFC845" strokeWidth="18" strokeLinecap="round" fill="none"/>
      </svg>
      {/* Top right coral (animated, moved down) */}
      <svg className="absolute right-0 top-0 mt-12 w-40 h-32 animate-float-slower" style={{animationDelay: '0.8s'}} viewBox="0 0 160 128" fill="none">
        <path d="M20 80 Q60 20 100 80 T150 80" stroke="#FF7B6A" strokeWidth="18" strokeLinecap="round" fill="none"/>
      </svg>
      {/* Bottom left blue */}
      <svg className="absolute left-0 bottom-0 w-40 h-32" viewBox="0 0 160 128" fill="none">
        <path d="M10 70 Q40 10 70 70 T130 70" stroke="#3C8AFF" strokeWidth="18" strokeLinecap="round" fill="none"/>
      </svg>
      {/* Bottom right green */}
      <svg className="absolute right-0 bottom-0 w-40 h-32" viewBox="0 0 160 128" fill="none">
        <path d="M20 80 Q60 20 100 80 T150 80" stroke="#00D7A9" strokeWidth="18" strokeLinecap="round" fill="none"/>
      </svg>
      {/* Center blue squiggle */}
      <svg className="absolute left-1/2 top-1/2 w-40 h-32 -translate-x-1/2 -translate-y-1/2 opacity-40" viewBox="0 0 160 128" fill="none">
        <path d="M10 70 Q40 10 70 70 T130 70" stroke="#8183FF" strokeWidth="18" strokeLinecap="round" fill="none"/>
      </svg>
    </div>
  );
}
