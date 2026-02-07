import type { PanelLayout } from '../types';

export const PANEL_LAYOUTS: PanelLayout[] = [
  { panels: 4, cols: 2, rows: 2 },
  { panels: 6, cols: 2, rows: 3 },
  { panels: 8, cols: 2, rows: 4 },
  { panels: 9, cols: 3, rows: 3 },
  { panels: 12, cols: 3, rows: 4 },
  { panels: 16, cols: 4, rows: 4 },
];

export const DEFAULT_PANELS = 8;

export const STORY_PHASES = ['도입', '전개', '절정', '결말'] as const;

export const STORY_GENERATION_COUNT = 4;

export function getLayoutForPanels(panels: number): PanelLayout {
  const found = PANEL_LAYOUTS.find((l) => l.panels === panels);
  if (found) return found;
  const cols = panels <= 6 ? 2 : panels <= 9 ? 3 : 4;
  const rows = Math.ceil(panels / cols);
  return { panels, cols, rows };
}
