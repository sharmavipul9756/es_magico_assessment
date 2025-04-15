const { model, Schema, SchemaTypes } = require("mongoose");

const product_listing = new Schema({
  epic_sku_id: {
    type: String,
    required: true,
  },
  product_sku_id: {
    type: Schema.Types.ObjectId, 
    ref: "ProductSku"
  },
  marketplace: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'delisted'],
    default: 'pending',
    required: true
  },
  epic_status: {
    type: String
  },
  metadata: {
    type: SchemaTypes.Mixed
  }
}, {
  timestamps: true
});

// Composite unique index: (product_sku_id, marketplace, country)
product_listing.index(
  { product_sku_id: 1, marketplace: 1, country: 1 },
  { unique: true, name: "unique_product_sku_id_marketplace_profile_id" }
);

const ProductListing = model("ProductListing", product_listing);

module.exports = ProductListing;
