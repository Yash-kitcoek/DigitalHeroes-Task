type SparklineProps = {
  values: number[];
  width?: number;
  height?: number;
};

export function Sparkline({ values, width = 120, height = 36 }: SparklineProps) {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" points={points} stroke="var(--accent-2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
