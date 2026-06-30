import React from "react";
import useSalesOverview from "./hooks/useSalesOverview";

const getLinePath = (points) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const controlX = previous.x + (point.x - previous.x) / 2;

    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
};

const LineChart = ({ labels, values, previousValues }) => {
  const width = 620;
  const height = 220;
  const padding = { top: 16, right: 12, bottom: 34, left: 46 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...values, ...previousValues, 1000);
  const yMax = Math.ceil(maxValue / 1000) * 1000 || 1000;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => yMax * ratio);

  const getPoints = (source) =>
    source.map((value, index) => ({
      x: padding.left + (labels.length === 1 ? 0 : (plotWidth / (labels.length - 1)) * index),
      y: padding.top + plotHeight - (Number(value || 0) / yMax) * plotHeight,
    }));

  const currentPoints = getPoints(values);
  const previousPoints = previousValues.length ? getPoints(previousValues) : [];

  return (
    <svg className="w-full h-full block" viewBox={`0 0 ${width} ${height}`} role="img">
      {yTicks.map((tick) => {
        const y = padding.top + plotHeight - (tick / yMax) * plotHeight;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              className="stroke-[#e7e4f3] stroke-[1] [stroke-dasharray:3_3]"
            />
            <text
              x={padding.left - 20}
              y={y + 4}
              className="fill-[#67628b] text-[11px] font-bold [text-anchor:end]"
            >
              {tick === 0 ? "0" : `${Math.round(tick / 1000)}K`}
            </text>
          </g>
        );
      })}

      {labels.map((label, index) => {
        const x = padding.left + (labels.length === 1 ? 0 : (plotWidth / (labels.length - 1)) * index);
        return (
          <text
            key={label}
            x={x}
            y={height - 8}
            className="fill-[#67628b] text-[11px] font-bold [text-anchor:middle]"
          >
            {label}
          </text>
        );
      })}

      {previousPoints.length > 0 && (
        <path
          d={getLinePath(previousPoints)}
          className="fill-none [stroke-linecap:round] [stroke-linejoin:round] stroke-[#a798ff] stroke-[4] [stroke-dasharray:4_8]"
        />
      )}
      <path
        d={getLinePath(currentPoints)}
        className="fill-none [stroke-linecap:round] [stroke-linejoin:round] stroke-[#4b35ff] stroke-[4]"
      />
    </svg>
  );
};

const SalesOverviewCard = ({ bills, details, formatMoney }) => {
  const sales = useSalesOverview(bills, details);

  return (
    <div className="flex-[1.3] h-[385px] bg-white rounded-[14px] px-[22px] py-[15px] shadow-[0_10px_30px_rgba(84,63,255,0.08)] max-[1470px]:w-full min-[1470px]:!w-auto min-[1470px]:!h-full min-[1470px]:min-w-0 min-[1470px]:min-h-0 min-[1470px]:flex min-[1470px]:flex-col min-[1470px]:px-[22px] min-[1470px]:py-[18px]">
      <div className="flex justify-between items-center mb-[11px]">
        <div>
          <h3 className="text-[14px] font-extrabold text-[rgb(7,2,45)] m-0">
            Sales Overview
          </h3>

          <div className="flex items-center gap-[22px] ml-0.5 mt-3">
            <div className="flex items-center gap-[7px] text-[9px] font-extrabold text-[rgb(23,17,60)]">
              <span className="w-[26px] h-0.5 bg-[rgb(77,55,255)] inline-block"></span>
              Sales ₹
            </div>

            <div className="flex items-center gap-[7px] text-[9px] font-extrabold text-[rgb(23,17,60)]">
              <span className="w-[26px] border-t-2 border-dashed border-[rgb(169,155,255)] inline-block"></span>
              Last Week ₹
            </div>
          </div>
        </div>

        <div className="relative w-fit">
          <button
            type="button"
            className="flex items-center justify-between gap-2 px-3 py-2 border border-[#e5e7eb] rounded-lg bg-white text-[11px] w-fit cursor-pointer"
            onClick={() => sales.setMenuOpen((open) => !open)}
          >
            <span>{sales.selectedType}</span>

            <img
              src="/assets/icons/sales-overview-dropdown-arrow.svg"
              alt=""
              width="12"
              height="12"
              className="w-3 h-3"
            />
          </button>

          <div className={`${sales.menuOpen ? "block" : "hidden"} absolute top-[42px] right-0 bg-white border border-[#e5e7eb] rounded-lg min-w-[140px] shadow-[0_8px_20px_rgba(0,0,0,0.12)] z-[100] overflow-hidden`}>
            {sales.graphTypes.map((type) => (
              <button
                type="button"
                key={type}
                className="w-full border-0 bg-transparent text-left py-[9px] px-3 text-sm cursor-pointer hover:bg-[#f3f4f6]"
                onClick={() => sales.selectType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-[220px] mt-1.5 min-[1470px]:flex-1 min-[1470px]:!h-auto min-[1470px]:min-h-0 min-[1470px]:mt-2">
        <LineChart
          labels={sales.graph.labels}
          values={sales.graph.values}
          previousValues={sales.graph.previousValues}
        />
      </div>

      <div className="h-[62px] mt-5 rounded-xl bg-[rgba(222,172,219,0.263)] flex items-center py-3 px-4 relative min-[1470px]:h-16 min-[1470px]:mt-3.5 min-[1470px]:shrink-0">
        <div>
          <p className="text-[10px] font-extrabold text-[rgb(145,139,176)]">
            {sales.graph.footerLeftLabel}
          </p>
          <h2 className="mt-1 text-[17px] font-black text-[rgb(5,1,39)]">
            {formatMoney(sales.currentTotal)}
          </h2>
        </div>

        <div className="w-px h-[38px] bg-[rgb(221,215,239)] mx-5"></div>

        <div>
          <p className="text-[10px] font-extrabold text-[rgb(145,139,176)]">
            {sales.graph.footerRightLabel}
          </p>
          <h2 className="mt-1 text-[17px] font-black text-[rgb(5,1,39)]">
            {formatMoney(sales.previousTotal)}
          </h2>
        </div>

        <div className="absolute right-4 bottom-3.5 text-[8px] font-black text-[rgb(21,185,108)] bg-[rgb(226,250,238)] py-[5px] px-3 rounded-[20px]">
          ↗ {sales.profitPercent}%
        </div>
      </div>
    </div>
  );
};

export default SalesOverviewCard;
