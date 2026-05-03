import { RAW } from '../../../scripts/data.js';

function parseRaw(block) {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  let year = null;
  let idx = 0;
  const items = [];
  const re = /^-(.+?)\s+\((.+?)\)\s*-+\s*([\d,]+m?)$/i;

  for (const line of lines) {
    if (/^\d{4}$/.test(line)) {
      year = Number(line);
      continue;
    }

    const m = line.match(re);
    if (!m || !year) continue;

    const title = m[1].replace(/\s+/g, ' ').trim();
    const platforms = m[2].split(',').map((p) => p.trim()).filter(Boolean);
    const score = Number.parseFloat(m[3].toLowerCase().replace('m', '').replace(',', '.'));

    items.push({
      id: `${year}-${title}-${idx}`,
      idx: idx++,
      year,
      title,
      platforms,
      score
    });
  }

  return items;
}

export const games = parseRaw(RAW);
