/**
 * A bench drawing of the stone, built at build time from the same cut as the live ring:
 * face up, in profile and face down, the way a gemmologist plots a stone before resetting it.
 */
import { brilliant, facets, TABLE_Y } from './geometry';

const f1 = (n: number) => n.toFixed(1);

export function plotSvg() {
  const cut = facets(brilliant()).filter((f) => f.poly.length >= 3);
  const R = 92;
  const panels = [
    { cx: 118, label: 'Crown' },
    { cx: 360, label: 'Profile' },
    { cx: 602, label: 'Pavilion' },
  ];
  const cy = 132;
  const out: string[] = [];

  // Face up: every facet that looks upward, seen from above.
  for (const f of cut) {
    if (f.plane.n[1] <= 0.01) continue;
    const pts = f.poly.map((p) => `${f1(panels[0].cx + p[0] * R)},${f1(cy + p[2] * R)}`).join(' ');
    const cls = f.plane.kind === 'table' ? 'pl-table' : f.plane.kind === 'star' ? 'pl-star' : f.plane.kind === 'kite' ? 'pl-kite' : 'pl-facet';
    out.push(`<polygon class="${cls}" points="${pts}"/>`);
  }
  // Profile: the facets facing us, seen from the side.
  for (const f of cut) {
    if (f.plane.n[2] <= 0.01) continue;
    const pts = f.poly.map((p) => `${f1(panels[1].cx + p[0] * R)},${f1(cy - 8 - p[1] * R * 1.0)}`).join(' ');
    const cls = f.plane.n[1] > 0.01 ? 'pl-facet' : f.plane.kind === 'girdle' ? 'pl-girdle' : 'pl-pav';
    out.push(`<polygon class="${cls}" points="${pts}"/>`);
  }
  // Face down.
  for (const f of cut) {
    if (f.plane.n[1] >= -0.01) continue;
    const pts = f.poly.map((p) => `${f1(panels[2].cx + p[0] * R)},${f1(cy - p[2] * R)}`).join(' ');
    out.push(`<polygon class="${f.plane.kind === 'main' ? 'pl-main' : 'pl-pav'}" points="${pts}"/>`);
  }

  // Measurements on the profile: the table's width, and the crown and pavilion angles at the girdle.
  const px = panels[1].cx;
  const top = cy - 8 - TABLE_Y * R;
  const girdle = cy - 8;
  const tableHalf = 0.55 * R;
  const gx = px + R;
  const arc = (deg: number, down: boolean, r: number) => {
    const a = (deg * Math.PI) / 180;
    const ex = gx - r * Math.cos(a);
    const ey = girdle + (down ? 1 : -1) * r * Math.sin(a);
    return `M${f1(gx - r)} ${f1(girdle)}A${r} ${r} 0 0 ${down ? 0 : 1} ${f1(ex)} ${f1(ey)}`;
  };
  out.push(
    `<path class="pl-dim" d="M${f1(px - tableHalf)} ${f1(top - 16)}H${f1(px + tableHalf)}M${f1(px - tableHalf)} ${f1(top - 20)}v8M${f1(px + tableHalf)} ${f1(top - 20)}v8"/>`,
    `<text class="pl-note" x="${f1(px)}" y="${f1(top - 24)}" text-anchor="middle">table 55%</text>`,
    `<path class="pl-dim pl-dash" d="M${f1(gx - 40)} ${f1(girdle)}H${f1(gx + 18)}"/>`,
    `<path class="pl-dim" d="${arc(34.5, false, 30)}"/>`,
    `<path class="pl-dim" d="${arc(40.75, true, 38)}"/>`,
    `<text class="pl-note" x="${f1(gx + 12)}" y="${f1(girdle - 14)}">crown 34.5°</text>`,
    `<text class="pl-note" x="${f1(gx + 12)}" y="${f1(girdle + 24)}">pavilion 40.75°</text>`,
  );

  panels.forEach((p) => {
    out.push(`<text class="pl-label" x="${p.cx}" y="276" text-anchor="middle">${p.label}</text>`);
  });

  return `<svg viewBox="0 0 720 300" focusable="false" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;
}
