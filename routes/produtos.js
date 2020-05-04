const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require("multer");
const login = require('../middleware/login');


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
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query("SELECT * FROM produtos;", (error, result, fild) => {
      if (error) {
        return res.status(500).send({
          error: error
        });
      }
      const response = {
        quantidade: result.length,
        produtos: result.map((prod) => {
          return {
            id_produto: prod.id_produto,
            nome: prod.nome,
            preco: prod.preco,
            imagem_produto: prod.imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os detalhe de um produto.",
              url: `http://loaclhost:5000/produtos/${prod.id_produto}`,
            },
          };
        }),
      };
      return res.status(201).send(response);
    });
  });
});

// INSERE UM PRODUTO
router.post("/", login.obrigatorio, upload.single(`produto_imagem`), (req, res, next) => {
  console.log(req.file)
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)",
      [
        req.body.nome,
        req.body.preco,
        req.file.path
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        const response = {
          mensagem: "Produto inserido com sucesso.",
          produtoCriado: {
            id_produto: result.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            imagem_produto: req.file.path,
            request: {
              tipo: "GET",
              descricao: `Retorna todos os produtos`,
              url: `http://loaclhost:5000/produtos/`,
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

// MOSTRAR UM UNICO PRODUTO PELO ID
router.get("/:id_produto", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ?;",
      [req.params.id_produto],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado produto com este ID",
          });
        }

        const response = {
          produto: {
            id_produto: result[0].insertId,
            nome: result[0].nome,
            preco: result[0].preco,
            imagem_produto: result[0].imagem_produto,
            request: {
              tipo: "GET",
              descricao: `Retorna um produto`,
              url: `http://loaclhost:5000/produtos/`,
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

// ALTERAR UM PRODUTO
router.patch("/", login.obrigatorio, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      `UPDATE produtos
                SET nome            = ?,
                    preco           = ?
                WHERE id_produto    = ?`,
      [req.body.nome, req.body.preco, req.body.id_produto],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        const response = {
          mensagem: "Produto alterado com sucesso.",
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "POST",
              descricao: `Inserindo produtos`,
              url: `http://loaclhost:5000/produtos/${req.body.id_produto}`,
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

// DELETAR UM PRODUTO
router.delete("/", login.obrigatorio, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      `DELETE FROM produtos WHERE id_produto = ?`,
      [req.body.id_produto],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        const response = {
          mensagem: "Produto excluido com sucesso.",
          request: {
            tipo: "POST",
            descricao: "Insere um produto",
            url: `http://loaclhost:5000/produtos`,
            body: {
              nome: "String",
              preco: "Number",
            },
          },
        };
        res.status(202).send(response);
      }
    );
  });
});

module.exports = router;