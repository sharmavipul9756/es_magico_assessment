const { model, Schema, SchemaType } = require("mongoose");

const brand = new Schema({
  name: {
    type: String,
  },
  onboarded_at: {
    type: Date,
  },
  profile_pic_url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended", "deleted"],
  },
  metadata: {
    type: SchemaType.mixed
  }
});


const Brand = model('Brand', brand);

module.exports = Brand;
