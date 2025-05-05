const express = require('express');
const cors = require('cors');
require('./dbConnection')
const app = express();
const { User, Book, Order, ExchangeBook, Cart, Wishlist, ExchangeHistory } = require('./dbConnection');
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
const port = process.env.PORT || 8000;
app.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const searchQuery = {
      ...(userId ? { userId: { $ne: userId } } : {}),
      items: { $elemMatch: { genre: "Adventure" } } // Use $elemMatch to query nested fields in arrays
    };
    const books = await Book.find(searchQuery, {
      _id: 0,
      items: 1
    });
    const formattedBooks = books.flatMap(book => book.items);
    const shuffledBooks = formattedBooks.sort(() => Math.random() - 0.5);
    const cart=await Cart.findOne({userId});
      res.status(200).json({
        success: true,
        message: 'Books fetched successfully',
        books: shuffledBooks,
        cartitems:cart?cart.items:[]
      });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
});
app.post('/register', async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const emailExists = await User.findOne({ email });
    const mobileExists = await User.findOne({ mobile });
    if (emailExists || mobileExists) {
      return res.status(400).json({ emailExists: !!emailExists, mobileExists: !!mobileExists });
    }
    const user = new User(req.body);
    const savedUser = await user.save();
    console.log('user saved successfully: ', savedUser)
    res.status(201).json({ success: true, message: "User registered successfully" });
  }
  catch (err) {
    console.error('Error saving user: ', err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailExists = await User.findOne({ email: email });
    const passwordMatch = await User.findOne({ email: email, password: password });
    if (!emailExists || !passwordMatch) {
      return res.status(401).json({ emailExists: !!emailExists, passwordMatch: !!passwordMatch })
    }
    else {
      const userDetails = await User.findOne({ email: email }, { _id: 0, __v: 0 });
      res.status(200).json({ message: "login successful", userDetails: userDetails });
      console.log("User logged in succesfully: ", email)
    }
  }
  catch (err) {
    console.error('Error logging in user: ', err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/profile", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ email: req.body.email }, { $set: req.body }, { new: true });
    res.status(200).json({ message: "Profile updated successfully", updatedUser: updatedUser });
  } catch (error) {
    console.log("failed to update profile: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/cart", async (req, res) => {
  try {
    const { userId, ...book } = req.body;
    let cart = await Cart.findOne({ userId });
    if (cart) {
      // Add new book to items array
      cart.items.push(book);
      await cart.save();
    } else {
      // Create a new cart document
      cart = new Cart({
        userId,
        items: [book]
      });
      await cart.save();
    }
    console.log(cart);
    res.status(201).json({ message: "Item added to cart successfully", cartItem: book });
  } catch (error) {
    console.log("Failed to add item to cart: ", error.message);
    res.status(500).json({ error: "Internal Server Error(cart page)" });
  }
});
app.post("/cart/increment", async (req, res) => {
  try {
    const { userId, isbn } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const item = cart.items.find(item => item.isbn === isbn);
    if (item) {
      item.quantity += 1;
    } else {
      return res.status(404).json({ error: "Book not found in cart" });
    }
    await cart.save();
    res.status(200).json({ message: "Quantity incremented", cart });
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/cart/decrement", async (req, res) => {
  try {
    const { userId, isbn } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(item => item.isbn === isbn);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Book not found in cart" });
    }
    const item = cart.items[itemIndex];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // Remove the item if quantity reaches 0
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();
    res.status(200).json({ message: "Quantity decremented", cart });
  } catch (error) {
    console.error("Error decrementing quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/cart/remove", async (req, res) => {
  try {
    const { userId, isbn } = req.query; // Get parameters from query
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    // Remove the book from the cart
    cart.items = cart.items.filter(item => item.isbn !== isbn);
    await cart.save();
    res.status(200).json({ message: "Book removed from cart", cart });
  } catch (error) {
    console.error("Error removing book from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/myshop",async(req,res)=>{
  try {
    const {userId}=req.query;
    const myshopitems=await Book.findOne({userId});
    const myexchangeitems=await ExchangeBook.findOne({userId});
    res.status(200).json({myshopitems:myshopitems.items,myexchangeitems:myexchangeitems.items})
  } catch (error) {
    console.log("error fetching myshop items:",error.message);
    res.status(500).send({message:"internal server error(fetching myshop books)"});
  }
})
app.post("/myshop", async (req, res) => {
  try {
    const { userId, ...book } = req.body;
    if (!book.isbn || book.isbn.trim() === "") {
      return res.status(400).json({ error: "ISBN cannot be empty or null" });
    }
    if (book.description === "" || book.description === null) {
      delete book.description; // Remove the field so Mongoose applies the default
    }
    if (book.coverPhotoUrl === "" || book.coverPhotoUrl === null) {
      delete book.coverPhotoUrl; // Remove the field so Mongoose applies the default
    }
    let user = await Book.findOne({ userId });
    if (!user) {
      user = new Book({ userId, items: [book] });
      await user.save();
    }
    else {
      const existingItem = user.items.find(item => item.isbn === book.isbn);
      if (existingItem) {
        return res.status(200).json({ message: "Book already in shop", existingItem: existingItem });
      }
      user.items.push(book);
      await user.save();
    }
    console.log("book added to shop", book);
    res.status(201).json({ message: "Book added to your shop successfully", bookdata: book });
  } catch (error) {
    console.error("Error adding book to shop:", error);
    res.status(500).json({ error: "Internal Server Error(myshop)" });
  }
});
app.put("/myshop", async (req, res) => {
  try {
    const { userId, ...book } = req.body;
    let user = await Book.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const bookIndex = user.items.findIndex(item => item.isbn === book.isbn);
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found in shop" });
    }
    user.items[bookIndex] = book;
    await user.save();
    console.log("book updated in shop", user);
    res.status(200).json({ message: "Book updated successfully", updatedBook: book });
  } catch (error) {
    console.log("errro updating the book", error);
    res.status(500).send("Internal Server Error(myshop book update)");
  }
});
// Route to delete a book by userId and bookId (isbn)
app.delete('/myshop', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await Book.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const originalLength = user.items.length;
    user.items = user.items.filter(item => item.isbn !== bookId);
    if (user.items.length === originalLength) {
      return res.status(404).json({ message: "Book not found" });
    }
    await user.save();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).send("Internal Server Error (book delete)");
  }
});

app.post("/bookexchange", async (req, res) => {
  try {
    const { userId, ...book } = req.body;
    let user = await ExchangeBook.findOne({ userId });
    let name = await User.findOne({ email: userId });
    const fullName = name.firstname + " " + name.lastname;
    if (!user) {
      user = new ExchangeBook({ userId: userId, items: [{ ...book, ownerName: fullName, ownerId: userId }] });
      await user.save();
    }
    else {
      const existingItem = user.items.find(item => item.isbn === book.isbn);
      if (existingItem) {
        return res.status(200).json({ message: "Book already in exchange", existingItem: existingItem });
      }
      user.items.push({ ...book, ownerName: fullName, ownerId: userId });
      await user.save();
    }
    console.log("book added to exchange", user);
    res.status(201).json({ message: "Book added to exchange successfully", bookdata: { ...book, ownerName: fullName, ownerId: userId } });
  } catch (error) {
    console.log('error adding exchange book', error);
    res.status(500).send("Internal Server Error(myshop)");
  }
});
app.put("/bookexchange", async (req, res) => {
  try {
    const { userId, ...book } = req.body;
    let user = await ExchangeBook.findOne({ userId });
    let name = await User.findOne({ email: userId });
    const fullName = name.firstname + " " + name.lastname;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const bookIndex = user.items.findIndex(item => item.isbn === book.isbn);
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found in exchange" });
    }
    user.items[bookIndex] = { ...book, ownerName: fullName, ownerId: userId };
    await user.save();
    console.log("book updated in exchange", user);
    res.status(200).json({ message: "exchangeBook updated successfully", updatedBook: book });
  } catch (error) {
    console.log("error updating exchange book", error);
    res.status(500).send("Internal Server Error(myexchange update)");
  }
});
app.delete('/bookexchange', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const user = await ExchangeBook.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const originalLength = user.items.length;
    user.items = user.items.filter(item => item.isbn !== bookId);
    if (user.items.length === originalLength) {
      return res.status(404).json({ message: "Book not found" });
    }
    await user.save();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log('error deleting exchange book:', error.message);
    res.status(500).send('Internal server error(exchange book)');
  }
})
app.post('/exchangehistory', async (req, res) => {
  try {
    const { userId, bookId, ownerId } = req.body;
    // Find the book being exchanged using $elemMatch to directly get the matching item
    const exchangeBook = await ExchangeBook.findOne(
      {
        userId: ownerId,
        "items.isbn": bookId
      },
      {
        "items.$": 1 // Only return the matching item
      }
    );
    if (!exchangeBook || !exchangeBook.items || exchangeBook.items.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    const bookToExchange = exchangeBook.items[0];
    // Find or create user's exchange history
    let userHistory = await ExchangeHistory.findOne({ userId });
    if (!userHistory) {
      userHistory = new ExchangeHistory({ userId, items: [] });
    }
    // Add the book to exchange history
    userHistory.items.push(bookToExchange);
    await userHistory.save();
    // Remove the book from available exchanges
    await ExchangeBook.updateOne(
      { userId: ownerId },
      { $pull: { items: { isbn: bookId } } }
    );
    res.status(200).json({
      message: 'Book exchange successful',
      exchangedBook: bookToExchange
    });
  } catch (error) {
    console.error('Error exchanging book:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/orders", async (req, res) => {
  try {
    const { userId } = req.query;
    if(!userId)
      userId='';
    const orders = await Order.findOne({ userId });
    res.status(200).json({ orders });
  } catch (error) {
    console.log("error fetching orders:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/orders", async (req, res) => {
  try {
    const { userId, items } = req.body;
    let userOrder = await Order.findOne({ userId });
    if (!userOrder) {
      userOrder = new Order({ userId: userId, items: items });
      await userOrder.save();
      await Cart.deleteMany();
    }
    else {
      userOrder.items.push(...items);
      await userOrder.save();
      await Cart.deleteMany();
    }
    console.log("order placed", userOrder);
    res.status(201).json({ message: "Order placed successfully", order: userOrder });
  }
  catch (error) {
    console.log('error placing order', error);
    res.status(500).send("Internal Server Error(orders)");
  }
});
app.get("/like", async (req, res) => {
  try {
    const { userId } = req.query;
    if(!userId)
      userId='';
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ items: [] });
    console.log(wishlist)
    res.status(200).json({ wishlist });
  } catch (error) {
    console.log("error fetching wishlist items:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/like", async (req, res) => {
  const { userId, bookId } = req.body;
  let userWishlist = await Wishlist.findOne({ userId });
  try {
    // Find the book in the books collection
    const book = await Book.findOne(
      { "items.isbn": bookId },
      { "items.$": 1 }
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (!userWishlist) {
      userWishlist = new Wishlist({ userId, items: [] });
    }
    // Extract only required fields
    const { title, author, price, isbn, coverPhotoUrl, avgrating } = book.items[0];
    userWishlist.items.push({ title, author, price, isbn, coverPhotoUrl, avgrating });
    await userWishlist.save();
    console.log("Book added to wishlist:", book.items[0]);
    return res.status(201).json({ message: "Book added to wishlist", userWishlist });
  } catch (error) {
    console.error("Error processing wishlist request:", error.message);
    res.status(500).json({ message: "Internal Server Error(like)" });
  }
});
app.delete("/unlike", async (req, res) => {
  const { userId, bookId } = req.body;
  let userWishlist = await Wishlist.findOne({ userId });
  userWishlist.items = userWishlist.items.filter(wishlist => wishlist.isbn !== bookId);
  await userWishlist.save();
  console.log('book unliked', userWishlist)
  res.status(200).send({ message: 'book unliked successfully' })
});
app.get(`/userprofile/:ownerId`, async (req, res) => {
  const ownerId = req.params.ownerId;
  try {
    const user = await User.findOne({ email: ownerId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error(userprofile)" });
  }
});

// Search books endpoint
app.get('/search-books', async (req, res) => {
  try {
    const { query, page = 1, limit = 10, userId } = req.query;
    const skip = (page - 1) * limit;
    let searchQuery = {};
    if (query) {
      searchQuery = {
        $or: [
          { "items.title": { $regex: query, $options: 'i' } },
          { "items.author": { $regex: query, $options: 'i' } },
          { "items.wantedBook": { $regex: query, $options: 'i' } },
          { "items.wantedAuthor": { $regex: query, $options: 'i' } }
        ]
      };
    }
    // If userId is provided, exclude books belonging to that user
    if (userId) {
      searchQuery.userId = { $ne: userId };
    }
    // Get exchange books
    const allBooks = await ExchangeBook.aggregate([
      { $unwind: "$items" },
      {
        $match: searchQuery
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $group: { _id: null, items: { $push: "$items" }, total: { $sum: 1 } } }
    ]);
    // Get total count for pagination
    const totalCount = await ExchangeBook.aggregate([
      { $unwind: "$items" },
      {
        $match: searchQuery
      },
      { $count: "total" }
    ]);
    // Get exchange history for the user if userId is provided
    let exchangeHistory = [];
    if (userId) {
      const history = await ExchangeHistory.findOne({ userId });
      if (history) {
        exchangeHistory = history.items;
      }
    }
    // Shuffle the books for random display
    const shuffledBooks = allBooks.length > 0 ?
      allBooks[0].items.sort(() => Math.random() - 0.5) :
      [];
    res.status(200).json({
      books: shuffledBooks,
      total: totalCount.length > 0 ? totalCount[0].total : 0,
      currentPage: parseInt(page),
      totalPages: Math.ceil((totalCount.length > 0 ? totalCount[0].total : 0) / limit),
      exchangeHistory: exchangeHistory
    });
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// New endpoint for book search and filtering
app.get('/books/search-filter', async (req, res) => {
  try {
    const { searchQuery, genre, language, subject, page = 1, limit = 10, userId } = req.query;
    const skip = (page - 1) * limit;
    // Build the aggregation pipeline
    let pipeline = [];
    // Unwind the items array to work with individual book items
    pipeline.push({ $unwind: "$items" });
    // Match based on search query and filters
    let matchCriteria = {};
    if (searchQuery && searchQuery.trim() !== '') {
      matchCriteria.$or = [
        { "items.title": { $regex: searchQuery.trim(), $options: 'i' } },
        { "items.author": { $regex: searchQuery.trim(), $options: 'i' } }
      ];
    }
    // Handle genre and subject filters
    if (genre) {
      matchCriteria["items.genre"] = genre;
    }
    if (subject) {
      matchCriteria["items.genre"] = subject; // Match subject against genre field
    }
    if (language) {
      matchCriteria["items.language"] = language;
    }
    if (userId) {
      matchCriteria.userId = { $ne: userId };
    }
    // Add the match stage to the pipeline
    if (Object.keys(matchCriteria).length > 0) {
      pipeline.push({ $match: matchCriteria });
    }
    // First get the total count of matching documents
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });
    const countResult = await Book.aggregate(countPipeline);
    const totalBooks = countResult[0]?.total || 0;
    // Now add pagination to the original pipeline
    // pipeline.push({ $skip: skip });
    // pipeline.push({ $limit: parseInt(limit) });

    // Group back the items to maintain the original structure
    pipeline.push({
      $group: {
        _id: "$_id",
        items: { $push: "$items" }
      }
    });
    // Execute the aggregation
    const result = await Book.aggregate(pipeline);
    res.json({
      success: true,
      books: result.flatMap(book => book.items),
      totalBooks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBooks / limit)
    });
  } catch (error) {
    console.error('Error in /books/search-filter:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books'
    });
  }
});
app.listen(port, () => console.log(`listening on port: ${port}`));
