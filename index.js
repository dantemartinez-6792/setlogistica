const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // versión con promesas

const app = express();
const port = process.env.PORT || 3000;

// Middleware para recibir JSON y manejar CORS
app.use(cors());
app.use(express.json());

// Configuración conexión base de datos (cambia con tus datos)
const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
};

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
// Ruta para obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM cliente');
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para crear un nuevo cliente
app.post('/clientes', async (req, res) => {
  console.log('Datos recibidos en POST /clientes:', req.body);
  try {
    let { idCliente, nombreCliente, direccion, telefono, email } = req.body;

    // Reemplaza undefined por null explícitamente
    direccion = direccion === undefined ? null : direccion;
    telefono = telefono === undefined ? null : telefono;
    email = email === undefined ? null : email;

    // Validar campos necesarios
    if (!idCliente || !nombreCliente) {
      return res.status(400).json({ error: 'idCliente y nombreCliente son obligatorios' });
    }

    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO Cliente (idCliente, nombreCliente, direccion, telefono, email) VALUES (?, ?, ?, ?, ?)';
    await connection.execute(query, [idCliente, nombreCliente, direccion, telefono, email]);
    await connection.end();

    res.json({ message: 'Cliente creado correctamente' });
  } catch (err) {
    console.error('Error guardando cliente:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para editar un cliente existente (con PUT)
app.put('/clientes/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Recibido request PUT para cliente id: ${id}, body:`, req.body);
  try {
    const { nombreCliente, direccion, telefono, email } = req.body;
    // Reemplaza undefined por null
    const direccionVal = direccion === undefined ? null : direccion;
    const telefonoVal = telefono === undefined ? null : telefono;
    const emailVal = email === undefined ? null : email;
    const connection = await mysql.createConnection(dbConfig);
    const query = 'UPDATE Cliente SET nombreCliente = ?, direccion = ?, telefono = ?, email = ? WHERE idCliente = ?';
    const [result] = await connection.execute(query, [nombreCliente, direccionVal, telefonoVal, emailVal, id]);
    await connection.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando cliente:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Ruta para eliminar un cliente (con DELETE)
app.delete('/clientes/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Recibido request DELETE para cliente id: ${id}`);
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM Cliente WHERE idCliente = ?';
    const [result] = await connection.execute(query, [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('Error borrando cliente:', err.message);
    res.status(500).json({ error: err.message });
  }
});



// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Producto');
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nuevo producto
app.post('/productos', async (req, res) => {
  console.log('Datos recibidos en POST /productos:', req.body);
  try {
    const { nombreProducto, descripcion, idCliente } = req.body;

    if (!nombreProducto || !idCliente) {
      return res.status(400).json({ error: 'nombreProducto e idCliente son obligatorios' });
    }

    const descripcionVal = descripcion === undefined ? null : descripcion;

    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO Producto (nombreProducto, descripcion, idCliente) VALUES (?, ?, ?)';
    await connection.execute(query, [nombreProducto, descripcionVal, idCliente]);
    await connection.end();

    res.json({ message: 'Producto creado correctamente' });
  } catch (err) {
    console.error('Error guardando producto:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Editar producto
app.put('/productos/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Recibido request PUT para producto id: ${id}, body:`, req.body);
  try {
    const { nombreProducto, descripcion, idCliente } = req.body;

    if (!nombreProducto || !idCliente) {
      return res.status(400).json({ error: 'nombreProducto e idCliente son obligatorios' });
    }

    const descripcionVal = descripcion === undefined ? null : descripcion;

    const connection = await mysql.createConnection(dbConfig);
    const query = 'UPDATE Producto SET nombreProducto = ?, descripcion = ?, idCliente = ? WHERE idProducto = ?';
    const [result] = await connection.execute(query, [nombreProducto, descripcionVal, idCliente, id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando producto:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
app.delete('/productos/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Recibido request DELETE para producto id: ${id}`);
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM Producto WHERE idProducto = ?';
    const [result] = await connection.execute(query, [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando producto:', err.message);
    res.status(500).json({ error: err.message });
  }
});



// Obtener todas las sucursales
app.get('/sucursales', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Sucursal');
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Crear nueva sucursal
app.post('/sucursales', async (req, res) => {
  console.log('Datos recibidos en POST /sucursales:', req.body);
  try {
    const { nombreSucursal, direccion, telefono } = req.body;
    const direccionVal = direccion === undefined ? null : direccion;
    const telefonoVal = telefono === undefined ? null : telefono;
    if (!nombreSucursal) {
      return res.status(400).json({ error: 'El nombreSucursal es obligatorio' });
    }
    const connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO Sucursal (nombreSucursal, direccion, telefono) VALUES (?, ?, ?)';
    await connection.execute(query, [nombreSucursal, direccionVal, telefonoVal]);
    await connection.end();
    res.json({ message: 'Sucursal creada correctamente' });
  } catch (err) {
    console.error('Error guardando sucursal:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// Editar sucursal existente
app.put('/sucursales/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Recibido request PUT para sucursal id: ${id}, body:`, req.body);
  try {
    const { nombreSucursal, direccion, telefono } = req.body;
    const direccionVal = direccion === undefined ? null : direccion;
    const telefonoVal = telefono === undefined ? null : telefono;
    const connection = await mysql.createConnection(dbConfig);
    const query = 'UPDATE Sucursal SET nombreSucursal = ?, direccion = ?, telefono = ? WHERE idSucursal = ?';
    const [result] = await connection.execute(query, [nombreSucursal, direccionVal, telefonoVal, id]);
    await connection.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }
    res.json({ message: 'Sucursal actualizada correctamente' });
  } catch (err) {
    console.error('Error actualizando sucursal:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// Eliminar sucursal
app.delete('/sucursales/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Recibido request DELETE para sucursal id: ${id}`);
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM Sucursal WHERE idSucursal = ?';
    const [result] = await connection.execute(query, [id]);
    await connection.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }
    res.json({ message: 'Sucursal eliminada correctamente' });
  } catch (err) {
    console.error('Error eliminando sucursal:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// Obtener todos los movimientos
app.get('/movimientos', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Movimientos');
    await connection.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nuevo movimiento
app.post('/movimientos', async (req, res) => {
  try {
    const {
      idMovimiento,
      idSucursal,
      idCliente,
      idProducto,
      pallets,
      bultos,
      observaciones,
      movimiento
    } = req.body;

    if (
      idMovimiento === undefined ||
      idSucursal === undefined ||
      idCliente === undefined ||
      idProducto === undefined ||
      movimiento === undefined
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const palletsVal = pallets === undefined ? null : pallets;
    const bultosVal = bultos === undefined ? null : bultos;
    const observacionesVal = observaciones === undefined ? null : observaciones;

    const connection = await mysql.createConnection(dbConfig);
    const query = `INSERT INTO Movimientos
      (idMovimiento, idSucursal, idCliente, idProducto, pallets, bultos, observaciones, movimiento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await connection.execute(query, [
      idMovimiento,
      idSucursal,
      idCliente,
      idProducto,
      palletsVal,
      bultosVal,
      observacionesVal,
      movimiento
    ]);
    await connection.end();

    res.json({ message: 'Movimiento creado correctamente' });
  } catch (err) {
    console.error('Error guardando movimiento:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Editar movimiento
app.put('/movimientos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const {
      idSucursal,
      idCliente,
      idProducto,
      pallets,
      bultos,
      observaciones,
      movimiento
    } = req.body;

    if (
      idSucursal === undefined ||
      idCliente === undefined ||
      idProducto === undefined ||
      movimiento === undefined
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const palletsVal = pallets === undefined ? null : pallets;
    const bultosVal = bultos === undefined ? null : bultos;
    const observacionesVal = observaciones === undefined ? null : observaciones;

    const connection = await mysql.createConnection(dbConfig);
    const query = `UPDATE Movimientos SET
      idSucursal = ?, idCliente = ?, idProducto = ?, pallets = ?, bultos = ?, observaciones = ?, movimiento = ?
      WHERE idMovimiento = ?`;
    const [result] = await connection.execute(query, [
      idSucursal,
      idCliente,
      idProducto,
      palletsVal,
      bultosVal,
      observacionesVal,
      movimiento,
      id
    ]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json({ message: 'Movimiento actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando movimiento:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar movimiento
app.delete('/movimientos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = 'DELETE FROM Movimientos WHERE idMovimiento = ?';
    const [result] = await connection.execute(query, [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json({ message: 'Movimiento eliminado correctamente' });
  } catch (err) {
    console.error('Error eliminando movimiento:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/movimientos/filtrar', async (req, res) => {
  console.log('Filtros recibidos:', req.query);  // Esto mostrará todos los filtros recibidos
  try {
    const { fechaInicio, fechaFin, idCliente, idProducto, idSucursal, movimiento } = req.query;

    let condiciones = [];
    let valores = [];

    if (fechaInicio) {
      condiciones.push('fechaMovimiento >= ?');
      valores.push(fechaInicio);
    }

    if (fechaFin) {
      condiciones.push('fechaMovimiento <= ?');
      valores.push(fechaFin);
    }

    if (idCliente) {
      condiciones.push('idCliente = ?');
      valores.push(idCliente);
    }

    if (idProducto) {
      condiciones.push('idProducto = ?');
      valores.push(idProducto);
    }

    if (idSucursal) {
      condiciones.push('idSucursal = ?');
      valores.push(idSucursal);
    }

    if (movimiento) {
      condiciones.push('movimiento = ?');
      valores.push(movimiento);
    }

    let sql = 'SELECT * FROM Movimientos';
    if (condiciones.length > 0) {
      sql += ' WHERE ' + condiciones.join(' AND ');
    }

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(sql, valores);
    await connection.end();

    res.json(rows);
  } catch (err) {
    console.error('Error filtrando movimientos:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/test-db', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Intentando conexión a base de datos...');
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Consulta ejecutada correctamente:', rows);
    await connection.end();
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error('Error en conexión a DB:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});



