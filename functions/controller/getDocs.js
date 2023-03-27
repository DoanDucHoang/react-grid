const { db } = require('../config/firebase');

module.exports.getDocs = async (req, res) => {
  const { userEmail, value, sort } = req.params;
  // try {
  //   const document = db
  //     .collection(userEmail)
  //     .orderBy(value, sort)
  //     .onSnapshot(querySnapshot => {
  //       const data = querySnapshot.docs.map(doc => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       }));
  //       return res.status(200).json(data);
  //     });
  // } catch (error) {
  //   return res.status(500).json(error.message);
  // }
  try {
    const allEntries = [];
    const querySnapshot = await db
      .collection(userEmail)
      .orderBy(value, sort)
      .get();
    querySnapshot.docs.forEach(doc => {
      allEntries.push({ ...doc.data(), id: doc.id });
    });
    return res.status(200).json(allEntries);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
