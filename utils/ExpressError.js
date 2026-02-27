class ExpressError extends Error {
  //we declare ExpressError using properties of Error

  constructor(statusCode, message) {
    //error always have two values statusCode and Message
    super(); //used to call constructor of err class
    this.statusCode = statusCode;
    this.message = message;
  }
};
module.exports = ExpressError;
