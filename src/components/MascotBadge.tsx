import React from 'react';

interface MascotProps {
  className?: string;
  size?: number;
}

/**
 * High-fidelity SVG of the Yoohoo.Guru multi-talented Bigfoot mascot:
 * Hard hat + goggles, roller skates, playing acoustic guitar, with wrench and spatula on his back!
 */
export const MascotBadge: React.FC<MascotProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Yoohoo.Guru Bigfoot Mascot"
      role="img"
    >
      <circle cx="100" cy="100" r="96" fill="#FDF8F0" stroke="#F59E0B" strokeWidth="4" />
      
      {/* Background radial glow */}
      <circle cx="100" cy="100" r="76" fill="#FEF3C7" opacity="0.6" />

      {/* Bigfoot Silhouette & Gear in rich dark espresso brown #3B2219 */}
      <g fill="#3B2219" stroke="#3B2219" strokeLinecap="round" strokeLinejoin="round">
        {/* Hard Hat */}
        <path d="M72 45 C72 32, 118 32, 122 45 L128 50 L66 50 Z" fill="#D97706" stroke="#B45309" strokeWidth="2" />
        <path d="M62 50 C62 48, 132 48, 132 50 C132 54, 62 54, 62 50 Z" fill="#F59E0B" />

        {/* Goggles on Hat */}
        <rect x="78" y="47" width="18" height="9" rx="3" fill="#E2E8F0" stroke="#3B2219" strokeWidth="2" />
        <rect x="98" y="47" width="18" height="9" rx="3" fill="#E2E8F0" stroke="#3B2219" strokeWidth="2" />
        <line x1="96" y1="51" x2="98" y2="51" stroke="#3B2219" strokeWidth="2" />

        {/* Sasquatch Head & Beard */}
        <path d="M68 53 C60 62, 60 74, 68 82 C74 90, 84 94, 98 94 C104 94, 112 90, 118 84 C122 76, 122 62, 116 53 Z" />
        {/* Friendly eye/brow shadow */}
        <circle cx="86" cy="67" r="3" fill="#FEF3C7" />
        <circle cx="104" cy="67" r="3" fill="#FEF3C7" />

        {/* Wrench on back */}
        <path d="M38 98 L58 114 M36 94 C32 98, 32 104, 38 108 L46 102 C44 98, 44 94, 48 92 Z" strokeWidth="4" />

        {/* Spatula / Turner on back */}
        <path d="M32 124 L56 138" strokeWidth="4" />
        <rect x="24" y="118" width="14" height="18" rx="2" fill="#D97706" stroke="#3B2219" strokeWidth="2" transform="rotate(-30 24 118)" />

        {/* Furry Body */}
        <path d="M66 84 C52 98, 54 126, 68 148 L80 170 L98 152 L92 134 C98 126, 116 126, 122 136 L134 168 L152 168 C158 144, 148 114, 134 94 Z" />

        {/* Acoustic Guitar in Arms */}
        {/* Neck & Headstock */}
        <line x1="102" y1="108" x2="168" y2="62" stroke="#B45309" strokeWidth="7" />
        <rect x="164" y="52" width="14" height="20" rx="3" fill="#78350F" transform="rotate(-35 164 52)" />
        {/* Tuning pegs */}
        <circle cx="178" cy="56" r="2.5" fill="#F59E0B" />
        <circle cx="172" cy="52" r="2.5" fill="#F59E0B" />
        <circle cx="166" cy="48" r="2.5" fill="#F59E0B" />

        {/* Guitar Body (Cream soundboard with dark rosette) */}
        <path
          d="M86 96 C80 84, 94 72, 106 82 C114 88, 122 88, 128 80 C138 68, 154 82, 146 96 C140 106, 142 116, 150 124 C158 136, 140 152, 126 148 C116 144, 108 148, 102 154 C88 162, 74 146, 82 130 C86 122, 84 108, 86 96 Z"
          fill="#FFFDF7"
          stroke="#3B2219"
          strokeWidth="4"
        />
        {/* Soundhole */}
        <circle cx="116" cy="114" r="10" fill="#3B2219" />
        <circle cx="116" cy="114" r="12" stroke="#D97706" strokeWidth="1.5" fill="none" />
        {/* Bridge */}
        <rect x="94" y="128" width="12" height="4" rx="1" fill="#78350F" transform="rotate(-35 94 128)" />

        {/* Arms Strumming & Fretting */}
        {/* Left Arm fretting */}
        <path d="M128 92 C140 92, 152 82, 158 76" strokeWidth="9" strokeLinecap="round" />
        {/* Right Arm strumming */}
        <path d="M68 96 C68 116, 92 118, 108 118" strokeWidth="9" strokeLinecap="round" />

        {/* Roller Skates with Red/Amber Wheels */}
        {/* Left skate */}
        <rect x="64" y="170" width="34" height="10" rx="3" fill="#D97706" stroke="#3B2219" strokeWidth="2" />
        <circle cx="70" cy="186" r="6" fill="#EF4444" stroke="#3B2219" strokeWidth="2.5" />
        <circle cx="92" cy="186" r="6" fill="#EF4444" stroke="#3B2219" strokeWidth="2.5" />
        <circle cx="70" cy="186" r="2" fill="#FDE047" />
        <circle cx="92" cy="186" r="2" fill="#FDE047" />

        {/* Right skate (gliding back) */}
        <rect x="130" y="168" width="34" height="10" rx="3" fill="#D97706" stroke="#3B2219" strokeWidth="2" />
        <circle cx="136" cy="184" r="6" fill="#EF4444" stroke="#3B2219" strokeWidth="2.5" />
        <circle cx="158" cy="184" r="6" fill="#EF4444" stroke="#3B2219" strokeWidth="2.5" />
        <circle cx="136" cy="184" r="2" fill="#FDE047" />
        <circle cx="158" cy="184" r="2" fill="#FDE047" />
      </g>
    </svg>
  );
};
