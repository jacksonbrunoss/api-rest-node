const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.header("Acces-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Alow-Header",
    "Origin",
    "Content-Type",
    "X-Requested-With",
    "Authorization"
  );
  next();
});

app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);

app.use((req, res, next) => {
  const erro = new Error("Não encontrado");
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;