const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));

app.get('/test', (req, res) => {
    res.json({'sasas': 'sasas'})
});

app.post('/login', (req, res) => {
    if (req.body.userName === 'user' && req.body.password === '123') {
        console.log('Login successful!')
        res.sendFile('public/home.html', {root: __dirname})
    } else {
        res.sendFile('public/loginFailure.html', {root: __dirname})
    }
    
})

app.listen(port, () => console.log(`Server running on port: ${port}`));