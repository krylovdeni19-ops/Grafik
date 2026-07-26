function renderEmployees() {
  const container = Utils.$('employeesRows');
  if (!container) return;
  
  let html = "";
  AppState.employees.forEach((e, i) => {
    const def = getShiftType(e.shift);
    const typeLabel = e.shift && e.shift.includes('День') ? '🟡' : 
                      e.shift && e.shift.includes('Ночь') ? '🔵' : '';
    
    html += `<div class="rowline">
      <input value="${e.name}" placeholder="ФИО" onchange="updateEmployee(${i}, 'name', this.value)">
      <input value="${e.id||''}" placeholder="Табельный №" onchange="updateEmployee(${i}, 'id', this.value)">
      <div class="shift-pill-wrap">
        <select onchange="updateEmployee(${i}, 'shift', this.value)">
          <option value="">— тип —</option>
          ${Object.keys(AppState.shiftTypes).map(s => 
            `<option value="${s}" ${e.shift===s?'selected':''}>${s}</option>`
          ).join('')}
        </select>
        ${def ? renderCyclePreview(def) : ''}
        ${typeLabel ? `<span style="font-size:14px;">${typeLabel}</span>` : ''}
      </div>
      <button class="icon-btn" onclick="removeEmployee(${i})">✕</button>
    </div>`;
  });
  
  container.innerHTML = html || `<div class="empty-note">Нет сотрудников</div>`;
}

function updateEmployee(index, field, value) {
  AppState.employees[index][field] = value;
  renderAll();
}

function addEmployee() {
  AppState.employees.push({name: "Новый сотрудник", id: "", shift: ""});
  renderAll();
}

function removeEmployee(index) {
  AppState.employees.splice(index, 1);
  renderAll();
}