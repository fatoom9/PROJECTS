const express = require('express');
const mysql = require('mysql');
const mysql2 = require('mysql2');
const MySQLEvents = require('@rodrigogs/mysql-events');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // You may need to install 'jsonwebtoken'
const app = express();
const axios = require('axios');
const port = 3000;
const multer = require('multer');
const path = require('path'); // Make sure to also import the 'path' module for working with file paths

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
app.use(cors());
const winston = require('winston');
const expressWinston = require('express-winston');

// Middleware to parse JSON
app.use(express.json());
/////////////////////////////////////////////////////////////////////////////////////
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  )
});

// تكامل express-winston
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true, // يضيف المعلومات التي تحدد الطلب (المسار والطريقة والرمز الزمني وما إلى ذلك)
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true, // يحسن التنسيق لتطابق نظام السجل التقليدي
  colorize: false, // تعيينها إلى true لتلوين مخرجات السجل
  ignoreRoute: function (req, res) { return false; } // اختياري: تجاهل بعض الطرق إذا لزم الأمر
}));
///////////////////////////////////////////////////////////////////////////////////////////////////
// باقي الشيفرة كما هي
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodee',
};

const connection = mysql.createConnection(dbConfig);

// Create a MySQL events instance
const mysqlEvents = new MySQLEvents(connection, {
  startAtEnd: true,
  excludedSchemas: {
    mysql: true,
  },
});
///////////////////////////////////////////////////////////////////////////////////////////////////////1
app.post('/api/environmental-data', (req, res) => {
    const { airQuality, temperature, humidity, waterQuality, biodiversityMetrics, timestamp, source } = req.body;

    // Create a connection to the database
    const connection = mysql.createConnection(dbConfig);

    // Insert data into the database
    connection.query(
        'INSERT INTO environmental_data (timestamp, source, air_quality, temperature, humidity, water_quality, biodiversity_metrics) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [timestamp, source, airQuality, temperature, humidity, waterQuality, biodiversityMetrics],
        (error, results, fields) => {
            // Close the database connection
            connection.end();

            if (error) {
                console.error('Error inserting data into the database:', error);
                res.status(500).send('Internal Server Error: ' + error.message);
            } else {
                console.log(`Inserted ${results.affectedRows} row(s)`);
                res.send('Data submitted successfully!');
                checkAlerts();
            }
        }
    );
    
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////2

// Endpoint to create a new user profile
app.post('/api/users', (req, res) => {
    const { username, email, password, bio, location, environmental_interests } = req.body;

    // Create a connection to the database
    const connection = mysql.createConnection(dbConfig);

    // Insert data into the users table
    
    
        
          // Check c
          connection.query(  'INSERT INTO users (username, email, password, bio, location, environmental_interests) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, password, bio, location, environmental_interests],
        (error, results, fields) => {
            // Close the database connection
            connection.end();

            if (error) {
                console.error('Error creating user profile:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(`Inserted ${results.affectedRows} row(s)`);
                res.status(201).json({ message: 'User profile created successfully' });
            }
        }
    );
  });
///////////////////////////////////////////////////////////////////////////////////////////////////////3
  
  

  
// Endpoint to get user profile by ID
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    // Create a connection to the database
    const connection = mysql.createConnection(dbConfig);

    // Retrieve data from the users table
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results, fields) => {
        // Close the database connection
        connection.end();

        if (error) {
            console.error('Error getting user profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4
// Endpoint to update user profile
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { bio, location, environmental_interests } = req.body;

    // Create a connection to the database
    const connection = mysql.createConnection(dbConfig);

    // Update data in the users table
    connection.query(
        'UPDATE users SET bio = ?, location = ?, environmental_interests = ? WHERE id = ?',
        [bio, location, environmental_interests, userId],
        (error, results, fields) => {
            // Close the database connection
            connection.end();

            if (error) {
                console.error('Error updating user profile:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(`Updated ${results.affectedRows} row(s)`);
                res.status(200).json({ message: 'User profile updated successfully' });
            }
        }
    );
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////6
// Endpoint to get user connections
app.get('/api/users/:id/connections', (req, res) => {
    const userId = req.params.id;

    // Create a connection to the database
    const connection = mysql.createConnection(dbConfig);

    // Retrieve user connections from the connections table
    connection.query(
        'SELECT u.id, u.username, u.email, u.bio, u.location FROM connections c JOIN users u ON (c.user_id1 = u.id OR c.user_id2 = u.id) WHERE (c.user_id1 = ? OR c.user_id2 = ?) AND u.id != ?',
        [userId, userId, userId],
        (error, results, fields) => {
            // Close the database connection
            connection.end();

            if (error) {
                console.error('Error getting user connections:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(results);
            }
        }
    );
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////5
// Endpoint to create a connection between users
// Endpoint to create a connection between users
// Endpoint to create a connection between users
app.post('/api/users/:userid1/connections', (req, res) => {
    const userid1 = req.params.userid1;
    const { userid2 } = req.body;

    // Validate input (Check if userid2 exists, etc.)

    // Create a connection to the database
    const connection = mysql.createConnection(dbConfig);

    // Insert data into the connections table
    connection.query(
        'INSERT INTO connections (user_id1, user_id2) VALUES (?, ?)',
        [userid1, userid2],
        (error, results, fields) => {
            // Close the database connection
            connection.end();

            if (error) {
                console.error('Error creating user connection:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log(`Inserted ${results.affectedRows} row(s)`);
                res.status(201).json({ message: 'Connection created successfully' });
            }
        }
    );
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////for alartss 7
const getLatestEnvironmentalData = async () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbConfig);
    
      const query = 'SELECT * FROM environmental_data ORDER BY timestamp DESC LIMIT 1';
      connection.query(query, (error, results) => {
        if (error) {
          console.error('Error fetching environmental data:', error);
          reject(error);
        } else {
          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            reject(new Error('No environmental data found.'));
          }
        }
      });
    });
  };
  

  // Example endpoint for setting user alerts
  app.post('/api/users/:userId/alerts', async (req, res) => {
    const userId = req.params.userId;
    const alertConfig = req.body;
    const connection = mysql.createConnection(dbConfig);
    const query =
      'INSERT INTO user_alerts (user_id, alert_name, threshold_airQuality, threshold_temperature, threshold_humidity, threshold_waterQuality, threshold_biodiversityMetrics) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
      userId,
      alertConfig.alert_name,
      alertConfig.threshold_airQuality,
      alertConfig.threshold_temperature,
      alertConfig.threshold_humidity,
      alertConfig.threshold_waterQuality,
      alertConfig.threshold_biodiversityMetrics,
    ];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error saving user alert configuration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(`Inserted ${results.affectedRows} row(s)`);
        res.status(201).json({ message: 'Alert configuration saved successfully' });
      }
    });
  });
  const checkAlerts = async () => {
    try {
      const environmentalData = await getLatestEnvironmentalData();
      const userAlerts = await getUserAlerts();
      const connection = mysql.createConnection(dbConfig);
      
      userAlerts.forEach((alert) => {
        // Check conditions and set alert name accordingly
        
        let alertName = '';
        

       
        if (environmentalData.airQuality > alert.threshold_airQuality) {
          alertName += '  Air Quality';
        } if (environmentalData.temperature > alert.threshold_temperature) {
          alertName+= '   Temperature';
        }  if (environmentalData.humidity > alert.threshold_humidity) {
          alertName += '  Humidity';
        } //if (environmentalData.waterQuality !== alert.threshold_waterQuality) {
          //alertName += '   Water Quality';
       // }  //if (environmentalData.biodiversityMetrics !== alert.threshold_biodiversityMetrics) {
          //alertName += '   Biodiversity Metrics';
       // }
  // Trim the trailing comma and space
  alertName = alertName.replace(/,\s*$/, '');

        // If alertName is not empty, send the alert
        if (alertName !== '') {
          sendAlertToUser(alert.user_id, alertName);
        }
      });
    
  

      console.log('Alert check completed successfully');
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  };
  
    
const sendAlertToUser = (userId, alertName) => {
  // Connect to the database
  const connection = mysql.createConnection(dbConfig);

  // Query to retrieve the email of the user with the given userId
  const getUserEmailQuery = 'SELECT email FROM users WHERE id = ?';

  // Execute the query with the userId
  connection.query(getUserEmailQuery, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user email:', error);
      // Handle the error appropriately, e.g., by returning an error response
    } else {
      // Check if a user with the given userId exists
      if (results.length > 0) {
        const userEmail = results[0].email;

        // Log the alert information and user email
        console.log(`Alert sent to user ${userId} (${userEmail}): ${alertName}`);

        // Define the email options
        const mailOptions = {
          from: 's11924712@stu.najah.edu',
          to: userEmail, // Use the retrieved email address
          subject: 'Environmental Alert',
          text: `Alert for user ${userId}: ${alertName}`,
        };

        // Create a Nodemailer transporter with Gmail service and authentication
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 's11924712@stu.najah.edu',
            pass: 'iusc qhfd ikgg vwgr', // Use your App Password here
          },
        });

        // Send the email
        transporter.sendMail(mailOptions, (emailError, info) => {
          if (emailError) {
            console.error('Error sending email:', emailError);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      } else {
        console.error(`User with ID ${userId} not found`);
        // Handle the case where the user is not found, e.g., by returning an error response
      }
    }

    // Close the database connection
    connection.end();
  });
};

  
  
  
  const getUserAlerts = async () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbConfig);
      const query = 'SELECT * FROM user_alerts';
      connection.query(query, (error, results) => {
        if (error) {
          console.error('Error fetching user alerts:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9








  app.post('/api/reports', async (req, res) => {
    const report = req.body;
  
    // Basic validation
    if (!report || !report.reporter_id || !report.issue_type || !report.description || !report.location) {
      return res.status(400).json({ error: 'Invalid report data' });
    }
  
    const connection = mysql.createConnection(dbConfig);
  
    try {
      const result = await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO environmental_reports (reporter_id, issue_type, description, location) VALUES (?, ?, ?, ?)',
          [report.reporter_id, report.issue_type, report.description, report.location],
          (error, results) => {
            connection.end();
            if (error) {
              console.error('Error submitting report:', error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
  
      console.log(`Inserted ${result.affectedRows} row(s)`);
      res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
      console.error('Error submitting report:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////00

  app.post('/api/calculate-sustainability/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    // Fetch user's environmental contributions from the database
    const environmentalContributions = await getEnvironmentalContributions(userId);
  
    // Calculate the sustainability score (customize this based on your criteria)
    const sustainabilityScore = calculateSustainabilityScore(environmentalContributions);
  
    // Update the user's sustainability score in the database
    await updateSustainabilityScore(userId, sustainabilityScore);
  
    res.status(200).json({ message: 'Sustainability score updated successfully', score: sustainabilityScore });
  });
  
  // Function to get environmental contributions of a user from the database
  const getEnvironmentalContributions = async (userId) => {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(dbConfig);  // Declare and initialize pool here
  
      const query = 'SELECT air_quality, temperature, humidity, water_quality, biodiversity_metrics FROM environmental_data WHERE user_id = ?';
      pool.query(query, [userId], (error, results) => {
        pool.end();  // Close the pool after the query is executed
  
        if (error) {
          console.error('Error fetching environmental contributions:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  // Function to calculate the sustainability score (customize based on your criteria)
  const calculateSustainabilityScore = (contributions) => {
    // Example: Calculate the score based on the provided environmental contributions
    const airQualityScore = contributions.reduce((sum, entry) => sum + entry.air_quality, 0);
    const temperatureScore = contributions.reduce((sum, entry) => sum + entry.temperature, 0);
    const humidityScore = contributions.reduce((sum, entry) => sum + entry.humidity, 0);
    const waterQualityScore = contributions.reduce((sum, entry) => sum + entry.water_quality, 0);
    const biodiversityScore = contributions.reduce((sum, entry) => sum + entry.biodiversity_metrics, 0);
  
    // You can add more criteria and calculations here
  
    const totalScore = airQualityScore + temperatureScore + humidityScore + waterQualityScore + biodiversityScore;
    return totalScore;
  };
  
  // Function to update the user's sustainability score in the database
  const updateSustainabilityScore = async (userId, score) => {
    return new Promise((resolve, reject) => {
      const pool = mysql.createPool(dbConfig);
      const query = 'UPDATE users SET sustainability_score = ? WHERE id = ?';
      pool.query(query, [score, userId], (error, results) => {
        if (error) {
          console.error('Error updating sustainability score:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////22


  
   
    const educationalResources = [
      { id: '1', title: 'Introduction to Sustainable Living', url: 'https://example.com/sustainable-living' },
      { id: '2', title: 'Reducing Carbon Footprint: Tips and Tricks', url: 'https://example.com/reducing-carbon-footprint' },
      // Add more resources as needed
    ];
    
    // Endpoint to get details of a specific educational resource
    app.get('/api/educational-resources/:resourceId', (req, res) => {
      const resourceId = req.params.resourceId;
    
      // Find the educational resource with the specified ID
      const resource = educationalResources.find((r) => r.id === resourceId);
    
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
    
      // Dummy response for demonstration purposes
      const resourceDetails = {
        title: resource.title,
        url: resource.url,
        content: `This is the content of the educational resource ${resourceId}.`,
        additionalInfo: 'Additional information about the resource.',
      };
    
      res.status(200).json(resourceDetails);
    });
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////33


    app.get('/api/open-data', async (req, res) => {
      try {
        // Fetch and aggregate environmental data (customize based on your data model)
        const aggregatedData = await aggregateEnvironmentalData();
    
        // Return the aggregated data as a response
        res.status(200).json(aggregatedData);
      } catch (error) {
        console.error('Error fetching aggregated environmental data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    // Function to aggregate environmental data (customize based on your data model)
    const aggregateEnvironmentalData = async () => {
      return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(dbConfig);
    
        // Example: Aggregate data by calculating average values
        const query = 'SELECT AVG(air_quality) AS avg_air_quality, AVG(temperature) AS avg_temperature, AVG(humidity) AS avg_humidity, AVG(water_quality) AS avg_water_quality, AVG(biodiversity_metrics) AS avg_biodiversity_metrics FROM environmental_data';
    
        connection.query(query, (error, results) => {
          connection.end();
    
          if (error) {
            console.error('Error aggregating environmental data:', error);
            reject(error);
          } else {
            // Return the aggregated data
            resolve(results[0]);
          }
        });
      });
    };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Example endpoint to get weather information from an external API
    app.get('/api/weather/:city', async (req, res) => {
      const city = req.params.city;
      const apiKey = 'c7818db7f2c58058084b9312bfd1e02a'; // Replace with your actual API key
    
      try {
        // Replace 'api.openweathermap.org' with the correct API endpoint
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    
        // Extract relevant data from the OpenWeatherMap API response
        const { main, weather } = response.data;
        const temperature = main.temp;
        const conditions = weather[0].description;
        const humidity = main.humidity;
    
        // Return the data to the client
        res.status(200).json({
          temperature,
          conditions,
          humidity,
        });
      } catch (error) {
        console.error('Error fetching weather data from OpenWeatherMap API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Retrieve all records (Read)
app.get('/api/data', (req, res) => {
  const selectQuery = 'SELECT * FROM environmental_data';
  const connection = mysql.createConnection(dbConfig);
  connection.query(selectQuery, (error, results, fields) => {
    if (error) {
      console.error('Error retrieving records:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Update a record (Update)
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { air_quality, temperature, humidity, water_quality, biodiversity_metrics } = req.body;
  const connection = mysql.createConnection(dbConfig);
  const updateQuery = 'UPDATE environmental_data SET air_quality=?, temperature=?, humidity=?, water_quality=?, biodiversity_metrics=? WHERE id=?';

  connection.query(updateQuery, [air_quality, temperature, humidity, water_quality, biodiversity_metrics, id], (error, results, fields) => {
    if (error) {
      console.error('Error updating record:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send('Record updated successfully');
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete a record (Delete)
app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const connection = mysql.createConnection(dbConfig);
  const deleteQuery = 'DELETE FROM environmental_data WHERE id=?';

  connection.query(deleteQuery, [id], (error, results, fields) => {
    if (error) {
      console.error('Error deleting record:', error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send('Record deleted successfully');
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

  // Insert the user into the database with the hashed password
  connection.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    (error, results, fields) => {
      if (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(`User registered successfully`);
        res.status(201).json({ message: 'User registered successfully' });
      }
    }
  );
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//for login user

app.post('/api/login', (req, res) => {
  const { userId, password } = req.body;

  // Fetch user from the database by user ID
  connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      console.log(`User with ID ${userId} not found`);
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const user = results[0];

      // Compare the provided password with the stored password in the database
      if (password === user.password) {
        // Generate a JWT token for authentication (if needed)
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
      } else {
        console.log(`Password mismatch for user with ID ${userId}`);
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////




app.get('/api/environmental-data', (req, res) => {
  const selectQuery = 'SELECT * FROM environmental_data';
  connection.query(selectQuery, (error, results, fields) => {
      if (error) {
          console.error('Error retrieving environmental data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});


app.get('/api/environmental-data', (req, res) => {
  res.json(environmentalData);
});
app.use(express.static('index.html'));

// Endpoint to serve the HTML file
app.get('/chart', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events WHERE event_date > NOW() ORDER BY event_date';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/events', (req, res) => {
  const query = 'SELECT * FROM events WHERE event_date > NOW() ORDER BY event_date';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Get event details
app.get('/api/events/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const query = 'SELECT * FROM events WHERE id = ?';
  connection.query(query, [eventId], (error, results) => {
    if (error) {
      console.error('Error fetching event details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// Add a new event (authentication and authorization checks not included)
app.post('/api/events', (req, res) => {
  const { eventName, description, date, location, organizer } = req.body;
  const query = 'INSERT INTO events (event_name, description, event_date, location, organizer) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [eventName, description, date, location, organizer], (error, results) => {
    if (error) {
      console.error('Error adding new event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'Event added successfully' });
    }
  });
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const apiKey = 'c7818db7f2c58058084b9312bfd1e02a';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/api/photos/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const query = 'INSERT INTO photos (url) VALUES (?)';
    connection.query(query, [photoUrl], (err, result) => {
      if (err) {
        console.error('Error inserting photo into database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({ photoUrl: photoUrl, photoId: result.insertId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//outfit 


async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const response = await axios.get(apiUrl);

    if (response.data && response.data.main && response.data.weather) {
      const temperatureKelvin = response.data.main.temp;
      const temperatureCelsius = temperatureKelvin - 273.15; // Convert Kelvin to Celsius

      return {
        temperature: temperatureCelsius,
        weatherDescription: response.data.weather[0].description,
      };
    }

    return null;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
}

function suggestOutfit(weatherData) {
  const { temperature, weatherDescription } = weatherData;

  if (temperature > 25) {
    return `Wear something light and comfortable. It's a warm day with a temperature of ${temperature}°C!`;
  } else if (temperature > 10) {
    return `A light jacket might be a good idea. It's a mild day with a temperature of ${temperature}°C.`;
  } else {
    return `It's cold outside. Don't forget to wear a warm coat! The temperature is ${temperature}°C.`;
  }
}

app.get('/outfit-suggestion', async (req, res) => {
  try {
    const city = req.query.city;
    const weatherData = await getWeatherData(city);

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    const outfitSuggestion = suggestOutfit(weatherData);
    res.json({ outfitSuggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





















app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
