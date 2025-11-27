// src/controllers/authController.js

module.exports = (authService) => ({
  registrar: async (req, res, next) => {
    try {
      const { user, token } = await authService.registrar(req.body);
      res.status(201).json({ success: true, user, token });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ success: true, user, token });
    } catch (error) {
      next(error);
    }
  },
});
