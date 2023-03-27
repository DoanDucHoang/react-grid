const { db } = require('../config/firebase');

module.exports.deleteDocs = async (req, res) => {
  const { docsId, userEmail } = req.params;

  try {
    const document = db.collection(userEmail).doc(docsId);

    await document.delete().catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'entry deleted successfully',
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
