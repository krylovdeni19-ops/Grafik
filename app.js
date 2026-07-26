// Инициализация
function init() {
  initMonthSelect();
  loadFromStorage();
  renderAll();
  setupEventListeners();
  
  // Устанавливаем текущий месяц
  const today = new Date();
  Utils.$('monthSel').value = today.getMonth();
  Utils.$('yearInput').value = today.getFullYear();
}

function renderAll() {
  History.push();
  renderEmployees();
  renderShiftTypes();
  renderSwaps();
  renderSchedule();
  saveToStorage();
  updateViewButtons();
}

function renderSchedule() {
  if (AppState.currentView === 'table') {
    renderTable();
  } else {
    renderCalendar();
  }
}

function updateViewButtons() {
  const buttons = document.querySelectorAll('.view-toggle button');
  buttons.forEach(b => {
    b.classList.toggle('active', b.dataset.view === AppState.currentView);
  });
  
  const tableContainer = Utils.$('tableContainer');
  const calendarContainer = Utils.$('calendarContainer');
  
  if (tableContainer) {
    tableContainer.style.display = AppState.currentView === 'table' ? 'block' : 'none';
  }
  if (calendarContainer) {
    calendarContainer.style.display = AppState.currentView === 'calendar' ? 'block' : 'none';
  }
}

function switchView(view) {
  AppState.currentView = view;
  renderAll();
}

function setupEventListeners() {
  // Табы
  document.querySelectorAll('#app-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#app-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tab = btn.dataset.tab;
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      const panel = Utils.$(`tab-${tab}`);
      if (panel) panel.classList.add('active');
    });
  });
  
  // Поиск с debounce
  let searchTimeout;
  const searchInput = Utils.$('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(renderSchedule, 300);
    });
  }
  
  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (History.undo()) Utils.showToast('↩ Отменено');
      else Utils.showToast('❌ Нечего отменять');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      if (History.redo()) Utils.showToast('↪ Повторено');
      else Utils.showToast('❌ Нечего повторять');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      exportData();
    }
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      shiftMonth(-1);
    }
    if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      shiftMonth(1);
    }
  });
  
  // Импорт
  const importFile = Utils.$('importFile');
  if (importFile) {
    importFile.addEventListener('change', importData);
  }
  
  // Изменение месяца и года
  Utils.$('monthSel')?.addEventListener('change', renderAll);
  Utils.$('yearInput')?.addEventListener('change', renderAll);
  Utils.$('shiftHours')?.addEventListener('change', renderAll);
  Utils.$('refDate')?.addEventListener('change', renderAll);
  Utils.$('filterShift')?.addEventListener('change', renderSchedule);
}

function initMonthSelect() {
  const sel = Utils.$('monthSel');
  if (!sel) return;
  sel.innerHTML = CONFIG.MONTHS.map((m, i) => `<option value="${i}">${m}</option>`).join('');
  sel.value = 7;
}

// Экспорт/Импорт
function exportData() {
  const data = {
    employees: AppState.employees,
    swaps: AppState.swaps,
    shiftTypes: AppState.shiftTypes,
    settings: {
      month: Utils.$('monthSel')?.value || 7,
      year: Utils.$('yearInput')?.value || 2026,
      shiftHours: Utils.$('shiftHours')?.value || 12,
      refDate: Utils.$('refDate')?.value || '2026-08-01'
    }
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "grafik-scio.json";
  a.click();
  URL.revokeObjectURL(url);
  Utils.showToast('✅ Экспортировано');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.employees) AppState.employees = data.employees;
      if (data.swaps) AppState.swaps = data.swaps;
      if (data.shiftTypes) AppState.shiftTypes = data.shiftTypes;
      if (data.settings) {
        if (data.settings.month !== undefined) Utils.$('monthSel').value = data.settings.month;
        if (data.settings.year) Utils.$('yearInput').value = data.settings.year;
        if (data.settings.shiftHours) Utils.$('shiftHours').value = data.settings.shiftHours;
        if (data.settings.refDate) Utils.$('refDate').value = data.settings.refDate;
      }
      renderAll();
      Utils.showToast('✅ Импортировано');
    } catch(err) {
      alert("❌ Ошибка: " + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// Сохранение в localStorage
function saveToStorage() {
  const data = {
    employees: AppState.employees,
    swaps: AppState.swaps,
    shiftTypes: AppState.shiftTypes,
    view: AppState.currentView
  };
  localStorage.setItem('scioSchedule', JSON.stringify(data));
}

function loadFromStorage() {
  const saved = localStorage.getItem('scioSchedule');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.employees) AppState.employees = data.employees;
      if (data.swaps) AppState.swaps = data.swaps;
      if (data.shiftTypes) AppState.shiftTypes = data.shiftTypes;
      if (data.view) AppState.currentView = data.view;
    } catch(e) {}
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);