const express = require('express');
const { default: mongoose } = require('mongoose');
const ProductSku = require('./models/product_sku');
const ProductListing = require('./models/product_listing');
const app = express();

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/', {
    
}).then(() => {
    console.log("Connected to mongodb");
}).catch((err) => {
    console.log(`${err} in connecting to mongodb`);
})

app.post("/product", async (req, res) => {
    try {
      const { sku = []} = req.body;
      const insertedSkus = [];
        console.log(sku)
      for (const skuItem of sku) {
        const {
          mfn_sku,
          sku_name,
          parentage,
          country,
          case_quantity,
          upc_gtin,
          asin,
          epic_purchase_cost,
          contracted_sell_price,
          retail_price,
          lead_time,
          weight,
          dimensions,
          packaging_weight,
          packaging_dimensions,
          marketplaces = [],
        } = skuItem;
  
        
        const newSku = await ProductSku.create({
          name: sku_name,
          mfn_sku,
          parentage,
          country,
          case_quantity,
          upc_gtin,
          asin,
          epic_purchase_cost,
          contracted_sell_price,
          retail_price,
          lead_time,
          weight,
          dimensions,
          packaging_weight,
          packaging_dimensions
        });
  
        insertedSkus.push(newSku);
  
        console.log(marketplaces)
        for (const market of marketplaces) {
          await ProductListing.create({
            epic_sku_id: mfn_sku,
            product_sku_id: newSku._id,
            marketplace: market.marketplace,
            country: country || "unknown",
            status: market.status || "pending",
          });
        }
      }
  
      const total_record_count = insertedSkus.length;
      const total_page_count = Math.ceil(total_record_count / limit);
  
      res.status(200).json({
        sku: insertedSkus,
        page: Number(page),
        limit: Number(limit),
        total_page_count,
        total_record_count
      });
    } catch (error) {
      console.error("Error in processing SKUs:", error);
      res.status(500).json({ error: "Failed to save product SKUs" });
    }
  });



  app.get('/product', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const parsedLimit = parseInt(limit);
  

      const total_record_count = await ProductSku.countDocuments();
  
      const products = await ProductSku.find()
        .skip(skip)
        .limit(parsedLimit)
        .lean();
  
      const sku = await Promise.all(products.map(async (product) => {
        const listings = await ProductListing.find({ product_sku_id: product._id }).lean();
  
        return {
          parentage: product.parentage,
          mfn_sku: product.mfn_sku,
          sku_name: product.name,
          country: product.country,
          epic_purchase_cost: product.epic_purchase_cost,
          contracted_sell_price: product.contracted_sell_price,
          case_quantity: product.case_quantity,
          upc_gtin: product.upc_gtin,
          retail_price: product.retail_price,
          asin: product.asin,
          lead_time: product.lead_time,
          weight: product.weight,
          dimensions: product.dimensions,
          packaging_weight: product.packaging_weight,
          packaging_dimensions: product.packaging_dimensions,
          marketplaces: listings.map(listing => ({
            status: listing.status,
            marketplace: listing.marketplace
          }))
        };
      }));
  
      const total_page_count = Math.ceil(total_record_count / parsedLimit);
  
      res.json({
        sku,
        page: parseInt(page),
        limit: parsedLimit,
        total_page_count,
        total_record_count
      });
  
    } catch (error) {
      console.error("Error in getting paginated products:", error);
      res.status(500).json({ error: "Failed to get products" });
    }
  });
  


app.listen(3000, () => {
    console.log("listening to port 3000");
} )