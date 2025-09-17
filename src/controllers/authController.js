const prisma = require('../config/database');

class AuthController {
  static async signup(req, res, next) {
    try {
      const { email, name } = req.body;
      
      const user = await prisma.user.create({
        data: { email, name }
      });

      res.status(201).json({
        success: true,
        data: { id: user.id, email: user.email, name: user.name },
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email } = req.body;
      
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { id: user.id, email: user.email, name: user.name },
        message: 'Login successful'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;