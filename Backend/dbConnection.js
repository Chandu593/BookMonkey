const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/BookMonkey')
  .then(() => console.log('Connected to MongoDB(BookMonkey)'))
  .catch((err) => console.log('Connection failed: ', err));
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, default: "your city" },
  state: { type: String, default: "your state" },
  pincode: { type: String, default: "Pincode" },
  avatar: { type: String, default: null },
  password: { type: String, required: true }
});
const User = new mongoose.model("User", userSchema);

const MyBookSchema = new mongoose.Schema({
  userId: { type: String, required: "true" },
  items: [{
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    description: { type: String, default: "No description available" },
    price: { type: Number, required: true },
    coverPhotoUrl: { type: String, default: "https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180" },
    avgrating: { type: Number, required: true }
  }]
});
const Book = new mongoose.model("Book", MyBookSchema);

const MyExchangeBookSchema = new mongoose.Schema({
  userId: { type: String, required: "true" },
  items: [{
    title: { type: String, required: true },
    author: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerId: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    condition: { type: String, required: true },
    wantedBook: { type: String, required: true },
    wantedAuthor: { type: String, required: true },
    wantedisbn: { type: String, required: true },
    wantedCondition: { type: String, required: true }
  }]
});
const ExchangeBook = new mongoose.model("ExchangeBook", MyExchangeBookSchema);

const ExchangeHistorySchema = new mongoose.Schema({
  userId: { type: String, required: "true" },
  items: [{
    title: { type: String, required: true },
    author: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerId: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    condition: { type: String, required: true },
    wantedBook: { type: String, required: true },
    wantedAuthor: { type: String, required: true },
    wantedisbn: { type: String, required: true },
    wantedCondition: { type: String, required: true }
  }]
});
const ExchangeHistory = new mongoose.model("ExchangeHistory", ExchangeHistorySchema);

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: "true" },
  items: [{
    title: { type: String, required: "true" },
    author: { type: String, required: "true" },
    isbn: { type: String, required: "true" },
    price: { type: Number, required: "true" },
    coverPhotoUrl: { type: String, default: "https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180" },
    quantity: { type: Number, required: "true", default: 1 },
    avgrating: { type: Number, required: "true" },
    orderedDate: {
      type: String, required: "true", default: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).replace(/ (\d{4})$/, ',$1')
    },
    expectedDeliveryDate: {
      type: String, required: "true", default: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    },
    status: { type: String, required: true, default: "Not delivered" }
  }],
});
const Order = new mongoose.model("Order", OrderSchema);

const CartShema = new mongoose.Schema({
  userId: { type: String, required: "true" },
  items: [{
    title: { type: String, required: "true" },
    author: { type: String, required: "true" },
    isbn: { type: String, required: "true" },
    price: { type: Number, required: "true" },
    coverPhotoUrl: { type: String, default: "https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180" },
    quantity: { type: Number, required: "true", default: 1 },
    avgrating: { type: Number, required: "true" },
  }]
});
const Cart = new mongoose.model("Cart", CartShema);

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: "true" },
  items: [{
    title: { type: String, required: "true" },
    author: { type: String, required: "true" },
    isbn: { type: String, required: "true" },
    price: { type: Number, required: "true" },
    coverPhotoUrl: { type: String, default: "https://tse4.mm.bing.net/th?id=OIP.kbe_yOW8nUXbkwms-0fr3wHaKG&pid=Api&P=0&h=180" },
    description: { type: String },
    avgrating: { type: Number, required: "true" },
    liked:{type:Boolean,default:true}
  }]
});
const Wishlist = new mongoose.model("Wishlist", WishlistSchema);
module.exports = { User, Book, Order, ExchangeBook, Cart, Wishlist, ExchangeHistory };
