import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

const dbConfig = {
  host: 'rpm.timka20.ru',
  user: 'root',
  password: 'YanochkaTimkaBulatik007',
  database: 'Restoranchiki',
  waitForConnections: true,
  connectionLimit: 10
};

const pool = mysql.createPool(dbConfig);

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Recipes (
        RecipeID INT AUTO_INCREMENT PRIMARY KEY,
        MenuItemID INT,
        Name VARCHAR(255) NOT NULL,
        Category VARCHAR(100),
        CookingTime INT DEFAULT 30,
        Difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        Rating DECIMAL(3,2) DEFAULT 4.00,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (MenuItemID) REFERENCES Menu(MenuItemID) ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS RecipeIngredients (
        RecipeIngredientID INT AUTO_INCREMENT PRIMARY KEY,
        RecipeID INT NOT NULL,
        Name VARCHAR(255) NOT NULL,
        Quantity VARCHAR(100),
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS RecipeSteps (
        RecipeStepID INT AUTO_INCREMENT PRIMARY KEY,
        RecipeID INT NOT NULL,
        StepNumber INT NOT NULL,
        Description TEXT NOT NULL,
        Tip TEXT,
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS KitchenEquipment (
        EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Status VARCHAR(50) DEFAULT 'working'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Inventory (
        InventoryID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Quantity VARCHAR(50),
        Status VARCHAR(50) DEFAULT 'normal'
      )
    `);

    const [equipRows] = await pool.query('SELECT COUNT(*) as cnt FROM KitchenEquipment');
    if (equipRows[0].cnt === 0) {
      await pool.query(`
        INSERT INTO KitchenEquipment (Name, Status) VALUES
        ('Плита №1', 'working'),
        ('Плита №2', 'working'),
        ('Гриль', 'warming'),
        ('Фритюрница', 'cleaning'),
        ('Духовка', 'working')
      `);
    }

    const [invRows] = await pool.query('SELECT COUNT(*) as cnt FROM Inventory');
    if (invRows[0].cnt === 0) {
      await pool.query(`
        INSERT INTO Inventory (Name, Quantity, Status) VALUES
        ('Помидоры', '5 кг', 'critical'),
        ('Лук репчатый', '8 кг', 'low'),
        ('Говядина', '15 кг', 'normal'),
        ('Сыр', '3 кг', 'low'),
        ('Масло растительное', '1 л', 'critical')
      `);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS CleaningTasks (
        TaskID INT AUTO_INCREMENT PRIMARY KEY,
        Title VARCHAR(255) NOT NULL,
        Description TEXT,
        Area VARCHAR(100),
        Priority ENUM('low','medium','high') DEFAULT 'medium',
        Status ENUM('pending','in-progress','completed') DEFAULT 'pending',
        EstimatedTime INT DEFAULT 15,
        AssignedTo INT,
        DueTime TIMESTAMP NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CompletedAt TIMESTAMP NULL,
        TableID INT,
        Checklist JSON,
        FOREIGN KEY (AssignedTo) REFERENCES Users(UserID) ON DELETE SET NULL,
        FOREIGN KEY (TableID) REFERENCES Tables(TableID) ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS CleaningZones (
        ZoneID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        Status ENUM('clean','needs-attention','dirty') DEFAULT 'clean',
        LastCleaned TIMESTAMP NULL,
        TasksCount INT DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS CleaningSchedule (
        ScheduleID INT AUTO_INCREMENT PRIMARY KEY,
        TaskName VARCHAR(255) NOT NULL,
        Description TEXT,
        Area VARCHAR(100),
        Priority ENUM('low','medium','high') DEFAULT 'medium',
        EstimatedTime INT DEFAULT 15,
        IntervalMinutes INT DEFAULT 30,
        LastRun TIMESTAMP NULL,
        IsActive TINYINT(1) DEFAULT 1
      )
    `);

    const [zoneRows] = await pool.query('SELECT COUNT(*) as cnt FROM CleaningZones');
    if (zoneRows[0].cnt === 0) {
      await pool.query(`
        INSERT INTO CleaningZones (Name, Status, LastCleaned, TasksCount) VALUES
        ('Обеденный зал', 'clean', NOW(), 0),
        ('Кухня', 'clean', NOW(), 0),
        ('Туалеты', 'clean', NOW(), 0),
        ('Вход/Ресепшен', 'clean', NOW(), 0),
        ('Кладовая', 'clean', NOW(), 0)
      `);
    }

    const [scheduleRows] = await pool.query('SELECT COUNT(*) as cnt FROM CleaningSchedule');
    if (scheduleRows[0].cnt === 0) {
      await pool.query(`
        INSERT INTO CleaningSchedule (TaskName, Description, Area, Priority, EstimatedTime, IntervalMinutes, IsActive) VALUES
        ('Проверка туалетов', 'Ежечасная проверка и уборка туалетов', 'Туалеты', 'high', 15, 30, 1),
        ('Уборка зала', 'Полная уборка обеденного зала', 'Обеденный зал', 'medium', 45, 60, 1),
        ('Дезинфекция столов', 'Обработка столов после посетителей', 'Обеденный зал', 'medium', 20, 30, 1),
        ('Проверка кухни', 'Уборка и проверка чистоты на кухне', 'Кухня', 'medium', 30, 60, 1)
      `);
    }

    // Add image column to Menu if not exists (safe migration)
    try {
      const [cols] = await pool.query(
        `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Menu' AND COLUMN_NAME = 'Image'`,
        [dbConfig.database]
      );
      if (cols[0].cnt === 0) {
        await pool.query(`ALTER TABLE Menu ADD COLUMN Image VARCHAR(500) NULL`);
        console.log('Menu.Image column added');
      }
    } catch (err) {
      console.log('Menu.Image migration error:', err.message);
    }

    // Reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Reviews (
        ReviewID INT AUTO_INCREMENT PRIMARY KEY,
        OrderID INT NOT NULL,
        Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
        Comment TEXT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Category VARCHAR(100),
        Rating DECIMAL(2,1) DEFAULT 5.0,
        Phone VARCHAR(50),
        ContactPerson VARCHAR(100),
        Status ENUM('active','inactive') DEFAULT 'active'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS SupplierOrders (
        OrderID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierID INT NOT NULL,
        Status ENUM('pending','confirmed','delivered','cancelled') DEFAULT 'pending',
        Total DECIMAL(10,2) DEFAULT 0,
        OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        DeliveryDate TIMESTAMP NULL,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS SupplierOrderItems (
        ItemID INT AUTO_INCREMENT PRIMARY KEY,
        OrderID INT NOT NULL,
        ProductName VARCHAR(255) NOT NULL,
        Quantity DECIMAL(10,2) NOT NULL,
        Unit VARCHAR(50),
        Price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (OrderID) REFERENCES SupplierOrders(OrderID) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS SupplierChatMessages (
        MessageID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierID INT NOT NULL,
        UserID INT,
        Role ENUM('user','assistant') DEFAULT 'user',
        Content TEXT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        IsRead TINYINT(1) DEFAULT 0
      )
    `);

    const [supplierRows] = await pool.query('SELECT COUNT(*) as cnt FROM Suppliers');
    if (supplierRows[0].cnt === 0) {
      await pool.query(`
        INSERT INTO Suppliers (Name, Category, Rating, Phone, ContactPerson) VALUES
        ('ОвощБаза', 'Овощи и фрукты', 4.8, '+7 (495) 123-45-67', 'Иван Петров'),
        ('МясКомбинат', 'Мясные продукты', 4.9, '+7 (495) 234-56-78', 'Сергей Иванов'),
        ('МолокоПром', 'Молочные продукты', 4.7, '+7 (495) 345-67-89', 'Анна Сидорова'),
        ('ПродМаркет', 'Бакалея', 4.6, '+7 (495) 456-78-90', 'Дмитрий Козлов')
      `);
    }

    console.log('Database initialized: Recipes, KitchenEquipment, Inventory, Cleaning, Suppliers tables ready');
  } catch (err) {
    console.error('Database init error:', err.message);
  }
};

initDatabase();

const authenticateToken = (req, res, next) => {
  console.log('=== AUTHENTICATE TOKEN ===');
  console.log('All headers:', req.headers);
  console.log('Authorization header:', req.headers['authorization']);
  console.log('Authorization (capital A):', req.headers['Authorization']);
  
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log(`Auth Header: ${authHeader}`);
  
  if (!authHeader) {
    console.log('No authorization header found');
    return res.sendStatus(401);
  }
  
  const token = authHeader.split(' ')[1];
  console.log(`Token: ${token}`);
  
  if (!token) {
    console.log('No token found in authorization header');
    return res.sendStatus(401);
  }

  jwt.verify(token, 'SECRET_KEY_2026', (err, user) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.sendStatus(403);
    }
    console.log('JWT verified successfully. User:', user);
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.redirect('https://timka20.ru/403');
});


app.get('/roles', async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM Role');
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, roleId } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!password || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const trimmedUsername = username.trim();

    const [existing] = await pool.query('SELECT UserID FROM Users WHERE Username = ?', [trimmedUsername]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO Users (Username, Password, CreatedDate, RoleId) VALUES (?, ?, NOW(), ?)',
      [trimmedUsername, hashedPassword, roleId || 1]
    );

    res.status(201).json({ userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM Users WHERE Username = ?', [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.UserID, roleId: user.RoleId },
      'SECRET_KEY_2026',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tables', async (req, res) => {
  try {
    const [tables] = await pool.query('SELECT * FROM Tables');
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tables', authenticateToken, async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Tables (TableNumber, Capacity) VALUES (?, ?)',
      [tableNumber, capacity]
    );
    res.status(201).json({ tableId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/reservations', authenticateToken, async (req, res) => {
  try {
    const { tableId, reservationDateTime, numberOfPeople } = req.body;
    const mysqlDateTime = new Date(reservationDateTime).toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await pool.query(
      'INSERT INTO Reservations (TableID, UserID, ReservationDateTime, NumberOfPeople) VALUES (?, ?, ?, ?)',
      [tableId, req.user.userId, mysqlDateTime, numberOfPeople]
    );
    res.status(201).json({ reservationId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { tableId, items } = req.body;

    const [orderResult] = await pool.query(
      'INSERT INTO Orders (UserID, TableID, OrderDateTime, Status) VALUES (?, ?, NOW(), ?)',
      [req.user.userId, tableId, 'new']
    );

    for (const item of items) {
      await pool.query(
        'INSERT INTO OrderItems (OrderID, MenuItemID, Quantity, IsExtra) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.menuItemId, item.quantity, 0]
      );
    }

    res.status(201).json({ orderId: orderResult.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const [menuItems] = await pool.query('SELECT * FROM Menu WHERE IsActive = TRUE');
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/transactions', authenticateToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Transactions (OrderID, Amount, TransactionDateTime) VALUES (?, ?, NOW())',
      [orderId, amount]
    );
    res.status(201).json({ transactionId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT UserID, Username, RoleId, CreatedDate FROM Users WHERE UserID = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [tables] = await pool.query('SELECT * FROM Tables WHERE TableID = ?', [id]);
    if (tables.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(tables[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/reservations', authenticateToken, async (req, res) => {
  try {
    const [reservations] = await pool.query(`
      SELECT r.ReservationID, r.TableID, r.UserID, r.ReservationDateTime, r.NumberOfPeople,
             u.Username AS UserUsername, t.TableNumber
      FROM Reservations r
      LEFT JOIN Users u ON r.UserID = u.UserID
      LEFT JOIN Tables t ON r.TableID = t.TableID
    `);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [reservations] = await pool.query(`
      SELECT r.ReservationID, r.TableID, r.UserID, r.ReservationDateTime, r.NumberOfPeople,
             u.Username AS UserUsername, t.TableNumber
      FROM Reservations r
      LEFT JOIN Users u ON r.UserID = u.UserID
      LEFT JOIN Tables t ON r.TableID = t.TableID
      WHERE r.ReservationID = ?
    `, [id]);
    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservations[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Reservations WHERE ReservationID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.OrderID, o.UserID, o.TableID, o.OrderDateTime, o.Status,
             u.Username AS UserUsername, t.TableNumber
      FROM Orders o
      LEFT JOIN Users u ON o.UserID = u.UserID
      LEFT JOIN Tables t ON o.TableID = t.TableID
      ORDER BY o.OrderDateTime DESC
    `);

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.OrderID);
      const [items] = await pool.query(`
        SELECT oi.OrderID, oi.MenuItemID, oi.Quantity, oi.IsExtra, m.Name AS MenuItemName, m.Price
        FROM OrderItems oi
        LEFT JOIN Menu m ON oi.MenuItemID = m.MenuItemID
        WHERE oi.OrderID IN (?)
      `, [orderIds]);

      const itemsByOrder = {};
      for (const item of items) {
        if (!itemsByOrder[item.OrderID]) itemsByOrder[item.OrderID] = [];
        itemsByOrder[item.OrderID].push(item);
      }

      for (const order of orders) {
        order.items = itemsByOrder[order.OrderID] || [];
      }
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await pool.query(`
      SELECT o.OrderID, o.UserID, o.TableID, o.OrderDateTime, o.Status,
             u.Username AS UserUsername, t.TableNumber
      FROM Orders o
      LEFT JOIN Users u ON o.UserID = u.UserID
      LEFT JOIN Tables t ON o.TableID = t.TableID
      WHERE o.OrderID = ?
    `, [id]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [items] = await pool.query(`
      SELECT oi.MenuItemID, oi.Quantity, oi.IsExtra, m.Name AS MenuItemName, m.Price
      FROM OrderItems oi
      LEFT JOIN Menu m ON oi.MenuItemID = m.MenuItemID
      WHERE oi.OrderID = ?
    `, [id]);

    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/orders/status/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const [result] = await pool.query(
      'UPDATE Orders SET Status = ? WHERE OrderID = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'completed') {
      const [orderRows] = await pool.query('SELECT TableID FROM Orders WHERE OrderID = ?', [id]);
      if (orderRows.length > 0 && orderRows[0].TableID) {
        const tableId = orderRows[0].TableID;
        const [tableRows] = await pool.query('SELECT TableNumber FROM Tables WHERE TableID = ?', [tableId]);
        const tableNumber = tableRows.length > 0 ? tableRows[0].TableNumber : tableId;
        await pool.query(
          'INSERT INTO CleaningTasks (Title, Description, Area, Priority, Status, EstimatedTime, TableID) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [`Уборка стола ${tableNumber}`, `Стол ${tableNumber} освободился после гостей. Необходимо убрать стол.`, 'Обеденный зал', 'high', 'pending', 15, tableId]
        );
        // Снимаем бронь со стола
        await pool.query('DELETE FROM Reservations WHERE TableID = ?', [tableId]);
        await pool.query('UPDATE Tables SET IsReserved = FALSE WHERE TableID = ?', [tableId]);
      }
    }

    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body; 

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    const [existing] = await pool.query('SELECT OrderID FROM Orders WHERE OrderID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await pool.query('DELETE FROM OrderItems WHERE OrderID = ?', [id]);

    for (const item of items) {
      await pool.query(
        'INSERT INTO OrderItems (OrderID, MenuItemID, Quantity) VALUES (?, ?, ?)',
        [id, item.menuItemId, item.quantity]
      );
    }

    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/orders/:id/items', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    const [existing] = await pool.query('SELECT OrderID FROM Orders WHERE OrderID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    for (const item of items) {
      await pool.query(
        'INSERT INTO OrderItems (OrderID, MenuItemID, Quantity, IsExtra) VALUES (?, ?, ?, ?)',
        [id, item.menuItemId, item.quantity, 1]
      );
    }

    res.json({ message: 'Extra items added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [items] = await pool.query('SELECT * FROM Menu WHERE MenuItemID = ?', [id]);
    if (items.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(items[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/menu', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, isActive = true, image } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Menu (Name, Description, Price, IsActive, Image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, isActive, image || null]
    );
    res.status(201).json({ menuItemId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/menu/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isActive, image } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('Name = ?'); values.push(name); }
    if (description !== undefined) { fields.push('Description = ?'); values.push(description); }
    if (price !== undefined) { fields.push('Price = ?'); values.push(price); }
    if (isActive !== undefined) { fields.push('IsActive = ?'); values.push(isActive); }
    if (image !== undefined) { fields.push('Image = ?'); values.push(image); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE Menu SET ${fields.join(', ')} WHERE MenuItemID = ?`;

    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/menu/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('UPDATE Menu SET IsActive = FALSE WHERE MenuItemID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT t.TransactionID, t.OrderID, t.Amount, t.TransactionDateTime,
             o.UserID, u.Username AS UserUsername
      FROM Transactions t
      LEFT JOIN Orders o ON t.OrderID = o.OrderID
      LEFT JOIN Users u ON o.UserID = u.UserID
    `);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [transactions] = await pool.query(`
      SELECT t.TransactionID, t.OrderID, t.Amount, t.TransactionDateTime,
             o.UserID, u.Username AS UserUsername
      FROM Transactions t
      LEFT JOIN Orders o ON t.OrderID = o.OrderID
      LEFT JOIN Users u ON o.UserID = u.UserID
      WHERE t.TransactionID = ?
    `, [id]);
    if (transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transactions[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const requireAdmin = (req, res, next) => {
  if (req.user.roleId !== 6) {
    return res.status(403).json({ error: 'Access denied: admin only' });
  }
  next();
};

app.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT UserID, Username, RoleId, CreatedDate FROM Users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    const [result] = await pool.query('DELETE FROM Users WHERE UserID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    if (typeof roleId !== 'number' || roleId < 1) {
      return res.status(400).json({ error: 'Invalid roleId' });
    }

    const [result] = await pool.query('UPDATE Users SET RoleId = ? WHERE UserID = ?', [roleId, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/tables', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [tables] = await pool.query('SELECT * FROM Tables');
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/admin/tables/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, capacity } = req.body;

    const fields = [];
    const values = [];

    if (tableNumber !== undefined) { fields.push('TableNumber = ?'); values.push(tableNumber); }
    if (capacity !== undefined) { fields.push('Capacity = ?'); values.push(capacity); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE Tables SET ${fields.join(', ')} WHERE TableID = ?`;
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json({ message: 'Table updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/admin/tables/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Tables WHERE TableID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/reservations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [reservations] = await pool.query(`
      SELECT r.ReservationID, r.TableID, r.UserID, r.ReservationDateTime, r.NumberOfPeople,
             u.Username AS UserUsername, t.TableNumber
      FROM Reservations r
      LEFT JOIN Users u ON r.UserID = u.UserID
      LEFT JOIN Tables t ON r.TableID = t.TableID
    `);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.OrderID, o.UserID, o.TableID, o.OrderDateTime, o.Status,
             u.Username AS UserUsername, t.TableNumber
      FROM Orders o
      LEFT JOIN Users u ON o.UserID = u.UserID
      LEFT JOIN Tables t ON o.TableID = t.TableID
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT t.TransactionID, t.OrderID, t.Amount, t.TransactionDateTime,
             o.UserID, u.Username AS UserUsername
      FROM Transactions t
      LEFT JOIN Orders o ON t.OrderID = o.OrderID
      LEFT JOIN Users u ON o.UserID = u.UserID
    `);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/admin/orders/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM OrderItems WHERE OrderID = ?', [id]);
    const [result] = await pool.query('DELETE FROM Orders WHERE OrderID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/admin/reservations/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Reservations WHERE ReservationID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/roles', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Role name is required' });
    }
    const [result] = await pool.query('INSERT INTO Role (Name) VALUES (?)', [name.trim()]);
    res.status(201).json({ roleId: result.insertId, name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/admin/roles/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const roleId = parseInt(id);
    if ([1, 2, 3, 4, 5, 6].includes(roleId)) {
      return res.status(403).json({ error: 'Cannot delete system roles' });
    }
    const [result] = await pool.query('DELETE FROM Role WHERE Id = ?', [roleId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/recipes', authenticateToken, async (req, res) => {
  try {
    const [recipes] = await pool.query('SELECT * FROM Recipes ORDER BY Name');
    if (recipes.length > 0) {
      const recipeIds = recipes.map(r => r.RecipeID);
      const [ingredients] = await pool.query(
        'SELECT * FROM RecipeIngredients WHERE RecipeID IN (?)',
        [recipeIds]
      );
      const ingredientsByRecipe = {};
      for (const ing of ingredients) {
        if (!ingredientsByRecipe[ing.RecipeID]) ingredientsByRecipe[ing.RecipeID] = [];
        ingredientsByRecipe[ing.RecipeID].push(ing);
      }
      for (const recipe of recipes) {
        recipe.ingredients = ingredientsByRecipe[recipe.RecipeID] || [];
      }
    }
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/recipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [recipes] = await pool.query('SELECT * FROM Recipes WHERE RecipeID = ?', [id]);
    if (recipes.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    const recipe = recipes[0];
    const [ingredients] = await pool.query(
      'SELECT * FROM RecipeIngredients WHERE RecipeID = ?',
      [id]
    );
    const [steps] = await pool.query(
      'SELECT * FROM RecipeSteps WHERE RecipeID = ? ORDER BY StepNumber',
      [id]
    );
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/recipes', authenticateToken, async (req, res) => {
  try {
    const { name, category, cookingTime, difficulty, rating, menuItemId, ingredients, steps } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Recipes (MenuItemID, Name, Category, CookingTime, Difficulty, Rating) VALUES (?, ?, ?, ?, ?, ?)',
      [menuItemId || null, name, category || 'Основное', cookingTime || 30, difficulty || 'medium', rating || 4.0]
    );
    const recipeId = result.insertId;

    if (Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        await pool.query(
          'INSERT INTO RecipeIngredients (RecipeID, Name, Quantity) VALUES (?, ?, ?)',
          [recipeId, ing.name, ing.quantity || '']
        );
      }
    }

    if (Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        await pool.query(
          'INSERT INTO RecipeSteps (RecipeID, StepNumber, Description, Tip) VALUES (?, ?, ?, ?)',
          [recipeId, i + 1, steps[i].description, steps[i].tip || null]
        );
      }
    }

    res.status(201).json({ recipeId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/recipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, cookingTime, difficulty, rating, menuItemId, ingredients, steps } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('Name = ?'); values.push(name); }
    if (category !== undefined) { fields.push('Category = ?'); values.push(category); }
    if (cookingTime !== undefined) { fields.push('CookingTime = ?'); values.push(cookingTime); }
    if (difficulty !== undefined) { fields.push('Difficulty = ?'); values.push(difficulty); }
    if (rating !== undefined) { fields.push('Rating = ?'); values.push(rating); }
    if (menuItemId !== undefined) { fields.push('MenuItemID = ?'); values.push(menuItemId); }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE Recipes SET ${fields.join(', ')} WHERE RecipeID = ?`, values);
    }

    if (Array.isArray(ingredients)) {
      await pool.query('DELETE FROM RecipeIngredients WHERE RecipeID = ?', [id]);
      for (const ing of ingredients) {
        await pool.query(
          'INSERT INTO RecipeIngredients (RecipeID, Name, Quantity) VALUES (?, ?, ?)',
          [id, ing.name, ing.quantity || '']
        );
      }
    }

    if (Array.isArray(steps)) {
      await pool.query('DELETE FROM RecipeSteps WHERE RecipeID = ?', [id]);
      for (let i = 0; i < steps.length; i++) {
        await pool.query(
          'INSERT INTO RecipeSteps (RecipeID, StepNumber, Description, Tip) VALUES (?, ?, ?, ?)',
          [id, i + 1, steps[i].description, steps[i].tip || null]
        );
      }
    }

    res.json({ message: 'Recipe updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/recipes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Recipes WHERE RecipeID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/kitchen/team', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT UserID, Username, RoleId, CreatedDate FROM Users WHERE RoleId = 3 ORDER BY Username'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/kitchen/equipment', authenticateToken, async (req, res) => {
  try {
    const [equipment] = await pool.query('SELECT * FROM KitchenEquipment ORDER BY EquipmentID');
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/kitchen/equipment/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [result] = await pool.query(
      'UPDATE KitchenEquipment SET Status = ? WHERE EquipmentID = ?',
      [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json({ message: 'Equipment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/kitchen/inventory', authenticateToken, async (req, res) => {
  try {
    const [inventory] = await pool.query('SELECT * FROM Inventory ORDER BY InventoryID');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/kitchen/inventory/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, status } = req.body;
    const fields = [];
    const values = [];
    if (quantity !== undefined) { fields.push('Quantity = ?'); values.push(quantity); }
    if (status !== undefined) { fields.push('Status = ?'); values.push(status); }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id);
    const [result] = await pool.query(
      `UPDATE Inventory SET ${fields.join(', ')} WHERE InventoryID = ?`,
      values
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cleaner/tasks', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM CleaningTasks ORDER BY CreatedAt DESC');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cleaner/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, area, priority, estimatedTime, assignedTo, dueTime, tableId, checklist } = req.body;
    const [result] = await pool.query(
      'INSERT INTO CleaningTasks (Title, Description, Area, Priority, EstimatedTime, AssignedTo, DueTime, TableID, Checklist) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, area, priority || 'medium', estimatedTime || 15, assignedTo || null, dueTime || null, tableId || null, checklist ? JSON.stringify(checklist) : null]
    );
    res.status(201).json({ taskId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/cleaner/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, checklist, completedAt } = req.body;
    const fields = [];
    const values = [];
    if (status !== undefined) { fields.push('Status = ?'); values.push(status); }
    if (assignedTo !== undefined) { fields.push('AssignedTo = ?'); values.push(assignedTo); }
    if (checklist !== undefined) { fields.push('Checklist = ?'); values.push(JSON.stringify(checklist)); }
    if (completedAt !== undefined) {
      const d = new Date(completedAt);
      const mysqlDate = d.toISOString().slice(0, 19).replace('T', ' ');
      fields.push('CompletedAt = ?'); values.push(mysqlDate);
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const [result] = await pool.query(`UPDATE CleaningTasks SET ${fields.join(', ')} WHERE TaskID = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cleaner/tasks/generate', authenticateToken, async (req, res) => {
  try {
    const poolTasks = [
      { title: 'Уборка пола', description: 'Помыть пол в зале', area: 'Обеденный зал', priority: 'medium', estimatedTime: 20, checklist: [{ text: 'Подмести', completed: false }, { text: 'Помыть', completed: false }] },
      { title: 'Вынос мусора', description: 'Вынести мусор из кухни', area: 'Кухня', priority: 'high', estimatedTime: 10, checklist: [{ text: 'Собрать мешки', completed: false }, { text: 'Вынести на улицу', completed: false }] },
      { title: 'Проверка расходников', description: 'Проверить мыло и бумагу в туалетах', area: 'Туалеты', priority: 'low', estimatedTime: 5, checklist: [{ text: 'Проверить мыло', completed: false }, { text: 'Проверить бумагу', completed: false }] },
      { title: 'Протереть столы', description: 'Протереть все столы в зале', area: 'Обеденный зал', priority: 'medium', estimatedTime: 15, checklist: [{ text: 'Столы 1-5', completed: false }, { text: 'Столы 6-10', completed: false }] },
      { title: 'Уборка входа', description: 'Убрать входную зону', area: 'Вход/Ресепшен', priority: 'medium', estimatedTime: 10, checklist: [{ text: 'Протереть двери', completed: false }, { text: 'Убрать коврик', completed: false }] },
      { title: 'Уборка кладовой', description: 'Привести в порядок кладовую', area: 'Кладовая', priority: 'low', estimatedTime: 25, checklist: [{ text: 'Разложить по полкам', completed: false }, { text: 'Протереть пыль', completed: false }] },
      { title: 'Дезинфекция дверных ручек', description: 'Обработать ручки во всех зонах', area: 'Обеденный зал', priority: 'high', estimatedTime: 10, checklist: [{ text: 'Зал', completed: false }, { text: 'Туалеты', completed: false }] },
      { title: 'Замена пакетов в мусорках', description: 'Поменять пакеты во всех мусорных ведрах', area: 'Кухня', priority: 'medium', estimatedTime: 15, checklist: [{ text: 'Кухня', completed: false }, { text: 'Зал', completed: false }] },
    ];
    const shuffled = poolTasks.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    const createdIds = [];
    for (const t of selected) {
      const [result] = await pool.query(
        'INSERT INTO CleaningTasks (Title, Description, Area, Priority, Status, EstimatedTime, Checklist) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [t.title, t.description, t.area, t.priority, 'pending', t.estimatedTime, JSON.stringify(t.checklist)]
      );
      createdIds.push(result.insertId);
    }
    res.status(201).json({ taskIds: createdIds, message: 'Tasks generated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cleaner/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM CleaningTasks WHERE TaskID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cleaner/zones', authenticateToken, async (req, res) => {
  try {
    const [zones] = await pool.query('SELECT * FROM CleaningZones ORDER BY ZoneID');
    res.json(zones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/cleaner/zones/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, lastCleaned, tasksCount } = req.body;
    const fields = [];
    const values = [];
    if (status !== undefined) { fields.push('Status = ?'); values.push(status); }
    if (lastCleaned !== undefined) { fields.push('LastCleaned = ?'); values.push(lastCleaned); }
    if (tasksCount !== undefined) { fields.push('TasksCount = ?'); values.push(tasksCount); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const [result] = await pool.query(`UPDATE CleaningZones SET ${fields.join(', ')} WHERE ZoneID = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Zone not found' });
    res.json({ message: 'Zone updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cleaner/schedule', authenticateToken, async (req, res) => {
  try {
    const [schedule] = await pool.query('SELECT * FROM CleaningSchedule ORDER BY ScheduleID');
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cleaner/schedule', authenticateToken, async (req, res) => {
  try {
    const { taskName, description, area, priority, estimatedTime, intervalMinutes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO CleaningSchedule (TaskName, Description, Area, Priority, EstimatedTime, IntervalMinutes) VALUES (?, ?, ?, ?, ?, ?)',
      [taskName, description, area, priority || 'medium', estimatedTime || 15, intervalMinutes || 30]
    );
    res.status(201).json({ scheduleId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/cleaner/schedule/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, description, area, priority, estimatedTime, intervalMinutes, isActive, lastRun } = req.body;
    const fields = [];
    const values = [];
    if (taskName !== undefined) { fields.push('TaskName = ?'); values.push(taskName); }
    if (description !== undefined) { fields.push('Description = ?'); values.push(description); }
    if (area !== undefined) { fields.push('Area = ?'); values.push(area); }
    if (priority !== undefined) { fields.push('Priority = ?'); values.push(priority); }
    if (estimatedTime !== undefined) { fields.push('EstimatedTime = ?'); values.push(estimatedTime); }
    if (intervalMinutes !== undefined) { fields.push('IntervalMinutes = ?'); values.push(intervalMinutes); }
    if (isActive !== undefined) { fields.push('IsActive = ?'); values.push(isActive); }
    if (lastRun !== undefined) { fields.push('LastRun = ?'); values.push(lastRun); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const [result] = await pool.query(`UPDATE CleaningSchedule SET ${fields.join(', ')} WHERE ScheduleID = ?`, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ message: 'Schedule updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/cleaner/schedule/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM CleaningSchedule WHERE ScheduleID = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Schedule not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const runCleaningSchedule = async () => {
  try {
    const [schedules] = await pool.query('SELECT * FROM CleaningSchedule WHERE IsActive = 1');
    for (const schedule of schedules) {
      const shouldRun = !schedule.LastRun || (new Date() - new Date(schedule.LastRun)) >= (schedule.IntervalMinutes * 60 * 1000);
      if (shouldRun) {
        await pool.query(
          'INSERT INTO CleaningTasks (Title, Description, Area, Priority, Status, EstimatedTime) VALUES (?, ?, ?, ?, ?, ?)',
          [schedule.TaskName, schedule.Description, schedule.Area, schedule.Priority, 'pending', schedule.EstimatedTime]
        );
        await pool.query('UPDATE CleaningSchedule SET LastRun = NOW() WHERE ScheduleID = ?', [schedule.ScheduleID]);
      }
    }
  } catch (err) {
    console.error('Cleaning schedule error:', err.message);
  }
};

runCleaningSchedule();
setInterval(runCleaningSchedule, 30 * 60 * 1000);

app.get('/suppliers', authenticateToken, async (req, res) => {
  try {
    const [suppliers] = await pool.query('SELECT * FROM Suppliers ORDER BY SupplierID');
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/suppliers/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM SupplierOrders ORDER BY OrderDate DESC');
    const [items] = await pool.query('SELECT * FROM SupplierOrderItems');
    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.OrderID]) itemsByOrder[item.OrderID] = [];
      itemsByOrder[item.OrderID].push(item);
    }
    for (const order of orders) {
      order.items = itemsByOrder[order.OrderID] || [];
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/suppliers/orders', authenticateToken, async (req, res) => {
  try {
    const { supplierId, items, deliveryDate } = req.body;
    let total = 0;
    for (const item of items) {
      total += (item.quantity || 0) * (item.price || 0);
    }
    const [result] = await pool.query(
      'INSERT INTO SupplierOrders (SupplierID, Status, Total, DeliveryDate) VALUES (?, ?, ?, ?)',
      [supplierId, 'pending', total, deliveryDate || null]
    );
    const orderId = result.insertId;
    for (const item of items) {
      await pool.query(
        'INSERT INTO SupplierOrderItems (OrderID, ProductName, Quantity, Unit, Price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.productName, item.quantity, item.unit || 'шт', item.price]
      );
    }
    res.status(201).json({ orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/suppliers/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [result] = await pool.query(
      'UPDATE SupplierOrders SET Status = ? WHERE OrderID = ?',
      [status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/suppliers/chat/:supplierId', authenticateToken, async (req, res) => {
  try {
    const { supplierId } = req.params;
    const [messages] = await pool.query(
      'SELECT * FROM SupplierChatMessages WHERE SupplierID = ? ORDER BY CreatedAt ASC',
      [supplierId]
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/suppliers/chat', authenticateToken, async (req, res) => {
  try {
    const { supplierId, message, supplierName } = req.body;
    const userId = req.user.userId;

    await pool.query(
      'INSERT INTO SupplierChatMessages (SupplierID, UserID, Role, Content, IsRead) VALUES (?, ?, ?, ?, 1)',
      [supplierId, userId, 'user', message]
    );

    const aiPrompt = `Обращаюсь к компании ${supplierName || 'поставщик'}, мое сообщение: ${message}`;
    let aiResponse = 'Свободных сотрудников нет, свяжитесь с нами позже.';
    let aiMessageId = null;

    try {
      const aiRes = await fetch('https://api.rentikai.ru/api/personas/chat', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 3c76d679e6944a809f32dd0d9b3f818cc63138d285f577f3e1ae25724e0308cd',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: aiPrompt })
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        aiResponse = aiData.message?.content || aiData.content || aiResponse;
        aiMessageId = aiData.message?.id || aiData.id || null;
      } else {
        console.error('RentikAI HTTP error:', aiRes.status, await aiRes.text());
      }
    } catch (aiErr) {
      console.error('RentikAI error:', aiErr.message);
    }

    const [result] = await pool.query(
      'INSERT INTO SupplierChatMessages (SupplierID, UserID, Role, Content, IsRead) VALUES (?, ?, ?, ?, 0)',
      [supplierId, userId, 'assistant', aiResponse]
    );

    res.json({ messageId: result.insertId, aiMessageId, content: aiResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/suppliers/chat/read/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    await pool.query('UPDATE SupplierChatMessages SET IsRead = 1 WHERE MessageID = ?', [messageId]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reviews endpoints
app.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    if (!orderId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'orderId and rating (1-5) are required' });
    }
    const [orderCheck] = await pool.query('SELECT OrderID FROM Orders WHERE OrderID = ?', [orderId]);
    if (orderCheck.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const [existing] = await pool.query('SELECT ReviewID FROM Reviews WHERE OrderID = ?', [orderId]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Review for this order already exists' });
    }
    const [result] = await pool.query(
      'INSERT INTO Reviews (OrderID, Rating, Comment) VALUES (?, ?, ?)',
      [orderId, rating, comment || null]
    );
    res.status(201).json({ reviewId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.ReviewID, r.OrderID, r.Rating, r.Comment, r.CreatedAt,
             o.UserID, u.Username AS UserUsername
      FROM Reviews r
      LEFT JOIN Orders o ON r.OrderID = o.OrderID
      LEFT JOIN Users u ON o.UserID = u.UserID
      ORDER BY r.CreatedAt DESC
    `);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/reviews/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const [reviews] = await pool.query(`
      SELECT r.ReviewID, r.OrderID, r.Rating, r.Comment, r.CreatedAt,
             o.UserID, u.Username AS UserUsername
      FROM Reviews r
      LEFT JOIN Orders o ON r.OrderID = o.OrderID
      LEFT JOIN Users u ON o.UserID = u.UserID
      WHERE r.OrderID = ?
    `, [orderId]);
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'Review not found for this order' });
    }
    res.json(reviews[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin reviews endpoints
app.get('/admin/reviews', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.ReviewID, r.OrderID, r.Rating, r.Comment, r.CreatedAt,
             o.UserID, u.Username AS UserUsername
      FROM Reviews r
      LEFT JOIN Orders o ON r.OrderID = o.OrderID
      LEFT JOIN Users u ON o.UserID = u.UserID
      ORDER BY r.CreatedAt DESC
    `);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/admin/reviews/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const fields = [];
    const values = [];
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      fields.push('Rating = ?');
      values.push(rating);
    }
    if (comment !== undefined) { fields.push('Comment = ?'); values.push(comment); }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    values.push(id);
    const [result] = await pool.query(`UPDATE Reviews SET ${fields.join(', ')} WHERE ReviewID = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/admin/reviews/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM Reviews WHERE ReviewID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 2379;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});