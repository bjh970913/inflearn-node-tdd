const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

let users = [
    {id: 1, name: 'alice'},
    {id: 2, name: 'bek'},
    {id: 3, name: 'chris'}
];

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/users', function (req, res) {
    const limit = parseInt(req.query.limit || 10, 10);
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }
    res.json(users.slice(0, limit));
});

app.get('/users/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).end();
    }
    const user = users.filter(x => x.id === id);
    if (user.length === 0) {
        return res.status(404).end();
    }

    res.json(user[0]);
});

app.delete('/users/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).end();
    }
    const user = users.filter(x => x.id === id);
    if (user.length === 0) {
        return res.status(404).end();
    }

    users = users.filter(x => x.id !== id);

    res.status(204).end();
});

app.post('/users', (req, res) => {
    const body = req.body;

    if (!body.name || body.name.length === 0) {
        return res.status(400).end();
    }
    if (users.filter(x => x.name === body.name).length !== 0) {
        return res.status(400).end();
    }
    const nextId = users.map(x => x.id).sort((a, b) => b - a)[0] + 1;

    const newUser = {
        id: nextId,
        name: body.name
    };

    users.push(newUser);

    res.status(201)
        .json(newUser);
});

// app.listen(3000, function(){
//    console.log('Example app listening on port 3000!');
// });

module.exports = {
    app
};
