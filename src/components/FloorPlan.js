/* eslint-disable */
import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "../i18n";
import { C, DIET_OPTIONS, THEMES_CONFIG } from "../constants";
import { dietInfo } from "../utils";
import Btn from "./ui/Btn";
import { useTheme } from "../theme";

// ═══════════════════════════════════════════════════════════════
// FLOOR PLAN — Éditeur de salle et plan de table
// ═══════════════════════════════════════════════════════════════

const CANVAS_W = 800;
const CANVAS_H = 560;

function RoomShapeEditor({ shape, onChange }) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const svgRef = useRef(null);
  const [mode, setMode] = useState("view"); // view | draw | edit
  const [drawing, setDrawing] = useState([]);
  const [dragging, setDragging] = useState(null); // index of point being dragged

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  }, []);

  const handleSVGClick = useCallback(
    (e) => {
      if (mode !== "draw") return;
      const pt = getSVGPoint(e);
      if (drawing.length >= 3) {
        const first = drawing[0];
        if (Math.abs(pt.x - first.x) < 20 && Math.abs(pt.y - first.y) < 20) {
          onChange(drawing);
          setDrawing([]);
          setMode("view");
          return;
        }
      }
      setDrawing((prev) => [...prev, pt]);
    },
    [mode, drawing, getSVGPoint, onChange]
  );

  const handlePointMouseDown = (e, idx) => {
    if (mode !== "edit") return;
    e.stopPropagation();
    setDragging(idx);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (dragging === null) return;
      const pt = getSVGPoint(e);
      const newShape = shape.map((p, i) => (i === dragging ? pt : p));
      onChange(newShape);
    },
    [dragging, shape, getSVGPoint, onChange]
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const polyPoints = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  const presetRectangle = () => {
    onChange([
      { x: 60, y: 60 },
      { x: 740, y: 60 },
      { x: 740, y: 520 },
      { x: 60, y: 520 },
    ]);
    setMode("view");
  };
  const presetL = () => {
    onChange([
      { x: 60, y: 60 },
      { x: 740, y: 60 },
      { x: 740, y: 300 },
      { x: 450, y: 300 },
      { x: 450, y: 520 },
      { x: 60, y: 520 },
    ]);
    setMode("view");
  };
  const presetU = () => {
    onChange([
      { x: 60, y: 60 },
      { x: 280, y: 60 },
      { x: 280, y: 300 },
      { x: 520, y: 300 },
      { x: 520, y: 60 },
      { x: 740, y: 60 },
      { x: 740, y: 520 },
      { x: 60, y: 520 },
    ]);
    setMode("view");
  };
  const presetHex = () => {
    const cx = 400,
      cy = 290,
      r = 230;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = ((i * 60 - 30) * Math.PI) / 180;
      return {
        x: Math.round(cx + r * Math.cos(a)),
        y: Math.round(cy + r * Math.sin(a)),
      };
    });
    onChange(pts);
    setMode("view");
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 12,
            letterSpacing: 0.5,
          }}
        >
          {t.roomShapeTitle}
        </span>
        <div style={{ flex: 1 }} />
        <Btn
          size="sm"
          variant={mode === "draw" ? "primary" : "ghost"}
          onClick={() => {
            setMode(mode === "draw" ? "view" : "draw");
            setDrawing([]);
          }}
        >
          {mode === "draw" ? t.roomShapeCancelDraw : t.roomShapeDraw}
        </Btn>
        <Btn
          size="sm"
          variant={mode === "edit" ? "primary" : "ghost"}
          onClick={() => setMode(mode === "edit" ? "view" : "edit")}
        >
          {mode === "edit" ? t.roomShapeDoneEdit : t.roomShapeEditPoints}
        </Btn>
        <div
          style={{
            width: 1,
            height: 20,
            background: C.border,
          }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 12,
          }}
        >
          {t.roomShapePresets}
        </span>
        <Btn size="sm" variant="soft" onClick={presetRectangle}>
          ▭ Rect
        </Btn>
        <Btn size="sm" variant="soft" onClick={presetL}>
          ⌐ L
        </Btn>
        <Btn size="sm" variant="soft" onClick={presetU}>
          U
        </Btn>
        <Btn size="sm" variant="soft" onClick={presetHex}>
          ⬡ Hex
        </Btn>
      </div>

      {mode === "draw" && (
        <div
          style={{
            background: C.gold + "18",
            border: `1px solid ${C.gold}44`,
            borderRadius: 8,
            padding: "8px 14px",
            marginBottom: 10,
            fontSize: 12,
            color: "#C9973A",
          }}
        >
          {t.roomShapeDrawHelp(drawing.length)}
        </div>
      )}
      {mode === "edit" && (
        <div
          style={{
            background: C.blue + "18",
            border: `1px solid ${C.blue}44`,
            borderRadius: 8,
            padding: "8px 14px",
            marginBottom: 10,
            fontSize: 12,
            color: C.blue,
          }}
        >
          {t.roomShapeEditHelp}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        style={{
          width: "100%",
          display: "block",
          background: theme.background,
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
          cursor: mode === "draw" ? "crosshair" : "default",
        }}
        onClick={handleSVGClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={C.muted}
              strokeWidth=".3"
              strokeOpacity=".2"
            />
          </pattern>
        </defs>
        <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" />

        {shape.length >= 3 && (
          <polygon
            points={polyPoints(shape)}
            fill={C.gold + "0e"}
            stroke={C.gold}
            strokeWidth="2"
            strokeDasharray={mode === "draw" ? "6,3" : "none"}
          />
        )}

        {mode === "draw" && drawing.length > 0 && (
          <>
            <polyline
              points={polyPoints(drawing)}
              fill="none"
              stroke={C.gold}
              strokeWidth="2"
              strokeDasharray="6,3"
              strokeOpacity=".6"
            />
            {drawing.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="5"
                fill={i === 0 ? C.gold : C.gold2}
                stroke={C.dark}
                strokeWidth="1.5"
              />
            ))}
          </>
        )}

        {mode === "edit" &&
          shape.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="transparent"
                style={{ cursor: "grab" }}
                onMouseDown={(e) => handlePointMouseDown(e, i)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill={C.gold}
                stroke={C.dark}
                strokeWidth="2"
                style={{ cursor: "grab", pointerEvents: "none" }}
              />
            </g>
          ))}

        {shape.length >= 3 &&
          mode === "view" &&
          shape.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill={C.gold}
              opacity=".5"
            />
          ))}
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTERACTIVE FLOOR PLAN
// ═══════════════════════════════════════════════════════════════

const TABLE_R = 44;
const TABLE_RECT_W = 80;
const TABLE_RECT_H = 44;

function FloorPlan({
  ev,
  onUpdateTables,
  onSelectTable,
  selectedTable,
  highlightAvailable,
  onDropGuestToTable,
}) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseDown = (e, tableId) => {
    e.stopPropagation();
    const pt = getSVGPoint(e);
    const table = ev.tables.find((tbl2) => tbl2.id === tableId);
    setDragging({
      tableId,
      offsetX: pt.x - table.x,
      offsetY: pt.y - table.y,
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      const pt = getSVGPoint(e);
      onUpdateTables(
        ev.tables.map((tbl) => {
          if (tbl.id === dragging.tableId) {
            return {
              ...tbl,
              x: Math.max(
                50,
                Math.min(CANVAS_W - 50, pt.x - dragging.offsetX)
              ),
              y: Math.max(
                50,
                Math.min(CANVAS_H - 50, pt.y - dragging.offsetY)
              ),
            };
          }
          return tbl;
        })
      );
    },
    [dragging, ev.tables, getSVGPoint, onUpdateTables]
  );

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const polyPoints = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const themeCfg = THEMES_CONFIG[ev.type] || THEMES_CONFIG.autre;

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={t.floorPlanAria(ev)}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{
        width: "100%",
        display: "block",
        background: theme.background,
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        cursor: "default",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <defs>
        <pattern
          id="fp-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={C.muted}
            strokeWidth=".3"
            strokeOpacity=".15"
          />
        </pattern>
      </defs>
      <rect width={CANVAS_W} height={CANVAS_H} fill="url(#fp-grid)" />

      {ev.roomShape?.length >= 3 && (
        <polygon
          points={polyPoints(ev.roomShape)}
          fill={themeCfg.color + "08"}
          stroke={themeCfg.color}
          strokeWidth="2"
        />
      )}

      {ev.tables.map((tbl) => {
        const seated = ev.guests.filter((g) => g.tableId === tbl.id);
        const full = seated.length >= tbl.capacity;
        const sel = selectedTable === tbl.id;
        const available = highlightAvailable && !full;
        const col = sel
          ? C.gold
          : full
          ? C.green
          : available
          ? "#4CAF50"
          : tbl.color || themeCfg.color;
        const glowStyle = available
          ? { filter: "drop-shadow(0 0 8px #4CAF5066)" }
          : {};
        const diets = seated.filter((g) => g.diet !== "standard");

        return (
          <g
            key={tbl.id}
            style={{ cursor: "grab", ...glowStyle }}
            onMouseDown={(e) => handleMouseDown(e, tbl.id)}
            onClick={() =>
              onSelectTable(tbl.id === selectedTable ? null : tbl.id)
            }
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.filter =
                "drop-shadow(0 0 12px #C9973A88)";
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.filter = "";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.filter = "";
              const gId = e.dataTransfer.getData("guestId");
              if (gId && onDropGuestToTable) onDropGuestToTable(gId, tbl.id);
            }}
          >
            <title>{t.floorPlanTableTitle(tbl, seated)}</title>

            {tbl.shape === "rect" ? (
              <rect
                x={tbl.x - TABLE_RECT_W / 2}
                y={tbl.y - TABLE_RECT_H / 2}
                width={TABLE_RECT_W}
                height={TABLE_RECT_H}
                rx="8"
                fill={col + "22"}
                stroke={col}
                strokeWidth={sel ? 3 : 1.5}
              />
            ) : (
              <circle
                cx={tbl.x}
                cy={tbl.y}
                r={TABLE_R}
                fill={col + "22"}
                stroke={col}
                strokeWidth={sel ? 3 : 1.5}
              />
            )}

            {(() => {
              const pct =
                tbl.capacity > 0 ? seated.length / tbl.capacity : 0;
              const r = TABLE_R + 6;
              const circ = 2 * Math.PI * r;
              const dash = pct * circ;
              const fillCol =
                pct >= 1 ? C.green : pct > 0.7 ? "#E8845A" : col;
              return tbl.shape !== "rect" && pct > 0 ? (
                <circle
                  cx={tbl.x}
                  cy={tbl.y}
                  r={r}
                  fill="none"
                  stroke={fillCol}
                  strokeWidth="3"
                  strokeDasharray={`${dash} ${circ - dash}`}
                  strokeDashoffset={circ * 0.25}
                  strokeLinecap="round"
                  opacity=".7"
                  style={{ pointerEvents: "none" }}
                />
              ) : null;
            })()}

            <text
              x={tbl.x}
              y={tbl.y - 4}
              textAnchor="middle"
              fill={col}
              fontSize="15"
              fontWeight="700"
              fontFamily="Georgia,serif"
              style={{ pointerEvents: "none" }}
            >
              {tbl.number}
            </text>
            <text
              x={tbl.x}
              y={tbl.y + 13}
              textAnchor="middle"
              fill={col}
              fontSize="10"
              fontFamily="Georgia,serif"
              opacity=".8"
              style={{ pointerEvents: "none" }}
            >
              {seated.length}/{tbl.capacity}
            </text>
            {tbl.label && (
              <text
                x={tbl.x}
                y={tbl.y + 27}
                textAnchor="middle"
                fill={col}
                fontSize="9"
                fontFamily="Georgia,serif"
                opacity=".6"
                style={{ pointerEvents: "none" }}
              >
                {tbl.label}
              </text>
            )}

            {diets.slice(0, 4).map((g, i) => {
              const d = dietInfo(g.diet);
              const a = (i / 4) * 2 * Math.PI - Math.PI / 2;
              return (
                <circle
                  key={g.id}
                  cx={tbl.x + (TABLE_R + 10) * Math.cos(a)}
                  cy={tbl.y + (TABLE_R + 10) * Math.sin(a)}
                  r="5"
                  fill={d.color}
                  stroke={C.dark}
                  strokeWidth="1"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export { RoomShapeEditor, FloorPlan };
