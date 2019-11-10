var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/nodeJS",{ useNewUrlParser: true });
mongoose.connect("mongodb+srv://leo:8450@cluster0-j670a.gcp.mongodb.net/nodeJS",{ useNewUrlParser: true });

const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String
});

var User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  console.log(candidatePassword);
  bcrypt.compare(candidatePassword, hash, (err, result) => {
    if (err) {
      throw err;
    }
    callback(null, result);
  });
};

// module.exports.comparePassword = (candidatePassword,hash,callback) => {
//     bcrypt.compareSync("a", hash, function(err, result) {
//         console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$44")
//         if (err) { throw (err); }
//         console.log(result,hash);
//         callback(null,result);
//     });
// }

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save();
    });
  });
};
