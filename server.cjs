const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do CORS para permitir requisições do frontend Vite
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Inicialização do Banco de Dados SQLite
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite em:', dbPath);
    createTable();
  }
});

function createTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      rowNumber INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela "workouts":', err.message);
    } else {
      console.log('Tabela "workouts" verificada/criada com sucesso.');
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      age INTEGER,
      weight REAL,
      height REAL,
      goal TEXT,
      memberSince TEXT DEFAULT 'junho de 2025'
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela "profile":', err.message);
    } else {
      console.log('Tabela "profile" verificada/criada com sucesso.');
      // Insere o perfil padrão se não existir nenhum
      db.run(`
        INSERT OR IGNORE INTO profile (id, name, email, age, weight, height, goal, memberSince)
        VALUES (1, 'João Silva', 'joao@email.com', 24, 78, 178, 'Hipertrofia', 'junho de 2025')
      `, (insertErr) => {
        if (insertErr) {
          console.error('Erro ao inserir perfil padrão:', insertErr.message);
        } else {
          console.log('Perfil padrão verificado/inserido.');
        }
      });
    }
  });
}

// Endpoint: READ (POST)
app.post('/api/workouts/read', (req, res) => {
  const query = `
    SELECT rowNumber, exercise, sets, reps, weight, date, notes 
    FROM workouts 
    ORDER BY rowNumber ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao ler treinos:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    // Mapeamento para o formato esperado pelo frontend do Figma/Make
    const mapped = rows.map(r => ({
      RowNumber: r.rowNumber,
      Exercicio: r.exercise,
      Series: r.sets,
      Repeticoes: r.reps,
      Carga: r.weight,
      Data: r.date,
      Observacao: r.notes || ''
    }));
    
    console.log(`[READ] Retornando ${mapped.length} treinos.`);
    res.json(mapped);
  });
});

// Endpoint: CREATE (POST)
app.post('/api/workouts/create', (req, res) => {
  const { Exercicio, Series, Repeticoes, Carga, Data, Observacao } = req.body;
  
  if (!Exercicio || Series === undefined || Repeticoes === undefined || Carga === undefined || !Data) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  const query = `
    INSERT INTO workouts (exercise, sets, reps, weight, date, notes) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [Exercicio, Series, Repeticoes, Carga, Data, Observacao || ''], function(err) {
    if (err) {
      console.error('Erro ao criar treino:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`[CREATE] Novo treino inserido com RowNumber (ID): ${this.lastID}`);
    res.json({ success: true, RowNumber: this.lastID });
  });
});

// Endpoint: UPDATE (POST)
app.post('/api/workouts/update', (req, res) => {
  const { RowNumber, Exercicio, Series, Repeticoes, Carga, Data, Observacao } = req.body;
  
  if (!RowNumber || !Exercicio || Series === undefined || Repeticoes === undefined || Carga === undefined || !Data) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes para atualização.' });
  }

  const query = `
    UPDATE workouts 
    SET exercise = ?, sets = ?, reps = ?, weight = ?, date = ?, notes = ? 
    WHERE rowNumber = ?
  `;
  
  db.run(query, [Exercicio, Series, Repeticoes, Carga, Data, Observacao || '', RowNumber], function(err) {
    if (err) {
      console.error('Erro ao atualizar treino:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`[UPDATE] Treino RowNumber ${RowNumber} atualizado. Modificações: ${this.changes}`);
    res.json({ success: true, changes: this.changes });
  });
});

// Endpoint: DELETE (POST)
app.post('/api/workouts/delete', (req, res) => {
  const { RowNumber } = req.body;
  
  if (!RowNumber) {
    return res.status(400).json({ error: 'RowNumber é obrigatório para exclusão.' });
  }

  const query = `
    DELETE FROM workouts 
    WHERE rowNumber = ?
  `;
  
  db.run(query, [RowNumber], function(err) {
    if (err) {
      console.error('Erro ao excluir treino:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log(`[DELETE] Treino RowNumber ${RowNumber} excluído. Modificações: ${this.changes}`);
    res.json({ success: true, changes: this.changes });
  });
});

// Endpoint: PROFILE GET (GET)
app.get('/api/profile', (req, res) => {
  db.get("SELECT name, email, age, weight, height, goal, memberSince FROM profile WHERE id = 1", [], (err, row) => {
    if (err) {
      console.error('Erro ao obter perfil:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Endpoint: PROFILE UPDATE (POST)
app.post('/api/profile/update', (req, res) => {
  const { name, email, age, weight, height, goal } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
  }

  const query = `
    UPDATE profile 
    SET name = ?, email = ?, age = ?, weight = ?, height = ?, goal = ? 
    WHERE id = 1
  `;
  
  db.run(query, [
    name, 
    email, 
    age ? parseInt(age) : null, 
    weight ? parseFloat(weight) : null, 
    height ? parseInt(height) : null, 
    goal || ''
  ], function(err) {
    if (err) {
      console.error('Erro ao atualizar perfil:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`[PROFILE] Perfil atualizado.`);
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando com SQLite na porta ${PORT}`);
});
