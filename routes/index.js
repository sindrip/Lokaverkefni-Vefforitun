const express = require('express');

const router = express.Router();

const axios = require('axios');

const API_KEY = 'XXX';

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('layout', { title: 'Express' });
});

function callRiot(path) {
  const instance = axios.create({ baseURL: ' https://global.api.pvp.net' });
  return instance.get(path);
}

router.get('/data', (req, res) => {
  const champUrl = '/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=' + API_KEY;
  callRiot(champUrl)
    .then((result) => {
      res.json(result.data);
    })
    .catch((error) => {
      res.render('error', { title: error, error });
    });
});

module.exports = router;
