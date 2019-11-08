/**
 * Do in this for custome auth
 * it must return user object like user with
 * user={
 *  name : "didin",
 *  sex  : "male"
 * }
 * Untuk On auth ini seharusnya langsung di simpan di session store saja datanya.
 * Nggak usah dilakukan pengecekan lagi di database.
 * Konfigurasi database dan system session akan ditempatkan di plugin
 */
module.exports = async function(session) {
  var db = Mukmin.getDataModel("computate_engine");
  var userRespond = await db.user.findByPk(session.userId);
  // if user respond not found. return null value and do in polices
  if (userRespond === null) {
    return null;
  }  else {
    return userRespond;
  }
};
