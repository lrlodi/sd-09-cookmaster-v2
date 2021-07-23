const PictureService = require('../services/PictureService');
const uploadToMemory = require('../middlewares/uploadImg');

const uploadPicture = [
  uploadToMemory.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const token = req.headers.authorization;
      const { buffer } = req.file;    
      const response = await PictureService.uploadPicture(id, buffer, token);
      res.status(response.status).json(response.result);
    } catch (e) {
      console.log(e.message);
    }
  },
];

module.exports = {
  uploadPicture,
};