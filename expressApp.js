const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Initial sample food records (at least 3)
let foods = [
  { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
  { id: 2, foodName: "Burger", category: "Fast Food", price: 150, availability: true },
  { id: 3, foodName: "Pasta", category: "Italian", price: 200, availability: false }
];

// 1. GET /foods - Retrieve all food items
app.get('/foods', (req, res) => {
  res.status(200).json(foods);
});

// 2. GET /foods/:id - Retrieve food by ID
app.get('/foods/:id', (req, res) => {
  const foodId = parseInt(req.params.id);
  const food = foods.find(f => f.id === foodId);

  if (!food) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  res.status(200).json(food);
});

// 3. POST /foods - Add a new food item
app.post('/foods', (req, res) => {
  const { id, foodName, category, price, availability } = req.body;

  // Validation: required fields + positive price
  if (
    id === undefined ||
    !foodName ||
    !category ||
    typeof price !== 'number' ||
    price <= 0 ||
    typeof availability !== 'boolean'
  ) {
    return res.status(400).json({
      error: 'Invalid input: All fields (id, foodName, category, price, availability) are required and price must be a positive number.'
    });
  }

  const newFood = { id, foodName, category, price, availability };
  foods.push(newFood);

  res.status(201).json({
    message: 'Food item added successfully',
    food: newFood
  });
});

// 4. PUT /foods/:id - Update food details
app.put('/foods/:id', (req, res) => {
  const foodId = parseInt(req.params.id);
  const foodIndex = foods.findIndex(f => f.id === foodId);

  if (foodIndex === -1) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  const { foodName, category, price, availability } = req.body;

  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  // Update existing fields
  foods[foodIndex] = {
    ...foods[foodIndex],
    foodName: foodName !== undefined ? foodName : foods[foodIndex].foodName,
    category: category !== undefined ? category : foods[foodIndex].category,
    price: price !== undefined ? price : foods[foodIndex].price,
    availability: availability !== undefined ? availability : foods[foodIndex].availability
  };

  res.status(200).json({
    message: 'Food item updated successfully',
    food: foods[foodIndex]
  });
});

// 5. DELETE /foods/:id - Delete a food item
app.delete('/foods/:id', (req, res) => {
  const foodId = parseInt(req.params.id);
  const foodIndex = foods.findIndex(f => f.id === foodId);

  if (foodIndex === -1) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  const deletedFood = foods.splice(foodIndex, 1)[0];
  res.status(200).json({
    message: 'Food item deleted successfully',
    food: deletedFood
  });
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});