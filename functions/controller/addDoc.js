const { db } = require('../config/firebase');
module.exports.addDoc = async (req, res) => {
  try {
    const {
      body: { date, name },
      params: { userEmail },
    } = req;
    const document = db.collection(userEmail).doc();
    const documentObject = {
      date,
      name,
    };

    document.set(documentObject);

    res.status(200).send({
      status: 'success',
      message: 'doc added successfully',
      data: documentObject,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
