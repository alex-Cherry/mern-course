const Router  = require('express');
const LinkModel = require('../models/Link');

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const link = await LinkModel.findOne({ code: req.params.id });
    if (link) {
      link.clicks++;
      await link.save();
      return res.redirect(link.from);
    }

    res.status(404).json({ message: 'Ссылка не найдена' });

  } catch (err) {
    res.status(500).json({ message: "Ошибка при запросе" });
  }
});

module.exports = router;
