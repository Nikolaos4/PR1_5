const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // разрешаем запросы с фронтенда
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Начальные данные 
let products = [
  { id: nanoid(6), name: 'Ноутбук Lenovo', category: 'Электроника', description: '15.6", Intel Core i5, 8GB RAM', price: 55000, stock: 12 },
  { id: nanoid(6), name: 'Мышь Logitech', category: 'Электроника', description: 'Беспроводная, оптическая', price: 1500, stock: 35 },
  { id: nanoid(6), name: 'Книга "JavaScript для детей"', category: 'Книги', description: 'Понятное введение в программирование', price: 800, stock: 7 },
  { id: nanoid(6), name: 'Футболка мужская', category: 'Одежда', description: 'Хлопок 100%, размер M', price: 1200, stock: 20 },
  { id: nanoid(6), name: 'Наушники Sony', category: 'Электроника', description: 'Bluetooth, шумоподавление', price: 8900, stock: 5 },
  { id: nanoid(6), name: 'Кружка керамическая', category: 'Посуда', description: 'Объем 300 мл, рисунок', price: 350, stock: 50 },
  { id: nanoid(6), name: 'Рюкзак городской', category: 'Аксессуары', description: '20 л, водонепроницаемый', price: 2700, stock: 8 },
  { id: nanoid(6), name: 'Смартфон Xiaomi', category: 'Электроника', description: '6.5", 128GB, 4GB RAM', price: 21000, stock: 3 },
  { id: nanoid(6), name: 'Кроссовки Nike', category: 'Обувь', description: 'Размер 42, белые', price: 4500, stock: 10 },
  { id: nanoid(6), name: 'Чайник электрический', category: 'Бытовая техника', description: '1.5 л, нержавейка', price: 1800, stock: 6 },
];

// CRUD операции

// Получить все товары
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Получить товар по id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Создать новый товар
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;
  // Простейшая валидация
  if (!name || !category || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Обновить товар
app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const { name, category, description, price, stock } = req.body;
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  res.json(product);
});

// Удалить товар
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(index, 1);
  res.status(204).send(); // No content
});

// Обработка 404 для несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});