

import fs from 'fs';
import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'apexa_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const insertImage = (imagePath, email) => {
    try {
        const image = fs.readFileSync(imagePath);
        const checkEmailSql = 'SELECT email FROM users WHERE email = ?';
        
        // Check if the email exists in the related table
        db.query(checkEmailSql, [email], (err, results) => {
            if (err) {
                console.error('Error checking email:', err);
                db.end();
                return;
            }

            if (results.length === 0) {
                console.error('Email does not exist in the users table');
                db.end();
                return;
            }

            const insertImageSql = 'INSERT INTO images (image, email) VALUES (?, ?)';
            
            db.query(insertImageSql, [image, email], (err, result) => {
                if (err) {
                    console.error('Error inserting image:', err);
                    db.end();
                    return;
                }
                console.log('Image inserted successfully');
                db.end(); // Close the database connection after insertion
            });
        });
    } catch (error) {
        console.error('Error reading image file:', error);
    }
};

// Replace with the path to your image file and the email address
const imagePath = "C:\\Users\\TUF\\Documents\\APEXA\\images\\c5.jpg";
const email = "madaraabeysinghe@yahoo.com";
insertImage(imagePath, email);

