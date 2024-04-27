const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'cars'
});

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.json({ 
    message: 'Conexión de base de datos de carros en la red con docker' +
    '👉🏻 Visita `/api/cars` para listar todos los carros de la base de datos' +
    '👉🏻 Visita `/api/cars/:id` para obtener el carro por su id' +
    '👉🏻 Envia un json a `/api/cars/` para añadir un nuevo carro a la base de datos' +
    'Proyecto elaborado por: <Juan ALvarez> <Juan Forero> <Stiven Alvarez> <Juan Perea>'
}));

app.get('/api/cars', (req, res) =>
    // Fetch all cars in db
    db.query('SELECT * FROM cars', (err, rows) => {
        if (err) throw err;
        res.json(rows);
    })
);


app.get('/api/cars/:id', (req, res) =>
    // Fetch a specific car in db
    db.query('SELECT * FROM cars WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) throw err;
        res.json(rows);
    })
);

app.post('/api/cars', (req, res) =>
    // Add a new car to db
    db.query('INSERT INTO cars (name, model, price) VALUES (?, ?, ?)', [req.body.name, req.body.model, req.body.price], (err, rows) => {
        if (err) {
            res.json({ message: 'Error adding car to database' });
            throw err;
        }
        res.json({ message: 'Car added to database' });
    })
    
);

// Modificar un coche por ID
app.put('/api/cars/:id', (req, res) => {
    const { name, model, price } = req.body;
    db.query('UPDATE cars SET name = ?, model = ?, price = ? WHERE id = ?', [name, model, price, req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error updating car' });
        } else {
            res.json({ message: 'Car updated successfully' });
        }
    });
});

// Borrar un coche por ID
app.delete('/api/cars/:id', (req, res) => {
    db.query('DELETE FROM cars WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error deleting car' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Car not found' });
            } else {
                res.json({ message: 'Car deleted successfully' });
            }
        }
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
