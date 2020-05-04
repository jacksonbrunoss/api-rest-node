const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require('../middleware/login');

const produtosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
  destination: function (req, file, call) {
    call(null, "./uploads/");
  },
  filename: function (req, file, call) {
    call(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, call) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    call(null, true)
  } else {
    call(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
});

// MOSTRAR TODOS OS PRODUTOS
router.get("/", produtosController.getProdutos);

// INSERE UM PRODUTO
router.post("/", login.obrigatorio, upload.single(`produto_imagem`), produtosController.postProdutos);

// MOSTRAR UM UNICO PRODUTO PELO ID
router.get("/:id_produto", produtosController.getProdutosId);

// ALTERAR UM PRODUTO
router.patch("/", login.obrigatorio, produtosController.patchProdutos);

// DELETAR UM PRODUTO
router.delete("/", login.obrigatorio, produtosController.deleteProdutos);

module.exports = router;