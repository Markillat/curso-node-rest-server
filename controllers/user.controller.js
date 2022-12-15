const {response, request } = require('express');

const userGet = (req = request, res = response) => {
    const query = req.query;

    res.status(201).json({
        ok: true,
        msg: "get API - Controller",
        query
    });
};

const userPost = (req, res = response) => {
    const {nombre, edad} = req.body

    res.json({
        ok: true,
        msg: "post API - Controller",
        data: {
            nombre,
            edad
        }
    })
};

const userPut = (req, res = response) => {
    const {id} = req.params;

    res.json({
        ok: true,
        msg: "put API - controller "  + id,
        id
    });
};

const userDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: "delete API - Controller"
    })
};

const userPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: "patch API"
    })
};

module.exports = {userGet, userPost, userPut, userDelete, userPatch};