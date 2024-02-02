const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const mysql = require('mysql');

app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/signup', function (req, res) {
    res.render('signup');
});

app.get('/popup', function (req, res) {
    res.render('popup');
});

app.get('/create-assignment', function (req, res) {
    res.render('assignmentcreation');
});

app.get('/login-failed', function (req, res) {
    res.render('loginfailed');
});


// Add other routes and logic as needed

const server = app.listen(8080, function () {
    console.log('Server is listening on port 8080');
});


app.post('/signup', urlencodedParser, function (req, res) {
    const { studentId, firstName, lastName, email } = req.body;

    // Example query to insert signup details into the students table
    const insertQuery = 'INSERT INTO students (StudentID, FirstName, LastName, Email) VALUES (?, ?, ?, ?)';
    const values = [studentId, firstName, lastName, email];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error('Error executing signup query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Signup successful!');
            res.redirect('/login'); // Redirect to the login page after successful signup
        }
    });
});

app.post('/login', urlencodedParser, function (req, res) {
    const { studentId, email } = req.body;

    // Example query to check login credentials
    const loginQuery = 'SELECT * FROM students WHERE StudentID = ? AND Email = ?';
    const values = [studentId, email];

    db.query(loginQuery, values, (err, results) => {
        if (err) {
            console.error('Error executing login query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                // Login successful
                console.log('Login successful!');
                res.redirect('/dashboard'); // Redirect to the dashboard page after successful login
            } else {
                // Login failed
                console.log('Login failed. Invalid credentials.');
                res.redirect('/login-failed'); // Redirect to the login-failed page
            }
        }
    });
});

app.get('/assignment/:assignmentId', function (req, res) {
    const assignmentId = req.params.assignmentId;

    // Query to retrieve assignment details from the database
    const assignmentQuery = 'SELECT * FROM assignments WHERE AssignmentID = ?';
    
    db.query(assignmentQuery, [assignmentId], (err, results) => {
        if (err) {
            console.error('Error retrieving assignment details:', err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                const assignmentDetails = results[0];
                res.render('assignment', { assignmentDetails });
            } else {
                // Assignment not found
                res.status(404).send('Assignment Not Found');
            }
        }
    });
});


app.post('/submitAssignment', function (req, res) {
    const submissionId = req.body.submissionId; // Assuming you have a way to identify the submission
    const grade = req.body.grade;

    // Update the grade in the database
    const updateQuery = 'UPDATE submissions SET grade = ? WHERE submission_id = ?';

    db.query(updateQuery, [grade, submissionId], (err, results) => {
        if (err) {
            console.error('Error updating grade:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/assignments'); // Redirect to the assignments page
        }
    });
});

// Assuming you have a route to display submissions
app.get('/submissions', function (req, res) {
    // Query to retrieve submissions with grades
    const query = 'SELECT * FROM submissions';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving submissions:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('submissions', { submissions: results });
        }
    });
});
