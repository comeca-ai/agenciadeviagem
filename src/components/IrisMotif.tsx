interface IrisMotifProps {
  /** Tamanho em px */
  size?: number;
  className?: string;
  /** Opacidade global do motivo */
  opacity?: number;
  /** Anel tracejado girando lentamente */
  spinning?: boolean;
}

/**
 * Íris decorativa: 3 anéis concêntricos (opacidades .5/.3/.15, um tracejado
 * girando devagar) + núcleo com gradiente Íris.
 */
export default function IrisMotif({
  size = 400,
  className = "",
  opacity = 1,
  spinning = true,
}: IrisMotifProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="iris-motif-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5C877" />
          <stop offset="30%" stopColor="#F0A832" />
          <stop offset="62%" stopColor="#E4572E" />
          <stop offset="72%" stopColor="#E4572E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="94" stroke="#F0A832" strokeOpacity="0.5" strokeWidth="1" />
      <g
        className={spinning ? "animate-iris-spin" : undefined}
        style={{ transformOrigin: "100px 100px" }}
      >
        <circle
          cx="100"
          cy="100"
          r="76"
          stroke="#F0A832"
          strokeOpacity="0.3"
          strokeWidth="1"
          strokeDasharray="4 10"
        />
      </g>
      <circle cx="100" cy="100" r="58" stroke="#F0A832" strokeOpacity="0.15" strokeWidth="1" />
      <circle cx="100" cy="100" r="40" fill="url(#iris-motif-core)" />
    </svg>
  );
}
