// scripts/main.js
export function initApp(GAMES) {
  alert('hola')
  const COVERS_KEY = 'customGameCovers.v1';
  const loadCovers = () => { try { return JSON.parse(localStorage.getItem(COVERS_KEY) || '{}'); } catch { return {}; } };
  const saveCovers = (m) => localStorage.setItem(COVERS_KEY, JSON.stringify(m));

  const app = document.querySelector('#app');
  const yearSel = document.querySelector('#yearSel');
  const platformSel = document.querySelector('#platformSel');
  const sortSel = document.querySelector('#sortSel');
  const minScore = document.querySelector('#minScore');
  const minScoreVal = document.querySelector('#minScoreVal');
  const q = document.querySelector('#q');
  const chips = document.querySelector('#chips');
  const meta = document.querySelector('#meta');

  const allYears = [...new Set(GAMES.map(g => g.year))];
  const allPlatforms = [...new Set(GAMES.map(g => g.platform))].sort((a, b) => a.localeCompare(b, 'es'));
  allYears.forEach(y => { const o = document.createElement('option'); o.value = y; o.textContent = y; yearSel.appendChild(o); });
  allPlatforms.forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; platformSel.appendChild(o); });

  function platformChips() {
    chips.innerHTML = '';
    allPlatforms.forEach(p => {
      const c = document.createElement('span'); c.className = 'chip'; c.textContent = p;
      c.onclick = () => {
        const o = [...platformSel.options].find(o => o.value === p);
        o.selected = !o.selected; c.classList.toggle('active', o.selected); render();
      };
      chips.appendChild(c);
    });
  }
  platformChips();

  function getFilters() {
    const year = yearSel.value === 'all' ? null : parseInt(yearSel.value, 10);
    const plats = [...platformSel.selectedOptions].map(o => o.value);
    const term = q.value.trim().toLowerCase();
    const min = parseFloat(minScore.value);
    const sort = sortSel.value;
    return { year, plats, term, min, sort };
  }

  const level = s => s >= 9.5 ? 'top' : s >= 8.5 ? 'good' : s >= 7 ? 'mid' : 'low';

  function autoCover(title, platform, score) {
    const h = [...title].reduce((a, c) => a + c.charCodeAt(0), 0);
    const hue = h % 360, hue2 = (hue + 40) % 360, sat = 70, light = 45;
    const size = { w: 600, h: 800 };
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const levelTxt = score >= 9.5 ? 'TOP' : score >= 8.5 ? 'ALTA' : score >= 7 ? 'MEDIA' : 'BAJA';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size.w}" height="${size.h}" viewBox="0 0 ${size.w} ${size.h}">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hue},${sat}%,${light + 12}%)"/>
            <stop offset="100%" stop-color="hsl(${hue2},${sat}%,${light - 6}%)"/>
          </linearGradient>
          <filter id="grain">
            <feTurbulence baseFrequency=".9" numOctaves="2" stitchTiles="stitch" type="fractalNoise"/>
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0"/>
            <feBlend mode="soft-light"/>
          </filter>
        </defs>
        <rect fill="url(#g)" width="100%" height="100%"/>
        <g filter="url(#grain)"><rect width="100%" height="100%" fill="transparent"/></g>
        <text x="30" y="80" font-family="Inter, Arial, sans-serif" font-size="28" fill="#dff1ff" opacity=".85">${esc(platform)}</text>
        <text x="${size.w - 30}" y="80" text-anchor="end" font-family="Inter, Arial" font-size="28" fill="#dff1ff" opacity=".85">${levelTxt}</text>
        <foreignObject x="30" y="120" width="${size.w - 60}" height="${size.h - 240}">
          <div xmlns="http://www.w3.org/1999/xhtml"
               style="font-family:Inter, Arial; color:#f6fbff; font-weight:800; font-size:64px; line-height:1.05; display:flex; align-items:center; height:100%;">
            ${esc(title)}
          </div>
        </foreignObject>
        <circle cx="${size.w - 70}" cy="${size.h - 70}" r="48" fill="#0b1220cc" stroke="#ffffff44" stroke-width="2"/>
        <text x="${size.w - 70}" y="${size.h - 62}" text-anchor="middle" font-family="Inter, Arial" font-weight="700" font-size="28" fill="#c7ffe4">${score.toString().replace('.', ',')}</text>
      </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function gameCard(g) {
    const card = document.createElement('div'); card.className = 'card';
    const imgSrc = (loadCovers()[g.id]) || autoCover(g.title, g.platform, g.score);
    const cover = document.createElement('a');
    cover.href = `https://www.google.com/search?q=${encodeURIComponent(g.title + ' ' + g.platform)}&tbm=isch`;
    cover.target = '_blank'; cover.rel = 'noopener'; cover.className = 'cover';
    const img = document.createElement('img'); img.loading = 'lazy'; img.alt = `Portada de ${g.title}`; img.src = imgSrc; cover.appendChild(img);
    const b1 = document.createElement('div'); b1.className = 'badge'; b1.textContent = g.platform;
    const b2 = document.createElement('div'); b2.className = 'score'; b2.dataset.level = level(g.score); b2.textContent = g.score.toString().replace('.', ',');
    cover.append(b1, b2);
    const body = document.createElement('div'); body.className = 'body';
    const title = document.createElement('div'); title.className = 'title'; title.textContent = g.title;
    const sub = document.createElement('div'); sub.className = 'sub'; sub.textContent = `Año: ${g.year}`;
    const actions = document.createElement('div'); actions.className = 'actions';

    const btnUrl = document.createElement('button'); btnUrl.className = 'btn'; btnUrl.textContent = 'Pegar URL de portada';
    btnUrl.onclick = () => { const url = prompt('Pega URL directa de imagen:', loadCovers()[g.id] || ''); if (url) { const map = loadCovers(); map[g.id] = url; saveCovers(map); img.src = url; } };

    const btnUp = document.createElement('button'); btnUp.className = 'btn'; btnUp.textContent = 'Subir portada…';
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
    btnUp.onclick = () => inp.click();
    inp.onchange = () => { const f = inp.files[0]; if (!f) return; const fr = new FileReader(); fr.onload = () => { const map = loadCovers(); map[g.id] = fr.result; saveCovers(map); img.src = fr.result; }; fr.readAsDataURL(f); };

    const btnReset = document.createElement('button'); btnReset.className = 'btn'; btnReset.textContent = 'Usar autoportada';
    btnReset.onclick = () => { const map = loadCovers(); delete map[g.id]; saveCovers(map); img.src = autoCover(g.title, g.platform, g.score); };

    actions.append(btnUrl, btnUp, btnReset, inp);
    body.append(title, sub, actions);
    card.append(cover, body);
    return card;
  }

  function render() {
    const f = getFilters();
    document.querySelectorAll('#chips .chip').forEach(ch => ch.classList.toggle('active', [...platformSel.selectedOptions].some(o => o.value === ch.textContent)));
    let list = GAMES.filter(g =>
      (f.year ? g.year === f.year : true) &&
      (f.plats.length ? f.plats.includes(g.platform) : true) &&
      (f.term ? g.title.toLowerCase().includes(f.term) : true) &&
      (g.score >= f.min)
    );
    switch (f.sort) {
      case 'doc': list.sort((a, b) => a.idx - b.idx); break;
      case 'year-desc': list.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'es')); break;
      case 'year-asc': list.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, 'es')); break;
      case 'title-asc': list.sort((a, b) => a.title.localeCompare(b.title, 'es')); break;
      case 'score-desc': list.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es')); break;
      case 'score-asc': list.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title, 'es')); break;
    }
    const avg = arr => (arr.reduce((s, x) => s + x.score, 0) / Math.max(1, arr.length));
    meta.textContent = `Mostrando ${list.length} de ${GAMES.length} juegos · Nota media: ${avg(list).toFixed(2).replace('.', ',')}`;
    if (!list.length) { app.innerHTML = `<div class="empty">No hay resultados con los filtros actuales.</div>`; return; }
    app.innerHTML = '';
    if (f.sort === 'doc') {
      const yearsDesc = [...new Set(list.map(g => g.year))].sort((a, b) => b - a);
      for (const y of yearsDesc) {
        const h = document.createElement('h2'); h.className = 'year'; h.textContent = y;
        const grid = document.createElement('div'); grid.className = 'grid';
        list.filter(x => x.year === y).forEach(g => grid.appendChild(gameCard(g)));
        app.append(h, grid);
      }
    } else {
      const byYear = list.reduce((acc, g) => { (acc[g.year] ||= []).push(g); return acc; }, {});
      const years = Object.keys(byYear).map(Number).sort(f.sort.includes('asc') ? (a, b) => a - b : (a, b) => b - a);
      for (const y of years) {
        const h = document.createElement('h2'); h.className = 'year'; h.textContent = y;
        const grid = document.createElement('div'); grid.className = 'grid';
        byYear[y].forEach(g => grid.appendChild(gameCard(g)));
        app.append(h, grid);
      }
    }
  }

  minScore.addEventListener('input', () => { minScoreVal.textContent = minScore.value.replace('.', ','); render(); });
  [q, yearSel, platformSel, sortSel].forEach(el => el.addEventListener('input', render));
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); q.focus(); q.select(); } });

  render();
}
