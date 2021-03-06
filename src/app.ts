import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

export const app = express();

let users = [];

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/users', function (req, res) {
    const limit = parseInt(req.query.limit || 10, 10);
    if (isNaN(limit)) {
        return res.status(400).end();
    }
    res.json(users.slice(0, limit));
});

app.get('/users/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
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
    if (isNaN(id)) {
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

app.put('/users/:id', function(req, res) {
    const body = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).end();
    }

    if (!(body && body.name)) {
        return res.status(400).end();
    }

    const name = body.name;

    let user = users.filter(x => x.id === id);

    if (user.length===0) {
        return res.status(404).end();
    }

    if (users.filter(x => x.name === name && x.id !== id).length !== 0) {
        return res.status(409).end();
    }
    user[0].name = name;


    res.json(user[0]);
});
