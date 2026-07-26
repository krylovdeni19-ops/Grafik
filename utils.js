// Утилиты
const Utils = {
  pad: n => String(n).padStart(2, "0"),
  
  dateKey: d => `${d.getFullYear()}-${Utils.pad(d.getMonth()+1)}-${Utils.pad(d.getDate())}`,
  
  daysInMonth: (year, month) => new Date(year, month + 1, 0).getDate(),
  
  isSameDay: (a, b) => a.getFullYear() === b.getFullYear() && 
                        a.getMonth() === b.getMonth() && 
                        a.getDate() === b.getDate(),
  
  parseDate: str => new Date(str + 'T00:00:00'),
  
  getShiftTypeName: shiftName => {
    if (!shiftName) return '';
    if (shiftName.includes('День')) return 'day';
    if (shiftName.includes('Ночь')) return 'night';
    return '';
  },
  
  showToast: (msg) => {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2500);
  },
  
  // DOM shortcuts
  $: id => document.getElementById(id),
  $$: sel => document.querySelectorAll(sel)
};