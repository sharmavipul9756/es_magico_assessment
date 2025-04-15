const { model, Schema, SchemaTypes } = require("mongoose");

const product_sku = new Schema({
  brand_id: {
    type: Schema.Types.ObjectId, // Assuming you're storing ObjectId for brand ref
  },
  product_url: {
    type: String,
  },
  parentage: {
    type: String,
  },
  name: {
    type: String,
  },
  mfn_sku: {
    type: String,
    unique: true,
  },
  case_quantity: {
    type: Number,
  },
  upc_gtin: {
    type: String,
  },
  asin: {
    type: String,
  },
  epic_purchase_cost: {
    value: { type: Number },
    currency: { type: String }
  },
  contracted_sell_price: {
    value: { type: Number },
    currency: { type: String }
  },
  retail_price: {
    value: { type: Number },
    currency: { type: String }
  },
  lead_time: {
    value: { type: Number },
    unit: { type: String } // e.g., 'days'
  },
  weight: {
    value: { type: Number },
    unit: { type: String } // e.g., 'kg'
  },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String } // e.g., 'cm'
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'discontinued'], // You can expand this list
    default: 'available',
    required: true
  },
  metadata: {
    type: SchemaTypes.Mixed
  },
  is_active: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true // optional: adds createdAt and updatedAt
});

const ProductSku = model("ProductSku", product_sku);

module.exports = ProductSku;
