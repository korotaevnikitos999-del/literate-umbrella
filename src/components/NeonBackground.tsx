import React from 'react';

const NeonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep dark background */}
      <div className="absolute inset-0 bg-[#07071a]" />
      
      {/* Neon orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #db2777 0%, transparent 70%)' }} />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }} />
      
      {/* Neon lines — left */}
      <svg className="absolute left-0 top-0 opacity-30" width="400" height="400" viewBox="0 0 400 400">
        <polyline points="0,200 120,80 220,160" fill="none" stroke="#f0abfc" strokeWidth="2"
          filter="url(#glow-pink)" />
        <polyline points="0,280 100,140 200,220" fill="none" stroke="#f0abfc" strokeWidth="1.5"
          filter="url(#glow-pink)" opacity="0.6" />
        <defs>
          <filter id="glow-pink">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Neon lines — right */}
      <svg className="absolute right-0 bottom-0 opacity-30" width="400" height="400" viewBox="0 0 400 400">
        <polyline points="400,200 280,320 180,240" fill="none" stroke="#93c5fd" strokeWidth="2"
          filter="url(#glow-blue)" />
        <polyline points="400,120 300,260 200,180" fill="none" stroke="#93c5fd" strokeWidth="1.5"
          filter="url(#glow-blue)" opacity="0.6" />
        <defs>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default NeonBackground;
