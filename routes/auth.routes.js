const { Router } = require('express');
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = Router();

// prefix - /api/auth
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      // check errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        });
      }
      // 
      const { email, password } = req.body;
      // find user in DB
      const candidate = await UserModel.findOne({ email });
      // if user exists, return error
      if (candidate) {
        return res.status(400).json({ message: 'Такой email уже зарегистрирован' });
      }
      
      const hashPwd = await bcrypt.hash(password, 12);
      const user = new UserModel({ email, password: hashPwd });
      await user.save();

      res.status(201).json({ message: 'Пользователь создан' });

    } catch (e) {
      res.status(500).json({ message: "Ошибка при запросе." });
    }
  }
);

// prefix - /api/auth
router.post(
  '/login',
  [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      // check errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        });
      }
      // 
      const { email, password } = req.body;
      // find user in DB
      const user = await UserModel.findOne({ email });
      // if user exists, return error
      if (!user) {
        return res.status(400).json({ message: 'Такой email не зарегистрирован' });
      }
      // compare passwords
      const pwdsAreSame = await bcrypt.compare(password, user.password);
      if (!pwdsAreSame) {
        return res.status(400).json({ message: 'Неверный пароль' });
      }

      const userId = user.id;
      // create token
      const token = jwt.sign(
        { userId },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      );
      // success result
      res.json({ token, userId });

    } catch (e) {
      res.status(500).json({ message: "Ошибка при запросе." });
    }
  }
);

module.exports = router;
