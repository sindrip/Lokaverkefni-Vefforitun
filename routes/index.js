var express = require('express');
var router = express.Router();

const axios = require('axios');
const API_KEY = 'RGAPI-f4d249c4-0cdd-4aa1-8307-3ec5164f0829';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});

function callRiot(path) {
  const instance = axios.create({ baseURL: ' https://global.api.pvp.net' });
  return instance.get(path);
}

router.get('/data', (req,res) => {
  const champUrl = '/api/lol/static-data/euw/v1.2/champion?champData=info&api_key=' + API_KEY;
  callRiot(champUrl)
    .then((result) => {
      res.json(result.data);
    })
    .catch((error) => {
      res.render('error', { title: error, error});
    });
});

module.exports = router;
