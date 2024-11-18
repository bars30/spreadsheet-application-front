window.onload = function() {
  
    const token = localStorage.getItem('token');
    const inputs = document.querySelectorAll('.cell');
    const signOutButton = document.querySelector('.signOutButton');
    const notification = document.querySelector('.notification');
    const toolbarCont = document.querySelector('.toolbar-cont');
  
    localStorage.removeItem('registerPassword');
    if (!token) {
      inputs.forEach(input => input.disabled = true);
      signOutButton.hidden = true;
      signOutButton.style.opacity = 0;
      signOutButton.style.pointerEvents = 'none';
      toolbarCont.style.display = "none";
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';
    } else {
      notification.style.display = "none";
      notification.style.opacity = 0;
      const email = localStorage.getItem('email') || localStorage.getItem('registerEmail');
      document.querySelector('.email').innerText = `${email}`;
    }
  };
  
  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  localStorage.clear();
    window.location.href = './index.html';
  localStorage.clear();
  }
  
  let rowCount = 2;
  let colCount = 9; 
  const cellFormulas = {};
  let activeFormulaCell = null;
  let lastDValue = 100;
  let lastEValue = 1;
  let lastFValue = 600;

  function getDValues() {
    const dValues = [];
    for (let row = 2; row <= rowCount; row++) {
      const dCell = document.getElementById(`D${row}`);
      if (dCell) {
        const value = parseFloat(dCell.value.trim()) || 0; 
        dValues.push(value);
      }
    }
    
    return dValues;
  }

  function getEValues() {
    const eValues = [];
    for (let row = 2; row <= rowCount; row++) {
      const eCell = document.getElementById(`E${row}`);
      if (eCell) {
        const value = parseFloat(eCell.value.trim()) || 0; 
        eValues.push(value);
      }
    }
    
    return eValues;
  }

  async function fetchGValues() {
    valuesD = getDValues()
    valuesE = getEValues()
    try {
      const response = await fetch('http://localhost:3000/calculateGValues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "dValues": valuesD, 
          "rateValue": valuesE
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Registration failed: ${errorData.error}`);
      }
  
      const json = await response.json();

      updateGCells(json);
    } catch (error) {
      console.error(error.message);
      alert(error.message); 
    } 
  }
  
  
  
  function getColumnValues(column) {
    const values = [];
    for (let row = 2; row <= rowCount; row++) {
      const cell = document.getElementById(`${column}${row}`);
      if (cell) { 
        values.push(parseFloat(cell.value) || 0);
      } 
    }
    return values;
  }
  
  
  function getRateValue() {
    return parseFloat(document.getElementById('customRate').value) || 0.1;
  }  

  function updateGCells(gValues) {
    if (Array.isArray(gValues)) {
      gValues.forEach((gValue, index) => {
        const gCell = document.getElementById(`G${index + 2}`); 
        if (gCell) {
          gCell.value = gValue.toFixed(2); 
        }
      });
    } else {
      return;
    }
  }
  

  
  function createCell(rowNumber, colLetter) {
    const cell = document.createElement('input');
    cell.type = 'number';
    cell.id = `${colLetter}${rowNumber}`;
    cell.classList.add('cell');
    cell.onkeydown = handleKeyDown;
    cell.onclick = handleCellClick;
  
    if (colLetter === 'G') {
      cell.style.backgroundColor ="#cfedbc";
      cell.disabled = true;
    } else if (colLetter === 'A') {
      cell.style.backgroundColor = '#5882cb8c';
      cell.oninput = () => handleAColumnInput(rowNumber);
    } else if (colLetter === 'D') {
      cell.style.backgroundColor = "#ffe699";
      cell.value = lastDValue;
      cell.oninput = () => handleDColumnInput(rowNumber);
    } else if (colLetter === 'J' && rowNumber === 2) {
      cell.value = 0.1;
      cell.oninput = () => handleCustomRate(rowNumber);
      cell.style.backgroundColor = "#FFC000";
    } else if (colLetter === 'E') {
      cell.style.backgroundColor = "#fff2cc";
      cell.value = lastEValue; 
      cell.oninput = () => handleEColumnInput(rowNumber);
    } else if (colLetter === "F"){
      cell.oninput = () => handleFColumnInput(rowNumber);
    }
  
    return cell;
  }
  
  function handleFColumnInput(rowNumber) {
    const currentCell = document.getElementById(`F${rowNumber}`);
  
    const value = currentCell.value;
    lastFValue = value;
  
    for (let i = rowNumber; i <= rowCount; i++) {
      const cellBelow = document.getElementById(`F${i}`);
      if (cellBelow) {
        cellBelow.value = value;
      }
    }
  
  }
  
  function handleAColumnInput(rowNumber) {
    const currentCell = document.getElementById(`A${rowNumber}`);
    const newValue = parseInt(currentCell.value);
  
    if (!isNaN(newValue)) {
      for (let r = rowNumber + 1; r <= rowCount; r++) {
        const cellBelow = document.getElementById(`A${r}`);
        if (cellBelow) {
          cellBelow.value = newValue + (r - rowNumber);
        }
      }
    }
  }
  
  

  function handleDColumnInput(rowNumber) {
    const currentCell = document.getElementById(`D${rowNumber}`);
    const value = currentCell.value;
  
    lastDValue = value; 
  
   
    for (let i = rowNumber + 1; i <= rowCount; i++) {
      const cellBelow = document.getElementById(`D${i}`);
      if (cellBelow) {
        cellBelow.value = value; 
      }
    }
  
  fetchGValues();
  }
  
  function addRow() {
    const spreadsheet = document.getElementById('spreadsheet');
    const row = document.createElement('div');
    row.classList.add('row');
  
    const rowNumber = document.createElement('div');
    rowNumber.classList.add('row-number');
    rowNumber.innerText = rowCount; 
    row.appendChild(rowNumber);
  
    const previousRowAValue = document.getElementById(`A${rowCount - 1}`)?.value;
  
    for (let i = 0; i < colCount; i++) {
      const colLetter = String.fromCharCode(65 + i); 
      if (colLetter === 'B' || colLetter === 'C') continue; 
      const cell = createCell(rowCount, colLetter);
  
      if (colLetter === 'A' && previousRowAValue) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const newValue = parseInt(previousRowAValue) + 1 || currentYear; 
        cell.value = newValue;
      }
  

      if (colLetter === 'F') {
        if (rowCount === 2) {
          cell.value = 1000; 
        } else if (rowCount >= 3 && rowCount <= 46) {
          cell.value = lastFValue; 
        }
      }
  
      row.appendChild(cell);
    }
  
    spreadsheet.appendChild(row);
   
    updateGCells(rowCount);
  fetchGValues();
   
    rowCount++;
  }
  
  function moveToNextCell(currentCell) {
    const currentRow = currentCell.parentElement;
    const cells = Array.from(currentRow.querySelectorAll('.cell'));
    const currentIndex = cells.indexOf(currentCell);
  
    if (currentIndex >= 0 && currentIndex < cells.length - 1) {
      const nextCell = cells[currentIndex + 1];
      nextCell.focus(); 
    }
  }
  
  function handleKeyDown(event) {
    const cell = event.target;
  
    if (event.key === '=' && !activeFormulaCell) {
      activeFormulaCell = cell;
      cell.value = '';
    }
  
    if (event.key === 'Enter' && activeFormulaCell) {
      evaluateCell(activeFormulaCell); 
      moveToNextCell(cell); 
      activeFormulaCell = null;
    }
  }
  
  function handleCellClick(event) {
    const clickedCell = event.target;
    if (activeFormulaCell) {
      activeFormulaCell.value += clickedCell.id;
      activeFormulaCell.focus();
      highlightCell(clickedCell);
    }
  }
  
  function highlightCell(cell) {
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(c => c.classList.remove('highlight'));
    cell.classList.add('highlight');
  }
  
  function evaluateCell(cell) {
    const value = cell.value.trim();
  
    if (value.startsWith('=')) {
      const formula = value.slice(1);
      const formulaWithValues = formula.replace(/[A-J][0-9]+/g, function(match) {
        const referencedCell = document.getElementById(match);
        return referencedCell ? parseFloat(referencedCell.value) || 0 : 0;
      });
  
      try {
        const result = eval(formulaWithValues); 
        cell.value = result.toFixed(2); 
      } catch (error) {
        cell.value = 'ERROR'; 
      }
    } else {
      cellFormulas[cell.id] = value; 
    }
  }

  function updateCells() {
    const rateValue = parseFloat(document.getElementById('customRate').value) || 0.1;
  
    for (let row = 2; row <= rowCount; row++) {
      let gPrevValue = document.getElementById(`G${row - 1}`)?.value.trim() || "0";
      let dValue = document.getElementById(`D${row}`)?.value.trim() || "0";
  
      gPrevValue = parseFloat(gPrevValue) || 0;
      dValue = parseFloat(dValue) || 0;
  
      const gValue = (gPrevValue + dValue) * rateValue + (gPrevValue + dValue);
  
      const gCell = document.getElementById(`G${row}`);
      if (gCell) {
        gCell.value = gValue.toFixed(2); 
      }
    }
    initializeRows();
  }

  function handleCustomRate() {
    const rateValue = parseFloat(document.getElementById('customRate').value);
  
    if (!isNaN(rateValue)) {
      for (let r = 2; r <= rowCount; r++) {
        const eCell = document.getElementById(`E${r}`);
        if (eCell) {
          eCell.value = rateValue; 
          updateGCells(r); 
        }
      }
      fetchGValues()
    }
  }
  
  function handleEColumnInput(rowNumber) {
    const currentCell = document.getElementById(`E${rowNumber}`);
    const newValue = currentCell.value;
  
    lastEValue = newValue; 
  
  
    for (let r = rowNumber + 1; r <= rowCount; r++) {
      const cellBelow = document.getElementById(`E${r}`);
      if (cellBelow) {
        cellBelow.value = newValue; 
      }
    }
  
    updateGCells(rowNumber);
    fetchGValues();
  }
  
  
  function initializeRows() {
    for (let row = 2; row < rowCount; row++) {
      const aCell = document.getElementById(`A${row}`);
      if (aCell) {
        let previousValue = document.getElementById(`A${row - 1}`).value;
        if (!isNaN(previousValue) && previousValue !== "") {
          aCell.value = parseInt(previousValue) + 1;
        }
      }
    }
  }
  
  for (let index = 0; index < 41; index++) {
    addRow();
  }
  
  function exportToCSV() {
    let data = [];
    let rows = document.querySelectorAll(".row");
  
    rows.forEach((row) => {
      let rowData = [];
      let cells = row.querySelectorAll("input.cell");
      cells.forEach((cell) => {
        rowData.push(cell.value || "");
      });
      data.push(rowData.join(",")); 
    });
  
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }
  
    let csvContent = "data:text/csv;charset=utf-8," + data.join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spreadsheet_data.csv");
    document.body.appendChild(link);
  
    link.click();
    document.body.removeChild(link);
  }
  
  initializeRows(); 
  fetchGValues(); 