// История для Undo/Redo
let History = {
  data: [],
  index: -1,
  maxLength: CONFIG.MAX_HISTORY,
  
  push: function() {
    const state = JSON.stringify({
      employees: AppState.employees,
      swaps: AppState.swaps,
      shiftTypes: AppState.shiftTypes
    });
    this.data = this.data.slice(0, this.index + 1);
    this.data.push(state);
    if (this.data.length > this.maxLength) this.data.shift();
    this.index = this.data.length - 1;
  },
  
  undo: function() {
    if (this.index > 0) {
      this.index--;
      this.restore(this.data[this.index]);
      return true;
    }
    return false;
  },
  
  redo: function() {
    if (this.index < this.data.length - 1) {
      this.index++;
      this.restore(this.data[this.index]);
      return true;
    }
    return false;
  },
  
  restore: function(json) {
    const data = JSON.parse(json);
    AppState.employees = data.employees;
    AppState.swaps = data.swaps;
    AppState.shiftTypes = data.shiftTypes;
    renderAll();
  }
};