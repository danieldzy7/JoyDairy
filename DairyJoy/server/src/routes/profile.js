const express = require('express');

const router = express.Router();

// 简单的单用户个人信息（从 .env 读取）
router.get('/', (_req, res) => {
  res.json({
    name: process.env.USER_NAME || 'Friend',
    birthday: process.env.USER_BIRTHDAY || '1989-10-04',
    zodiac: process.env.USER_ZODIAC || 'libra',
  });
});

module.exports = router;
