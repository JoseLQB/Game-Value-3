// scripts/parser.js
export const PLATFORM_ALIASES = {
  "PSX-PS4": "PSX/PS4",
  "Series X": "Xbox Series X",
  "XOne": "Xbox One",
  "Steam Deck-PC": "Steam Deck/PC",
  "PC-XOne": "PC/XOne",
  "PS5": "PS5", "PS4": "PS4", "PS3": "PS3",
  "Wii U": "Wii U", "Wii": "Wii", "Switch": "Switch",
  "Switch 2": "Switch 2", "GCN": "GameCube",
  "PSP": "PSP", "Vita": "PS Vita",
  "3DS": "3DS", "GBA": "GBA", "GB": "Game Boy",
  "SNES": "SNES", "Megadrive": "Mega Drive", "Móvil": "Móvil"
};

export function parseRaw(block) {
  const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
  let year = null, items = [], idx = 0;
  const re = /^-(.+?)\s+\((.+?)\)\s*-+\s*([\d,]+m?)$/i;

  for (const line of lines) {
    if (/^\d{4}$/.test(line)) { year = parseInt(line, 10); continue; }
    const m = line.match(re);
    if (m) {
      const title = m[1].replace(/\s+/g, " ").trim();
      const platform = (PLATFORM_ALIASES[m[2]] || m[2]).trim();
      const score = parseFloat(m[3].toLowerCase().replace("m", "").replace(",", "."));
      items.push({ id: `${year}-${title}(${platform})`, idx: idx++, year, title, platform, score });
    }
  }
  return items;
}
