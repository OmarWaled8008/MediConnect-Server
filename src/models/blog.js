const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "authorType",
  },
  authorType: {
    type: String,
    required: true,
    enum: ["Patient", "Facility"],
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "comments.userType",
      },
      userType: {
        type: String,
        required: true,
        enum: ["Patient", "Facility"],
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  reactions: {
    type: Map,
    of: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
