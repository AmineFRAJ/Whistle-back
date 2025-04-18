const express = require('express');
const router = express.Router();
const controller = require('../controllers/footballController');

router.get('/matches', controller.getMatches);
router.get('/matches/finished', controller.getMatchesFinished);
router.get('/matches/league/:name', controller.filterLeagueMatches);
router.get('/news', controller.getNews);

module.exports = router;
