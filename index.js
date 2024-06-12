const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const axios = require('axios');
const querystring = require('querystring');
 
const app = express();
const port = process.env.PORT || 8080;



var adminb = require("firebase-admin"); // Use const for constant value

var serviceAccount = require("./calorie-calc-92ec4-firebase-adminsdk-gj2b1-e5b395db87.json");


adminb.initializeApp({
  credential: adminb.credential.cert(serviceAccount)
});


console.log('done');


// Route for handling the OAuth callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Authorization code is missing.');
    
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


// Example items for the API
const itemsCollection = adminb.firestore().collection('items');

// API endpoints for items
app.get('/items', async (req, res) => {
  try {
    const snapshot = await itemsCollection.get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).send('Error getting items');
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = req.body;
    const docRef = await itemsCollection.add(newItem);
    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Error adding item');
  }
});

app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const item = req.body;
    await itemsCollection.doc(id).set(item, { merge: true });
    res.json({ id, ...item });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Error updating item');
  }
});

app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await itemsCollection.doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
});
