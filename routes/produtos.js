const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fild) => {
                if(error) { return res.status(500).send({ error: error })}
                return res.status(201).send({
                    produtos: result
                })
            }
        )
    });
});

// INSERE UM PRODUTO - 
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, fild) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                res.status(201).send({
                    mensagem: "Produto inserido com sucesso.",
                    id_produto: result.insertId
                })
            }
        )
    })

    
});

router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fild) => {
                if(error) { return res.status(500).send({ error: error })}
                return res.status(200).send({
                    response: result
                })
            }
        )
    })
});

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
                SET nome            = ?,
                    preco           = ?
                WHERE id_produto    = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                res.status(202).send({
                    mensagem: "Produto alterado com sucesso.",
                })

            }
        )
    })
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [
                req.body.id_produto
            ],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error })}
                res.status(202).send({
                    mensagem: "Produto excluido com sucesso.",
                })

            }
        )
    })
});

module.exports = router
