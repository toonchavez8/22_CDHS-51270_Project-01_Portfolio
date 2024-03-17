'use client';
import React from 'react';

export function DotBackgroundDemo() {
    return (
        <div className="absolute inset-0 -z-10 flex  w-full items-center justify-center bg-grid-black/[0.1]   dark:bg-grid-white/[0.02] md:motion-safe:group-hover:animate-pulse">
            {/* Radial gradient for the container to give a faded look */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-base-100   [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        </div>
    );
}