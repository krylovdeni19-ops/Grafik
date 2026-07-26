function renderShiftTypes() {
  const container = Utils.$('shiftTypesRows');
  if (!container) return;
  
  let html = "";
  Object.keys(AppState.shiftTypes).forEach(name => {
    const d = AppState.shiftTypes[name];
    const typeLabel = name.includes('День') ? '🟡' : '🔵';
    
    html += `<div class="rowline" style="grid-template-columns:1fr;">
      <div style="font-weight:600;font-size:calc(var(--brand-font)*0.5);">${name} ${typeLabel}</div>
      <div class="field" style="gap:2px;">
        <label>Дней в цикле</label>
        <input type="number" value="${d.cycle}" onchange="updateShiftType('${name}', 'cycle', parseInt(this.value)||1)">
      </div>
      <div class="field" style="gap:2px;">
        <label>Рабочих дней</label>
        <input type="number" value="${d.work}" onchange="updateShiftType('${name}', 'work', parseInt(this.value)||0)">
      </div>
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        ${renderCyclePreview(d)}
        <label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted);">
          <input type="checkbox" style="width:auto;" ${d.invert?'checked':''} 
                 onchange="updateShiftType('${name}', 'invert', this.checked)"> в конце цикла
        </label>
      </div>
    </div>`;
  });
  
  container.innerHTML = html;
}

function updateShiftType(name, field, value) {
  AppState.shiftTypes[name][field] = value;
  renderAll();
}

function renderCyclePreview(def) {
  let html = `<span class="cycle-preview">`;
  for (let i = 0; i < def.cycle; i++) {
    const on = def.invert ? (i >= def.work) : (i < def.work);
    const cls = on ? 'on' : '';
    html += `<i class="${cls}"></i>`;
  }
  html += `</span>`;
  return html;
}