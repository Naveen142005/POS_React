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
    <svg className="dash-line-chart" viewBox={`0 0 ${width} ${height}`} role="img">
      {yTicks.map((tick) => {
        const y = padding.top + plotHeight - (tick / yMax) * plotHeight;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              className="dash-chart-grid-line"
            />
            <text x={padding.left - 20} y={y + 4} className="dash-chart-y-label">
              {tick === 0 ? "0" : `${Math.round(tick / 1000)}K`}
            </text>
          </g>
        );
      })}

      {labels.map((label, index) => {
        const x = padding.left + (labels.length === 1 ? 0 : (plotWidth / (labels.length - 1)) * index);
        return (
          <text key={label} x={x} y={height - 8} className="dash-chart-x-label">
            {label}
          </text>
        );
      })}

      {previousPoints.length > 0 && (
        <path d={getLinePath(previousPoints)} className="dash-chart-line dash-chart-line-prev" />
      )}
      <path d={getLinePath(currentPoints)} className="dash-chart-line dash-chart-line-current" />
    </svg>
  );
};

const SalesOverviewCard = ({ bills, details, formatMoney }) => {
  const sales = useSalesOverview(bills, details);

  return (
    <div className="dash-sales-card">
      <div className="dash-card-header">
        <div className="dash-card-title">
          <h3>Sales Overview</h3>

          <div className="dash-legends">
            <div className="dash-legend-item">
              <span className="dash-solid-line"></span>
              Sales ₹
            </div>

            <div className="dash-legend-item">
              <span className="dash-dash-line"></span>
              Last Week ₹
            </div>
          </div>
        </div>

        <div className="dash-dropdown-box">
          <button
            type="button"
            className="dash-drop-down"
            onClick={() => sales.setMenuOpen((open) => !open)}
          >
            <span>{sales.selectedType}</span>

            <img
              src="/assets/icons/sales-overview-dropdown-arrow.svg"
              alt=""
              width="12"
              height="12"
            />
          </button>

          <div className={`dash-dropdown-menu ${sales.menuOpen ? "dash-menu-open" : ""}`}>
            {sales.graphTypes.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => sales.selectType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-chart-box">
        <LineChart
          labels={sales.graph.labels}
          values={sales.graph.values}
          previousValues={sales.graph.previousValues}
        />
      </div>

      <div className="dash-sales-footer">
        <div className="dash-sale-data">
          <p>{sales.graph.footerLeftLabel}</p>
          <h2 style={{ marginTop: "4px" }}>{formatMoney(sales.currentTotal)}</h2>
        </div>

        <div className="dash-middle-line"></div>

        <div className="dash-sale-data">
          <p>{sales.graph.footerRightLabel}</p>
          <h2 style={{ marginTop: "4px" }}>{formatMoney(sales.previousTotal)}</h2>
        </div>

        <div className="dash-profit">↗ {sales.profitPercent}%</div>
      </div>
    </div>
  );
};

export default SalesOverviewCard;
