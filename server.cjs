const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Banco de dados em arquivo JSON
const DB_PATH = path.join(__dirname, 'db.json');

function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ workouts: [], profile: { id: 1, name: 'João Silva', email: 'joao@email.com', age: 24, weight: 78, height: 178, goal: 'Hipertrofia', memberSince: 'junho de 2025' }, nextId: 1 }));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch { return { workouts: [], profile: { id: 1, name: 'João Silva', email: 'joao@email.com', age: 24, weight: 78, height: 178, goal: 'Hipertrofia', memberSince: 'junho de 2025' }, nextId: 1 }; }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// READ
app.post('/api/workouts/read', (req, res) => {
  const db = loadDB();
  const mapped = db.workouts.map(w => ({
    RowNumber: w.rowNumber,
    Exercicio: w.exercise,
    Series: w.sets,
    Repeticoes: w.reps,
    Carga: w.weight,
    Data: w.date,
    Observacao: w.notes || ''
  }));
  console.log(`[READ] ${mapped.length} treinos`);
  res.json(mapped);
});

// CREATE
app.post('/api/workouts/create', (req, res) => {
  const { Exercicio, Series, Repeticoes, Carga, Data, Observacao } = req.body;
  if (!Exercicio || !Data) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  const db = loadDB();
  const newWorkout = { rowNumber: db.nextId++, exercise: Exercicio, sets: Series, reps: Repeticoes, weight: Carga, date: Data, notes: Observacao || '' };
  db.workouts.push(newWorkout);
  saveDB(db);
  console.log(`[CREATE] Treino ${newWorkout.rowNumber} criado`);
  res.json({ success: true, RowNumber: newWorkout.rowNumber });
});

// UPDATE
app.post('/api/workouts/update', (req, res) => {
  const { RowNumber, Exercicio, Series, Repeticoes, Carga, Data, Observacao } = req.body;
  if (!RowNumber) return res.status(400).json({ error: 'RowNumber obrigatório.' });
  const db = loadDB();
  const idx = db.workouts.findIndex(w => w.rowNumber === Number(RowNumber));
  if (idx === -1) return res.status(404).json({ error: 'Treino não encontrado.' });
  db.workouts[idx] = { rowNumber: Number(RowNumber), exercise: Exercicio, sets: Series, reps: Repeticoes, weight: Carga, date: Data, notes: Observacao || '' };
  saveDB(db);
  console.log(`[UPDATE] Treino ${RowNumber} atualizado`);
  res.json({ success: true });
});

// DELETE
app.post('/api/workouts/delete', (req, res) => {
  const { RowNumber } = req.body;
  if (!RowNumber) return res.status(400).json({ error: 'RowNumber obrigatório.' });
  const db = loadDB();
  db.workouts = db.workouts.filter(w => w.rowNumber !== Number(RowNumber));
  saveDB(db);
  console.log(`[DELETE] Treino ${RowNumber} removido`);
  res.json({ success: true });
});

// PROFILE GET
app.get('/api/profile', (req, res) => {
  const db = loadDB();
  res.json(db.profile);
});

// PROFILE UPDATE
app.post('/api/profile/update', (req, res) => {
  const { name, email, age, weight, height, goal } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nome e E-mail obrigatórios.' });
  const db = loadDB();
  db.profile = { ...db.profile, name, email, age: age || null, weight: weight || null, height: height || null, goal: goal || '' };
  saveDB(db);
  console.log('[PROFILE] Perfil atualizado');
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Servidor GymLog rodando na porta ${PORT}`);
  loadDB();
  console.log('Banco de dados JSON inicializado!');
});
