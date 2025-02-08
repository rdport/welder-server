module.exports = async (req, res, next) => {
  try {
    if (req.loggedInUser.class === "master") {
      next();
    } else {
      throw {
        status: 401,
        message: "Unauthorized Access!"
      }
    }
  } catch (err) {
    next(err);
  }
}