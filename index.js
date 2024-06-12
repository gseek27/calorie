const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3004;

var admin = require("firebase-admin");

var serviceAccount = require("calorie-calc-92ec4-firebase-adminsdk-gj2b1-30a696cb36.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Initialize Firebase Admin SDK
const serviceAccount = require('./calorie-calc-92ec4-firebase-adminsdk-gj2b1-30a696cb36.json'); // Update this path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Route for handling the OAuth callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Authorization code is missing.');
  }

  try {
    // Make a POST request to exchange the authorization code for tokens
    const response = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
      code: code,
      client_id: '801152741544-nsi2u5tjr6a2p9um7n33us6h0nrqbm67.apps.googleusercontent.com', // Replace with your client ID
      client_secret: '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', // Replace with your client secret
      redirect_uri: 'https://66782de5-a54f-4ff7-a76a-ac8fbd137b4c-00-31mknz5piyqw0.picard.replit.dev/auth/callback',
      grant_type: 'authorization_code'
    }));

    // Extract access token and ID token from response
    const { access_token, id_token } = response.data;

    // Now you can use the tokens to authenticate the user or fetch user information
    // For demonstration purposes, let's just send the tokens in the response
    //res.send(`Access Token: ${access_token}<br>ID Token: ${id_token}`);

    // Verify ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: id_token,
      audience: '801152741544-nsi2u5tjr6a2p9um7n33us6h0nrqbm67.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();

    // User information
    const userId = payload.sub;
    const userEmail = payload.email;

    // For demonstration, log the tokens (in production, handle securely)
    console.log(`Access Token: ${access_token}`);
    console.log(`ID Token: ${id_token}`);
    console.log(`User ID: ${userId}`);
    console.log(`User Email: ${userEmail}`);

    
    res.redirect('/');
  } catch (error) {
    console.error('Failed to exchange authorization code for tokens:', error.response.data);
    res.status(500).send('Failed to exchange authorization code for tokens.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Example items for the API
let items = [
  { id: 1, name: 'brazil nuts', value: 33 },
  { id: 2, name: 'pumpkin seeds', value: 126 },
  // ... other items
];


// API endpoints for items
app.get('/items', async (req, res) => {
  try {
    const snapshot = await db.collection('items').get();
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
    const docRef = await db.collection('items').add(newItem);
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
    await db.collection('items').doc(id).set(item, { merge: true });
    res.json({ id, ...item });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Error updating item');
  }
});

app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection('items').doc(id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
});
