const { current } = require('@reduxjs/toolkit');
const { db } = require('../config/firebase');

module.exports.updateDoc = async (req, res) => {
  const {
    body: {
      date,
      name,
      salary,
      servingTime,
      waiterPayment,
      returnHome,
      returnHomeAllowance,
      numberOfGifts,
      giftAllowance,
      commemorativePhoto,
      commemorativePhotoAllowance,
    },
    params: { userEmail, entryId },
  } = req;
  try {
    const entry = db.collection(userEmail).doc(entryId);
    //const currentData = (await entry.get()).data() || {};
    const entryObject = {
      date,
      name,
      salary,
      servingTime,
      waiterPayment,
      returnHome,
      returnHomeAllowance,
      numberOfGifts,
      giftAllowance,
      commemorativePhoto,
      commemorativePhotoAllowance,
    };

    await entry.set(entryObject).catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',
      data: entryObject,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
