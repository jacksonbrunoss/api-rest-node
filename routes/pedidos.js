const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Usando o GET dentro da rota de pedidos."
    })
});

router.post('/', (req, res, next) => {

    const pedido = { 
        id_pedido: req.body.id_produto,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        mensagem: "Usando o POST dentro da rota de pedidos.",
        pedidoCriado: pedido
    })
});

router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
    if(id === 'especial') {
        res.status(200).send({
            mensagem: "Id Especial.",
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: "Que id é esse?.",
        })
    }
});

router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Usando o DELETE dentro da rota de pedidos."
    })
});

module.exports = router
