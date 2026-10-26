import React, { useState } from 'react';

export const SalesChart: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d'>('7d');

  // Exact data points matching the screenshot line curve
  const data = [
    { date: 'Oct 19', value: 3800, label: '৳ 3,800' },
    { date: 'Oct 20', value: 7200, label: '৳ 7,200' },
    { date: 'Oct 21', value: 7100, label: '৳ 7,100' },
    { date: 'Oct 22', value: 6900, label: '৳ 6,900' },
    { date: 'Oct 23', value: 8500, label: '৳ 8,500' },
    { date: 'Oct 24', value: 11200, label: '৳ 11,200' },
    { date: 'Oct 25', value: 13450, label: '৳ 13,450' },
  ];

  const maxValue = 15000;
  const width = 650;
  const height = 220;
  const paddingX = 45;
  const paddingY = 25;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (data.length - 1);
    const y = height - paddingY - (val / maxValue) * (height - 2 * paddingY);
    return { x, y };
  };

  const points = data.map((d, i) => getCoordinates(i, d.value));

  // Construct smooth bezier curve path
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  // Fill gradient path under curve
  const fillD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const [activePoint, setActivePoint] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-subtle border border-[#E1ECE7] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-base font-bold text-[#292824]">Sales Overview</h3>
          <p className="text-xs text-gray-500">Daily revenue and transaction performance</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as any)}
          className="text-xs bg-[#FAF5ED] border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:outline-none"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#173B32" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#173B32" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (15k, 10k, 5k, 0) */}
          {[15000, 10000, 5000, 0].map((tick) => {
            const y = height - paddingY - (tick / maxValue) * (height - 2 * paddingY);
            return (
              <g key={tick}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#FAF5ED"
                  strokeWidth="1.5"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#9CA3AF"
                  fontFamily="sans-serif"
                >
                  {tick === 0 ? '0' : `${tick / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* X Axis dates */}
          {data.map((d, i) => {
            const { x } = getCoordinates(i, d.value);
            return (
              <text
                key={d.date}
                x={x}
                y={height - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
                fontFamily="sans-serif"
              >
                {d.date}
              </text>
            );
          })}

          {/* Gradient Fill under Curve */}
          <path d={fillD} fill="url(#salesGrad)" />

          {/* Smooth Line Curve matching screenshot */}
          <path d={pathD} fill="none" stroke="#173B32" strokeWidth="2.5" strokeLinecap="round" />

          {/* Interactive dots */}
          {points.map((pt, i) => (
            <g
              key={i}
              onMouseEnter={() => setActivePoint(i)}
              onMouseLeave={() => setActivePoint(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activePoint === i ? 6 : 4}
                fill={activePoint === i ? '#C9684B' : '#173B32'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {activePoint === i && (
                <g>
                  <rect
                    x={pt.x - 30}
                    y={pt.y - 30}
                    width="60"
                    height="20"
                    rx="4"
                    fill="#292824"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 16}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {data[i].label}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
