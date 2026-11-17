const http = require('http');
const fs = require('fs');
const path = require('path');

let foods = [
  { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
  { id: 2, foodName: "Burger", category: "Fast Food", price: 150, availability: true },
  { id: 3, foodName: "Pasta", category: "Italian", price: 200, availability: false }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Route 1: GET /
  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the Online Food Ordering Restaurant!</h1>');
  }
  // Route 2: GET /about
  else if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About Us: We serve fresh, delicious meals delivered hot to your door.');
  }
  // Route 3: GET /foods (Only availability === true)
  else if (method === 'GET' && url === '/foods') {
    const availableFoods = foods.filter(item => item.availability === true);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(availableFoods));
  }
  // Route 4: GET /menu (Serve static file via fs)
  else if (method === 'GET' && url === '/menu') {
    const filePath = path.join(__dirname, 'public', 'menu.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: Unable to load menu.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
  // Route 5: POST /add-food
  else if (method === 'POST' && url === '/add-food') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const newFood = JSON.parse(body);
        const { id, foodName, category, price, availability } = newFood;

        // Validate required fields
        if (
          id === undefined ||
          !foodName ||
          !category ||
          typeof price !== 'number' ||
          typeof availability !== 'boolean'
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing or invalid required fields (id, foodName, category, price, availability)' }));
          return;
        }

        foods.push({ id, foodName, category, price, availability });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Food item added successfully', food: newFood }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  }
  // Invalid Routes: 404
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});