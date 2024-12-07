import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';

const salt = 10;
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ["POST", "GET","DELETE"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'apexa_db'
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'teamapexa2024@gmail.com',
        pass: 'glsd dxny pwjo kqoq'
    }
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secrty-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not correct" });
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
};

/*const logActivity = (email, activity) => {
    const sql = "INSERT INTO user_activities (email, activity) VALUES (?, ?)";
    db.query(sql, [email, activity], (err, result) => {
        if (err) console.error("Error logging activity:", err);
    });
};
*/
app.get('/adminpage', verifyUser, (req, res) => {
    return res.json({ Status: "Success", email: req.email });
});

const logActivity = (email, activity) => {
    const sql = "INSERT INTO user_activities (email, activity) VALUES (?, ?)";
    db.query(sql, [email, activity], (err, result) => {
      if (err) {
        console.error("Error logging activity:", err);
      } else {
        console.log("Activity logged successfully:", result);
      }
    });
  };

  //admin page
/*app.get('/user-details', verifyUser, (req, res) => {
    const sql = "SELECT username, email FROM users";
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ Error: "Error fetching users from database" });
        }
        return res.json({ Status: "Success", users: result });
    });
});
*/
app.get('/user-details', verifyUser, (req, res) => {
    const sql = "SELECT username, email FROM users WHERE role = 'user'";
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ Error: "Error fetching users from database" });
        }
        return res.json({ Status: "Success", users: result });
    });
});

app.delete('/deleteuser', verifyUser, (req, res) => {
    const { email } = req.body;
    const sql = "DELETE FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) return res.json({ Error: "Error deleting user from database" });
        if (result.affectedRows === 0) {
            return res.json({ Error: "No user found with this email" });
        }
        logActivity(req.email, `Deleted user with email ${email}`);
        return res.json({ Status: "Success", Message: "User deleted successfully" });
    });
});

app.get('/uploadImagePage', verifyUser, (req, res) => {
    return res.json({ Status: "Success", email: req.email });
});

app.post('/register', (req, res) => {
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [req.body.email], (err, result) => {
        if (err) return res.json({ Error: "Server error while checking email" });

        if (result.length > 0) {
            return res.json({ Error: "Email already exists" });
        } else {
            const sql = "INSERT INTO users (`username`, `email`, `password`, `role`) VALUES (?)";
            bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
                if (err) return res.json({ Error: "Error hashing password" });

                const values = [
                    req.body.username,
                    req.body.email,
                    hash,
                    'user'
                ];

                db.query(sql, [values], (err, result) => {
                    if (err) return res.json({ Error: "Inserting data error in server" });
                    return res.json({ Status: "Success" });
                });
            });
        }
    });
});

app.get('/user-details', verifyUser, (req, res) => {
    const sql = "SELECT username, email FROM users";
    db.query(sql, (err, result) => {
        if (err) {
            return res.json({ Error: "Error fetching users from database" });
        }
        return res.json({ Status: "Success", users: result });
    });
});

app.delete('/deleteuser', verifyUser, (req, res) => {
    const { email } = req.body;
    const sql = "DELETE FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) return res.json({ Error: "Error deleting user from database" });
        if (result.affectedRows === 0) {
            return res.json({ Error: "No user found with this email" });
        }
        logActivity(req.email, `Deleted user with email ${email}`);
        return res.json({ Status: "Success", Message: "User deleted successfully" });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const email = data[0].email;
                    const role = data[0].role;
                    const token = jwt.sign({ email, role }, "jwt-secrty-key", { expiresIn: '1d' });
                    res.cookie('token', token);
                    logActivity(email, 'User logged in');
                    return res.json({ Status: "Success", role });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            });
        } else {
            return res.json({ Error: "No email existed" });
        }
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    logActivity(req.email, 'User logged out');
    return res.json({ Status: "Success" });
});

app.post('/forgotpassword', (req, res) => {
    const { email } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) return res.json({ Error: "Error finding email" });
        if (data.length > 0) {
            const token = jwt.sign({ email: data[0].email }, "jwt-secret-key", { expiresIn: '1h' });
            const url = `http://localhost:3000/resetpassword/${token}`;

            const mailOptions = {
                from: 'teamapexa2024@gmail.com',
                to: email,
                subject: 'Password Reset',
                html: `<p>Click <a href="${url}">here</a> to reset your password</p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.json({ Error: "Error sending email" });
                }
                logActivity(email, 'Password reset email sent');
                return res.json({ Status: "Success", Message: "Email sent" });
            });
        } else {
            return res.json({ Error: "No email existed" });
        }
    });
});

app.post('/resetpassword/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.json({ Error: "Invalid or expired token" });
        }

        bcrypt.hash(password.toString(), salt, (err, hash) => {
            if (err) return res.json({ Error: "Error hashing password" });

            const sql = "UPDATE users SET password = ? WHERE email = ?";
            db.query(sql, [hash, decoded.email], (err, result) => {
                if (err) return res.json({ Error: "Error updating password" });
                logActivity(decoded.email, 'Password reset');
                return res.json({ Status: "Success", Message: "Password updated successfully" });
            });
        });
    });
});

/*app.post('/upload', verifyUser, (req, res) => {
    const { fileData, fileName } = req.body;
    const sql = 'INSERT INTO `user_input_image` (image, email) VALUES (?,?)';
    db.query(sql, [fileData, req.email], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Error saving data.');
            return;
        }
        logActivity(req.email, 'Uploaded an image');
        res.status(200).send('File uploaded successfully.');
    });
});
*/
app.post('/upload', verifyUser, (req, res) => {
    const { fileData, fileName } = req.body;
    const sql = 'INSERT INTO `user_input_image` (image, email) VALUES (?,?)';
    db.query(sql, [fileData, req.email], (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Error saving data.');
            return;
        }
        logActivity(req.email, 'Uploaded an image');
        res.status(200).send('File uploaded successfully.');
    });
});

app.get('/users', verifyUser, (req, res) => {    
    const sql = "SELECT * FROM user_input WHERE email = ?";
    db.query(sql, [req.email], (err, data) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        return res.json(data);
    });
});

app.get('/api/images', (req, res) => {
    const sql = "SELECT * FROM images limit 3";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching images:", err);
            return res.status(500).json({ error: "Failed to fetch images" });
        }
        return res.json(data);
    });
});

/*app.get('/api/images', verifyUser, (req, res) => {
    const email = req.email;
    const sql = "SELECT * FROM images WHERE email = ? LIMIT 3";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Error fetching images:", err);
            return res.status(500).json({ error: "Failed to fetch images" });
        }
        return res.json(data);
    });
});*/

app.get('/api/images/download/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT image FROM images WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).json({ error: "Failed to fetch image" });
        }
        if (data.length > 0) {
            const imageBuffer = data[0].image;
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Disposition', `attachment; filename=image_${id}.jpg`);
            res.send(imageBuffer);
        } else {
            return res.status(404).json({ error: "Image not found" });
        }
    });
});

app.post('/users', verifyUser, (req, res) => {
    const { number_of_room, land_width, land_length, floor_angle } = req.body;
    const sql = "INSERT INTO user_input (number_of_room, land_width, land_length, floor_angle, email) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [number_of_room, land_width, land_length, floor_angle, req.email], (err, result) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Failed to add user", details: err.message });
        }
        logActivity(req.email, 'Added user requirements');
        console.log("New user added:", result);
        return res.status(201).json({ message: "User added successfully" });
    });
});

//when user clicks the generate 3d image button, this function will be called(Manji)

/*app.post('/api/images/insert', (req, res) => {
    const { image_id, image_data } = req.body;
    const decodedImage = Buffer.from(image_data, 'base64');
    const sql = "INSERT INTO 3dmodelinput (image_data) VALUES (?)";
    db.query(sql, [image_id, decodedImage], (err, result) => {
        if (err) {
            console.error("Error saving image:", err);
            return res.status(500).json({ error: "Failed to save image" });
        }
        logActivity(req.email, 'Inserted 3D image');
        console.log("Image saved successfully:", result);
        return res.status(201).json({ message: "Image saved successfully" });
    });
});*/

app.post('/api/images/insert', verifyUser, (req, res) => {
    const { image_id, image_data } = req.body;
    const decodedImage = Buffer.from(image_data, 'base64');
    const email = req.email; // Get the user's email from the request
    const sql = "INSERT INTO 3dmodelinput (image_data, email) VALUES (?, ?)";
    db.query(sql, [decodedImage, email], (err, result) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).json({ error: "Failed to save image" });
      }
      logActivity(email, 'Inserted 3D image');
      console.log("Image saved successfully:", result);
      return res.status(201).json({ message: "Image saved successfully" });
    });
  });

app.get('/api/3dmodeloutput', (req, res) => {
    const sql = "SELECT * FROM 3dmodeloutput limit 1";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching images:", err);
            return res.status(500).json({ error: "Failed to fetch images" });
        }
        return res.json(data);
    });
});

app.get('/api/3dmodeloutput/download/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT image_data FROM 3dmodeloutput WHERE id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error fetching image:", err);
            return res.status(500).json({ error: "Failed to fetch image" });
        }
        if (data.length > 0) {
            const imageBuffer = data[0].image;
            res.setHeader('Content-Type', 'image_data/jpeg');
            res.setHeader('Content-Disposition', `attachment; filename=image_data_${id}.jpg`);
            res.send(imageBuffer);
        } else {
            return res.status(404).json({ error: "Image not found" });
        }
    });
});

// History
app.get('/api/user-data', (req, res) => {
    const email = req.query.email;
  
    const surveyPlanQuery = 'SELECT image FROM user_input_image WHERE email = ?';
    const floorPlanQuery = 'SELECT image FROM 2D_floor_plan WHERE email = ?';
    const view3DQuery = 'SELECT image FROM 3D_plan WHERE email = ?';
  
    db.query(surveyPlanQuery, [email], (err, surveyPlanResults) => {
      if (err) return res.status(500).json(err);
  
      db.query(floorPlanQuery, [email], (err, floorPlanResults) => {
        if (err) return res.status(500).json(err);
  
        db.query(view3DQuery, [email], (err, view3DResults) => {
          if (err) return res.status(500).json(err);
  
          res.json({
            surveyPlan: surveyPlanResults[0]?.image || null,
            floorPlans: floorPlanResults.map((plan) => plan.image),
            view3D: view3DResults[0]?.image || null,
          });
        });
      });
    });
  });

  app.get('/api/user/email', verifyUser, (req, res) => {
    const email = req.email; // Retrieved from verifyUser middleware
    if (email) {
      res.json({ email: email });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });



  // Endpoint to fetch user history with images
app.get('/api/user/history', verifyUser, (req, res) => {
    const email = req.email;
    const queries = [
        "SELECT 'images' as source, image, email FROM images WHERE email = ?",
        "SELECT '3dmodeloutput' as source, image_data as image, email FROM 3dmodeloutput WHERE email = ?"
    ];

    const promises = queries.map(query => {
        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, data) => {
                if (err) {
                    console.error("Error executing query:", query, err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    });

    Promise.all(promises)
        .then(results => {
            const history = results.flat();
            // Convert buffer data to base64 for all images
            history.forEach(item => {
                item.image = item.image.toString('base64');
            });
            res.json({ history });
        })
        .catch(error => {
            console.error("Error fetching user history:", error);
            res.status(500).json({ error: "Failed to fetch user history" });
        });
});



//endpoint for gallery

app.get('/api/gallery-images', (req, res) => {
    const sql = "SELECT id, image_data FROM 3dmodeloutput";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching gallery images:", err);
            return res.status(500).json({ error: "Failed to fetch gallery images" });
        }
        if (data.length > 0) {
            const images = data.map(image => ({
                id: image.id,
                src: `data:image/jpeg;base64,${image.image_data.toString('base64')}`
            }));
            return res.json({ images });
        } else {
            return res.status(404).json({ error: "No images found" });
        }
    });
});

app.get('/search', verifyUser, (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ Error: "Search query is required" });
    }

    const sql = "SELECT username, email FROM users WHERE username LIKE ? OR email LIKE ?";
    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            console.error("Error executing search query:", err);
            return res.status(500).json({ Error: "Failed to execute search" });
        }
        res.json({ Status: "Success", results });
    });
});

  
app.listen(8081, () => {
    console.log("Server running on port 8081...");
});
