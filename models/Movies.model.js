const { Schema, model } = require("mongoose");



const movieSchema = new Schema(
  {
    title: {
      type: String,
      unique: true
    },
    genre: {
      type: String,
    },
    plot: {
        type: String,
      },
    cast: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Celebrity'
       }
    ]
  }
);

const Movies = model("Movies", movieSchema);

module.exports = Movies;