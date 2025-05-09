const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestConnectionSchema = new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ["interested", "ignored", "accepted", "rejected"],
      message: `{VALUE} : Invalid Status type`
    },
    required: true
  }
});
RequestConnectionSchema.index({ fromUserId: 1, toUserId: 1 });
RequestConnectionSchema.pre("save", function (next) {
  const connection = this;
  if (connection.toUserId.equals(connection.fromUserId)) {
    throw new Error("you can't send request to yourself!!");
  }
  next();
});

const requestConnection = mongoose.model(
  "RequestConnection",
  RequestConnectionSchema
);
module.exports = requestConnection;
