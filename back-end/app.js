const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();
const sequelize = require('./util/database');
const cors = require('cors');

app.use(cors());

// Middleware para analisar dados de formulário
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware para analisar JSON (se necessário)
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Rotas
const userRoutes = require('./routes/User');
app.use(userRoutes);

sequelize
    .sync({/* force: true */})
    .then(res => {
        app.listen(process.env.PORT, () => {
            console.log("Server Listening on PORT:", process.env.PORT);
        });
    })
    .catch(err => {
        console.log(err);
    });
