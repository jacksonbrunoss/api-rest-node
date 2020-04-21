const express = require('express');
const app = express();

app.use((req, res, next) => {
 res.status(200).send({
     mensagem: "Servidor na porta 5000"
 })
});

module.exports = app;