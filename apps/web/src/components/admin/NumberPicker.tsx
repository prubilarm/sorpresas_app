import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

interface NumberPickerProps {
  label: string;
  value: number | string | undefined;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  unit?: string;
}

export const NumberPicker: React.FC<NumberPickerProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  unit = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const ITEM_H = 32; // px per row
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const current = value !== '' && value !== undefined ? Number(value) : null;

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Scroll selected into view when opening ── */
  useEffect(() => {
    if (!open || !listRef.current) return;
    if (current === null) return;
    const idx = current - min;
    listRef.current.scrollTop = idx * ITEM_H - ITEM_H * 2;
  }, [open, current, min]);

  /* ── Mouse-wheel inside the list ── */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    if (!listRef.current) return;
    listRef.current.scrollTop += e.deltaY;
  }, []);

  /* ── Wheel on the closed widget → increment/decrement ── */
  const handleWidgetWheel = useCallback(
    (e: React.WheelEvent) => {
      if (open) return;
      e.preventDefault();
      const step = e.deltaY > 0 ? 1 : -1;
      const base = current !== null ? current : (step > 0 ? min - 1 : max + 1);
      const next = Math.min(max, Math.max(min, base + step));
      onChange(String(next));
    },
    [open, current, min, max, onChange]
  );

  const displayVal = current !== null ? String(current) : '—';
  const isAuto = current === null;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-1 select-none"
      onWheel={handleWidgetWheel}
      style={{ minWidth: 72 }}
    >
      {/* ── Label ── */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: open ? '#c4b5fd' : '#7c6fa0',
          transition: 'color 0.2s',
        }}
      >
        {label}
      </span>

      {/* ── Main control ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px 6px 14px',
          borderRadius: 10,
          background: open
            ? 'linear-gradient(135deg,rgba(109,40,217,0.28),rgba(168,85,247,0.18))'
            : 'rgba(255,255,255,0.04)',
          border: open
            ? '1.5px solid rgba(167,139,250,0.55)'
            : '1.5px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
          transition: 'all 0.18s',
          outline: 'none',
          minWidth: 80,
          justifyContent: 'space-between',
        }}
      >
        {/* Value */}
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            fontFamily: '"Inter", system-ui, sans-serif',
            color: isAuto ? '#4b5563' : '#f0e6ff',
            lineHeight: 1,
            minWidth: 24,
            textAlign: 'center',
          }}
        >
          {displayVal}
        </span>

        {/* Unit pill */}
        {unit && !isAuto && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(167,139,250,0.6)',
            }}
          >
            {unit}
          </span>
        )}

        {/* Chevron */}
        <ChevronUp
          style={{
            width: 13,
            height: 13,
            color: open ? '#a78bfa' : '#4b5563',
            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s, color 0.2s',
            flexShrink: 0,
          }}
        />
      </button>

      {/* ── Dropdown list (opens upward) ── */}
      {open && (
        <div
          ref={listRef}
          onWheel={handleWheel}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 130,
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 9999,
            borderRadius: 10,
            background: '#0f0a1e',
            border: '1.5px solid rgba(139,92,246,0.35)',
            boxShadow: '0 -12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(139,92,246,0.4) transparent',
          }}
        >
          {/* Auto row */}
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
            style={{
              width: '100%',
              padding: '7px 12px',
              textAlign: 'left',
              fontSize: 11,
              fontWeight: 600,
              color: isAuto ? '#a78bfa' : '#4b5563',
              background: isAuto ? 'rgba(139,92,246,0.14)' : 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(139,92,246,0.1)',
              cursor: 'pointer',
              transition: 'background 0.12s, color 0.12s',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.16)';
              (e.currentTarget as HTMLElement).style.color = '#c4b5fd';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = isAuto ? 'rgba(139,92,246,0.14)' : 'transparent';
              (e.currentTarget as HTMLElement).style.color = isAuto ? '#a78bfa' : '#4b5563';
            }}
          >
            ↺ Auto
          </button>

          {/* Number rows */}
          {numbers.map((n) => {
            const sel = current === n;
            return (
              <button
                key={n}
                type="button"
                data-val={n}
                onClick={() => { onChange(String(n)); setOpen(false); }}
                style={{
                  width: '100%',
                  height: ITEM_H,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  fontWeight: sel ? 700 : 400,
                  color: sel ? '#e9d5ff' : '#6b7280',
                  background: sel
                    ? 'linear-gradient(90deg,rgba(139,92,246,0.22),rgba(236,72,153,0.1))'
                    : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.1s, color 0.1s',
                }}
                onMouseEnter={e => {
                  if (!sel) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.1)';
                    (e.currentTarget as HTMLElement).style.color = '#d8b4fe';
                  }
                }}
                onMouseLeave={e => {
                  if (!sel) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#6b7280';
                  }
                }}
              >
                <span>{n}</span>
                {unit && (
                  <span style={{ fontSize: 10, opacity: 0.45, fontWeight: 400 }}>{unit}</span>
                )}
                {sel && (
                  <span style={{ fontSize: 8, color: '#a78bfa', marginLeft: 4 }}>●</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
