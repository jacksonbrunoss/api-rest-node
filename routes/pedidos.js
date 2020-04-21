const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: "Usando o GET dentro da rota de pedidos."
    })
});

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensagem: "Usando o POST dentro da rota de pedidos."
    })
});

router.get('/:id_pedidos', (req, res, next) => {
    const id = req.params.id_pedidos
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
