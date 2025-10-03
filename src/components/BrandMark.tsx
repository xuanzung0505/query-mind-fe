function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <circle cx="12" cy="12" r="2.2" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x1 = 12 + Math.cos(a) * 4.2;
          const y1 = 12 + Math.sin(a) * 4.2;
          const x2 = 12 + Math.cos(a) * 10;
          const y2 = 12 + Math.sin(a) * 10;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
}

export default BrandMark;
