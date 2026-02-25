import mongoose from "mongoose";
import mongoosepaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: Number,
    status: { type: Boolean, default: true },
    thumbnails: [String]
});

productSchema.plugin(mongoosepaginate);

export default mongoose.model('Product', productSchema);