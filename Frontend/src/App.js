import React, { Suspense, lazy, useEffect, useState,createContext } from 'react';
import Navbar1 from './Components/Navbar1';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
const Bookspage = lazy(() => import('./Components/Bookspage'));
const Footer = lazy(() => import('./Components/Footer'));
const Myshop = lazy(() => import('./Components/Myshop'));
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));
const Homepage = lazy(() => import('./Components/Homepage'));
const Cart = lazy(() => import('./Components/Cart'));
const Orders = lazy(() => import('./Components/Orders'));
const Wishlist = lazy(() => import('./Components/Wishlist'));
const Paymentpage = lazy(() => import('./Components/Paymentpage'));
const SplashScreen = lazy(() => import('./Components/SplashScreen'));
const Profile = lazy(() => import('./Components/Profile'));
const ExchangePage = lazy(() => import('./Components/ExchangePage'));
const BackButton = lazy(() => import('./Components/BackButton'));
const UserProfile = lazy(() => import('./Components/UserProfile'));
const PageNotFound = lazy(() => import('./Components/PageNotFound'));
export const context = createContext();

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  function updatelogin(newValue) { setisLoggedIn(newValue) }
  const [data, setdata] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [cartBooks, setcartBooks] = useState([]);
  const [orders, setorders] = useState([]);
  const [wishlistitems, setwishlistitems] = useState([]);
  const [wishlistFetched, setWishlistFetched] = useState(false);
  const [ordersFetched, setordersFetched] = useState(false);
  const [cartFetched, setcartFetched] = useState(false);
  const [myshopbooksFetched, setmyshopbooksFetched] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
          genre: '',
          language: '',
          subject: ''
      });
  const [profile, setprofile] = useState({
    address: "",
    confirmPassword: "",
    email: "",
    firstname: "",
    lastname: "",
    mobile: "",
    password: "",
    city: "your city",
    state: 'your state',
    pincode: 'pincode',
    avatar: null
  })
  const [GlobalexchangeBooks, setGlobalexchangeBooks] = useState([]);
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isNewSession = !sessionStorage.getItem('hasVisited');
    if (isNewSession) {
      setShowSplash(true);
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setprofile(JSON.parse(storedProfile));
      setisLoggedIn(true);
    }
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handlelike = async (book) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`http://localhost:8000/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: profile.email,
            bookId: book.isbn,
          }),
        });
        if (response.status === 201) {
          const result = await response.json();
          console.log(result);
          setwishlistitems(prevItems => {
            const exists = prevItems.find(item => item.isbn === book.isbn);
            if (!exists) {
              return [...prevItems, { ...book, liked: true }];
            }
            return prevItems;
          });
          setdata(prevData =>
            prevData.map(item =>
              item.isbn === book.isbn
                ? { ...item, liked: true }
                : item
            )
          );
        }
      } catch (error) {
        console.log('error adding to wishlist', error);
      }
    }
    else {
      setwishlistitems(prevItems => {
        const exists = prevItems.find(item => item.isbn === book.isbn);
        if (!exists) {
          return [...prevItems, { ...book, liked: true }];
        }
        return prevItems;
      });
      setdata(prevData =>
        prevData.map(item =>
          item.isbn === book.isbn
            ? { ...item, liked: true }
            : item
        )
      );
    }
  }

  const handleunlike = async (book) => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`http://localhost:8000/unlike`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.email, bookId: book.isbn }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          // Remove book from wishlist state
          setwishlistitems(prevItems =>
            prevItems.filter(item => item.isbn !== book.isbn)
          );

          // Update book's liked status in data
          setdata(prevData =>
            prevData.map(item =>
              item.isbn === book.isbn ? { ...item, liked: false } : item
            )
          );
        }
      } catch (error) {
        console.error('Error removing book from wishlist', error);
      }
    } else {
      // Update UI state without API call if user is not logged in
      setwishlistitems(prevItems =>
        prevItems.filter(item => item.isbn !== book.isbn)
      );

      setdata(prevData =>
        prevData.map(item =>
          item.isbn === book.isbn ? { ...item, liked: false } : item
        )
      );
    }
  };


  const getliked = (isbn) => {
    const item = wishlistitems.find(item => item.isbn === isbn);
    return item ? item.liked : false;
  }

  const handleAddToCart = async (book) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:8000/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...book, userId: profile.email }),
        })
        const result = await response.json();
        if (response.status === 201) {
          console.log('book added successfully:', result.cartItem);
          setcartBooks(prevItems => {
            // Check if book already exists in cart
            const exists = prevItems.find(item => item.isbn === book.isbn);
            if (exists) {
              return prevItems;
            }
            // Add new book with quantity 1
            return [...prevItems, { ...book, quantity: 1, isaddedtocart: true }];
          });
        }
      } catch (error) {
        console.log("error adding book to cart", error);
      }
    }
    else {
      console.log(book)
      setcartBooks(prevItems => {
        // Check if book already exists in cart
        const exists = prevItems.find(item => item.isbn === book.isbn);
        if (exists) {
          return prevItems;
        }
        // Add new book with quantity 1
        return [...prevItems, { ...book, quantity: 1, isaddedtocart: true }];
      })
    }
  };

  const handleIncrement = async (isbn) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:8000/cart/increment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.email, isbn }),
        });
        const result = await response.json();
        console.log(result);
        if (response.ok) {
          setcartBooks(prevItems =>
            prevItems.map(item =>
              item.isbn === isbn ? { ...item, quantity: item.quantity + 1 } : item
            )
          );
        }
      } catch (error) {
        console.error("Error incrementing quantity:", error);
      }
    } else {
      // Update only local state if user is not logged in
      setcartBooks(prevItems =>
        prevItems.map(item =>
          item.isbn === isbn ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };


  const handleDecrement = async (isbn) => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:8000/cart/decrement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile.email, isbn }),
        });

        if (response.ok) {
          setcartBooks(prevItems => {
            const item = prevItems.find(item => item.isbn === isbn);

            if (item.quantity === 1) {
              item.isaddedtocart = false;
              return prevItems.filter(item => item.isbn !== isbn);
            }

            return prevItems.map(item =>
              item.isbn === isbn ? { ...item, quantity: item.quantity - 1 } : item
            );
          });
        }
      } catch (error) {
        console.error("Error decrementing quantity:", error);
      }
    } else {
      // Handle local state for guest users
      setcartBooks(prevItems => {
        const item = prevItems.find(item => item.isbn === isbn);

        if (item.quantity === 1) {
          return prevItems.filter(item => item.isbn !== isbn);
        }

        return prevItems.map(item =>
          item.isbn === isbn ? { ...item, quantity: item.quantity - 1 } : item
        );
      });
    }
  };

  const getQuantity = (isbn) => {
    const item = cartBooks.find(item => item.isbn === isbn);
    return item ? item.quantity : 0;
  };
  const getisaddedtocart = (isbn) => {
    const item = cartBooks.find(item => item.isbn === isbn);
    return item ? item.isaddedtocart : false;
  };
  const calculatePriceDetails = () => {
    let totalMRP = 0;
    let totalDiscount = 0;

    cartBooks.forEach(item => {
      const mrp = item.price;
      const sellingPrice = item.price - 50;
      totalMRP += mrp * item.quantity;
      totalDiscount += (mrp - sellingPrice) * item.quantity;
    });

    return {
      totalMRP,
      totalDiscount,
      deliveryCharges: totalMRP > 1000 ? 0 : 40,
      totalAmount: totalMRP - totalDiscount + (totalMRP > 500 ? 0 : 40)
    };
  };
  const fetchData = async () => {
    try {
      setisloading(true);
      const response = await fetch(`http://localhost:8000/?userId=${profile?.email || ''}`);
      const data = await response.json();
      console.log(data);
      console.log(data.books);
      if (data.success) {
        setdata(data.books);
        setcartBooks(data.cartitems);
      } else {
        setError('Failed to fetch books');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [isLoggedIn])
  return (
    <>
      {showSplash ?<SplashScreen onComplete={handleSplashComplete} />: (
        <context.Provider value={{
          isLoggedIn,updatelogin,data,isloading,cartBooks,setcartBooks,handleAddToCart,
          handleIncrement,handleDecrement,getQuantity,getisaddedtocart,orders,setorders,
          wishlistitems,handlelike,handleunlike,getliked,setwishlistitems,calculatePriceDetails,
          GlobalexchangeBooks,setGlobalexchangeBooks,exchangeHistory,setExchangeHistory,
          profile,setprofile,error,selectedFilters, setSelectedFilters,
          wishlistFetched, setWishlistFetched, ordersFetched, setordersFetched, cartFetched, setcartFetched, myshopbooksFetched, setmyshopbooksFetched
        }}>
          <BrowserRouter>
            <Navbar1 />
            <BackButton />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" key='homepage' element={<Homepage />} />
                <Route path="/bookpage" key='bookpage' element={<Bookspage />} />
                <Route path="/myshop" key='myshop' element={<Myshop />} />
                <Route path="/cart" key='cart' element={<Cart />} />
                <Route path="/login" key='login' element={<Login />} />
                <Route path="/register" key='register' element={<Register />} />
                <Route path="/orders" key='orders' element={<Orders />} />
                <Route path="/wishlist" key='wishlist' element={<Wishlist />} />
                <Route path="/payment" key='payment' element={<Paymentpage />} />
                <Route path="/profile" key='profile' element={<Profile />} />
                <Route path="/exchange" key='exchange' element={<ExchangePage />} />
                <Route path="/userprofile/:ownerId" element={<UserProfile />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </BrowserRouter>
        </context.Provider>
      )}
    </>
  );
}

export default React.memo(App);
