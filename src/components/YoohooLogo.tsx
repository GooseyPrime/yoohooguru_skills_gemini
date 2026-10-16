import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 3D Golden-Amber Yoohoo.Guru Wordmark inspired by the user's uploaded lettering artwork
 */
export const YoohooLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl tracking-tight',
    lg: 'text-4xl md:text-5xl tracking-tight',
  }[size];

  return (
    <div className={`inline-flex items-center font-extrabold select-none ${className}`}>
      <span
        className={`font-black ${sizeClasses} relative inline-block`}
        style={{
          fontFamily: "'Outfit', sans-serif",
          color: '#FFFDF0',
          textShadow: `
            0 1px 0 #F59E0B,
            0 2px 0 #D97706,
            0 3px 0 #B45309,
            0 4px 0 #92400E,
            0 5px 0 #78350F,
            0 6px 1px rgba(0,0,0,0.2),
            0 0 5px rgba(245,158,11,0.4)
          `,
          WebkitTextStroke: '1.2px #D97706',
        }}
      >
        Yoohoo<span style={{ color: '#FDE047', WebkitTextStroke: '1.2px #B45309' }}>.Guru</span>
      </span>
    </div>
  );
};
