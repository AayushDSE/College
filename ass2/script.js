const STORAGE_KEY = 'students-ledger';
const tableWrap = document.getElementById('table-wrap');
const form = document.getElementById('student-form');
const formMsg = document.getElementById('form-msg');

let students = [];

function gradeFor(pct){
  if (pct >= 90) return { letter:'A+', cls:'good' };
  if (pct >= 75) return { letter:'A',  cls:'good' };
  if (pct >= 60) return { letter:'B',  cls:'mid'  };
  if (pct >= 45) return { letter:'C',  cls:'mid'  };
  if (pct >= 33) return { letter:'D',  cls:'bad'  };
  return { letter:'F', cls:'bad' };
}

function loadStudents(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    students = raw ? JSON.parse(raw) : [];
  }catch(err){
    students = [];
  }
  render();
}

function saveStudents(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }catch(err){
    formMsg.textContent = 'Could not save record — please try again.';
  }
}

function render(){
  if (students.length === 0){
    tableWrap.innerHTML = '<div class="empty-state">No records yet. Add the first student above.</div>';
    return;
  }

  const rows = students.map(s => {
    const g = gradeFor(s.percentage);
    const gradeColor = g.cls === 'good' ? '#3f7d58' : g.cls === 'mid' ? '#b8862f' : '#a13d3d';
    return `
      <tr>
        <td class="num">${s.roll}</td>
        <td class="name-cell">${s.name}</td>
        <td class="num">${s.marks[0]}</td>
        <td class="num">${s.marks[1]}</td>
        <td class="num">${s.marks[2]}</td>
        <td class="num">${s.marks[3]}</td>
        <td class="num">${s.marks[4]}</td>
        <td class="num">${s.total}/500</td>
        <td class="num pct ${g.cls}">${s.percentage.toFixed(2)}%</td>
        <td class="num"><span class="grade-pill" style="color:${gradeColor}">${g.letter}</span></td>
        <td class="num"><button class="del-btn" title="Delete" onclick="deleteStudent('${s.id}')">✕</button></td>
      </tr>`;
  }).join('');

  tableWrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Roll</th>
          <th>Name</th>
          <th class="num">S1</th>
          <th class="num">S2</th>
          <th class="num">S3</th>
          <th class="num">S4</th>
          <th class="num">S5</th>
          <th class="num">Total</th>
          <th class="num">%</th>
          <th class="num">Grade</th>
          <th class="num"></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function deleteStudent(id){
  students = students.filter(s => s.id !== id);
  saveStudents();
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formMsg.textContent = '';

  const name = document.getElementById('s-name').value.trim();
  const roll = document.getElementById('s-roll').value.trim();
  const marks = ['m1','m2','m3','m4','m5'].map(id => Number(document.getElementById(id).value));

  if (!name || !roll){
    formMsg.textContent = 'Please enter both name and roll number.';
    return;
  }
  if (marks.some(m => isNaN(m) || m < 0 || m > 100)){
    formMsg.textContent = 'Each subject mark must be a number between 0 and 100.';
    return;
  }

  const total = marks.reduce((a,b) => a + b, 0);
  const percentage = (total / 500) * 100;

  students.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,7),
    name, roll, marks, total, percentage
  });

  saveStudents();
  render();
  form.reset();
  document.getElementById('s-name').focus();
});

loadStudents();