import "./ClothLoader.css";

interface ClothLoaderProps {
  size?: "sm" | "md" | "lg";
  speed?: number; // Animation duration in seconds
  borderColor?: string;
  letterColor?: string;
  className?: string;
}

export default function ClothLoader({ 
  size = "md", 
  speed = 2,
  borderColor = "#A72729",
  letterColor = "#A72729",
  className = "" 
}: ClothLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Calculate square size - matching the background size
  // Background extends -24px, so size is (base size + 48px)
  const bgSize = {
    sm: 32, // 8px (w-8) + 48px (inset -24px * 2)
    md: 48, // 12px (w-12) + 48px
    lg: 64, // 16px (w-16) + 48px
  }[size];
  
  const squareSize = bgSize;
  const borderOffset = 0.75; // Half stroke width to position border on edge
  const borderSize = squareSize - (borderOffset * 2);
  const perimeter = borderSize * 4; // Perimeter of square
  const svgSize = bgSize;

  return (
    <div className={`cloth-loader-container ${className}`}>
      <div 
        className={`cloth-loader ${sizeClasses[size]} relative`}
        style={{
          "--loader-speed": `${speed}s`,
          "--border-color": borderColor,
          "--perimeter": `${perimeter}`,
        } as React.CSSProperties}
      >
        {/* Background */}
        <div className="cloth-loader-bg"></div>
        
        {/* SVG with smooth border animation - positioned to match background */}
        <svg
          className="cloth-loader-border-svg"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            x={borderOffset}
            y={borderOffset}
            width={borderSize}
            height={borderSize}
            fill="none"
            stroke={borderColor}
            strokeWidth="1.5"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="border-square"
            style={{
              animation: `border-draw var(--loader-speed, 2s) ease-in-out infinite`,
            }}
          />
        </svg>
        
        {/* Letter */}
        <svg
          viewBox="0 0 10 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M0 11.7412L0.400261 0.0181528H0.778643L8.93538 9.95101H9.03473L8.65861 0.0181528H9.78462L9.38982 11.7412H9.00996L0.854646 1.8101H0.755293L1.126 11.7412H0Z"
            className="nook-letter"
            style={{ fill: letterColor }}
          />
        </svg>
      </div>
    </div>
  );
}
