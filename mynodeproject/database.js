const express = require('express');
const bodyParser = require('body-parser');
const { createPool } = require('mysql');

const app = express();
const port = 8000;

app.use(bodyParser.json());

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
  connectionLimit: 10
});

// Create tables if not exists
const createTableQueries = [
  `
    CREATE TABLE IF NOT EXISTS environmental_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      source VARCHAR(255) NOT NULL,
      data JSON NOT NULL,
      timestamp DATETIME NOT NULL
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      fcmToken VARCHAR(255) NOT NULL
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS user_alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      temperatureThreshold INT,
      humidityThreshold INT
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS environmental_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(255)
    )
  `,
];

// Execute create table queries
createTableQueries.forEach(query => {
  pool.query(query, (err, results) => {
    if (err) {
      console.error(`Error executing query: ${query}`, err);
    } else {
      console.log(`Table created successfully: ${query}`);
    }
  });
});

// Endpoint for users to submit environmental data
app.post('/submit-data', (req, res) => {
  const submittedData = req.body;

  if (isValidData(submittedData)) {
    saveDataToDatabase(submittedData, res);
    checkAlerts(submittedData);
  } else {
    res.status(400).json({ error: 'Invalid data format or content' });
  }
});

// Endpoint for creating user profiles
app.post('/create-user', (req, res) => {
  const userData = req.body;

  if (isValidUser(userData)) {
    saveUserToDatabase(userData, res);
  } else {
    res.status(400).json({ error: 'Invalid user data format or content' });
  }
});

// Endpoint for users to report environmental issues
app.post('/report-environment-issue', (req, res) => {
  const { type, description, image } = req.body;

  if (type && description) {
    saveEnvironmentalReport(type, description, image, res);
  } else {
    res.status(400).json({ error: 'Invalid input data' });
  }
});

// Endpoint to retrieve educational resources
app.get('/educational-resources', (req, res) => {
  // Sample educational content, you can fetch this from a database or external source
  const educationalContent = [
    {
      title: "Introduction to Environmental Science",
      content: "This article provides an overview of key concepts in environmental science."
    },
    {
      title: "Sustainable Practices Guide",
      content: "Learn about sustainable practices and how to incorporate them into your daily life."
    },
    // Add more educational content
  ];

  res.json(educationalContent);
});

// Validate functions
function isValidData(data) {
  return (
    data &&
    data.userId &&
    data.source &&
    data.data !== undefined &&
    data.timestamp
  );
}

function isValidUser(user) {
  return (
    user &&
    user.username &&
    user.email &&
    user.fcmToken
  );
}

// Save functions
function saveDataToDatabase(data, res) {
  const insertDataQuery = `
    INSERT INTO environmental_data (userId, source, data, timestamp)
    VALUES (?, ?, ?, ?)
  `;

  const { userId, source, timestamp } = data;
  const environmentalData = JSON.stringify(data.data);

  pool.query(insertDataQuery, [userId, source, environmentalData, timestamp], (err, results) => {
    if (err) {
      console.error('Error saving data to the environmental_data table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data saved to the environmental_data table:', data);
      res.status(200).json({ message: 'Data submitted and saved successfully' });
    }
  });
}

function saveUserToDatabase(user, res) {
  const insertUserQuery = `
    INSERT INTO user_profiles (username, email, fcmToken)
    VALUES (?, ?, ?)
  `;

  const { username, email, fcmToken } = user;

  pool.query(insertUserQuery, [username, email, fcmToken], (err, results) => {
    if (err) {
      console.error('Error saving user to the user_profiles table:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('User saved to the user_profiles table:', user);
      res.status(200).json({ message: 'User created successfully' });
    }
  });
}

function saveEnvironmentalReport(type, description, image, res) {
  const insertReportQuery = `
    INSERT INTO environmental_reports (type, description, image)
    VALUES (?, ?, ?)
  `;

  pool.query(insertReportQuery, [type, description, image], (err, results) => {
    if (err) {
      console.error('Error saving environmental report:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Environmental report saved successfully');
      res.status(200).json({ message: 'Report submitted successfully' });
    }
  });
}

// Other functions (checkAlerts, sendPushNotification, etc.) go here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
