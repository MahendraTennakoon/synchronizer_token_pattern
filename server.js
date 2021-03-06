const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const app = express();
const port = 3000;
var cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/test', (req, res) => {
    res.json({'id': uuidv1()})
});


const SESSIONS = {}

app.post('/login', (req, res) => {
    if (req.body.userName === 'user' && req.body.password === '123') {
        console.log('Login successful!');

        // Generating Session ID and Token
        const SESSION_ID = uuidv1();
        const CSRF_TOKEN = uuidv4();

        SESSIONS[SESSION_ID] = CSRF_TOKEN;

        res.setHeader('Set-Cookie', [`session-id=${SESSION_ID}`]);
        res.sendFile('public/home.html', {root: __dirname})
    } else {
        res.sendFile('public/loginFailure.html', {root: __dirname})
    }
    
})

app.post('/tokens', (req, res) => {
    const sessionID = req.cookies['session-id'];
    console.log(sessionID);
    if (SESSIONS[sessionID]) {
        console.log("POST /tokens: Valid Session ID Found !");
        const response = {token: SESSIONS[sessionID]};
        res.json(response);
    } else {
        console.log("POST /tokens: No Valid Session ID Found !");
        const error = {status: 400, message: 'Invalid Session ID'};
        res.status(400).json(error)
    }
})

app.post('/carDetailsQuery', (req, res) => {
    const sessionID = req.cookies['session-id'];

    console.log(req.body.csrf_field)

    if(SESSIONS[sessionID] === req.body.csrf_field) {
        res.sendfile('/public/success.html', {root: __dirname})
    } else {
        res.sendfile('/public/failure.html', {root: __dirname})
    }
})

app.listen(port, () => console.log(`Server running on port: ${port}`));