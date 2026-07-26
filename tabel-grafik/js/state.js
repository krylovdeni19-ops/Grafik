// Состояние приложения
let AppState = {
  shiftTypes: JSON.parse(JSON.stringify(CONFIG.DEFAULT_SHIFT_TYPES)),
  employees: JSON.parse(JSON.stringify(CONFIG.DEFAULT_EMPLOYEES)),
  swaps: [],
  currentView: 'table'
};

// Функции для работы с состоянием
function getShiftType(name) {
  return AppState.shiftTypes[name] || null;
}

function getEmployees() {
  return AppState.employees;
}

function getSwaps() {
  return AppState.swaps;
}

function addEmployee(employee) {
  AppState.employees.push(employee);
}

function removeEmployee(index) {
  AppState.employees.splice(index, 1);
}

function addSwap(swap) {
  AppState.swaps.push(swap);
}

function removeSwap(index) {
  AppState.swaps.splice(index, 1);
}

function setView(view) {
  AppState.currentView = view;
}