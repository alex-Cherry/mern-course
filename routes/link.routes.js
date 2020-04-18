const { Router } = require('express');
const config = require('config');
const shortid = require('shortid');
const LinkModel = require('../models/Link');
const authMW = require('../middleware/auth.middleware');

const router = Router();

router.post('/generate', authMW, async (req, res) => {
  try {
    const baseURL = config.get('baseURL');
    const { from } = req.body;

    const code = shortid.generate();
    const existing = await LinkModel.findOne({ from });
    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseURL + '/t/' + code;
    const link = new LinkModel({
      code, to, from, owner: req.user.userId
    });
    await link.save();
    res.status(201).json({ link });

  } catch (e) {
    res.status(500).json({ message: "Ошибка при запросе." });
  }
});

router.get('/', authMW, async (req, res) => {
  try {
    const links = await LinkModel.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Ошибка при запросе." });
  }
});

router.get('/:id', authMW, async (req, res) => {
  try {
    const link = await LinkModel.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: "Ошибка при запросе." });
  }
});

module.exports = router;
