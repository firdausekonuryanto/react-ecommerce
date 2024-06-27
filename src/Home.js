import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartProducts, setCartProducts] = useState(JSON.parse(localStorage.getItem('cartProducts')) || []); // Load from localStorage
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts)); // Save to localStorage whenever cart changes
  }, [cartProducts]);

  const fetchProducts = useCallback(() => {
    axios.get('http://localhost:5000/api/product', {
      params: { page: currentPage, limit: 10 }
    })
      .then(response => {
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [currentPage]);

  const searchProducts = useCallback(debounce((query) => {
    axios.get('http://localhost:5000/api/product', {
      params: { q: query }
    })
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, 300), [currentPage]); // 300ms debounce

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  const handleAddToCart = (product) => {
    setCartProducts([...cartProducts, product]); // Add the clicked product to the cart state
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCartProducts(cartProducts.filter(product => product._id !== productToRemove._id)); // Remove product from cart
  };

  const handleClearCart = () => {
    const confirmed = window.confirm('Are you sure you want to clear the cart?');
    if (confirmed) {
      setCartProducts([]);
      localStorage.removeItem('cartProducts'); // Remove cart data from local storage
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleQuantityChange = (product, quantity) => {
    const updatedCart = cartProducts.map((item) => 
      item._id === product._id ? { ...item, quantity: parseInt(quantity) } : item
    );
    setCartProducts(updatedCart);
  };
  
  const calculateTotal = () => {
    let total = 0;
    cartProducts.forEach(product => {
      total += product.price * (product.quantity || 0);
    });
    return total.toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/Finaltransaction'); // Redirect to checkout page
  }

  return (
    <div className="home">
      <div className="banner">
        <h2>Welcome to Our Shoe Store!</h2>
        <p>Find the perfect pair of shoes for any occasion.</p>
        <div className="input-group mb-3">
          <input type="text" className="form-control custom-input form-control_search" placeholder="Type in your search keyword" aria-label="Type in your search keyword" aria-describedby="button-addon2" value={searchQuery}
            onChange={handleSearch}></input>
        </div>
      </div>

      <div className="featured-products">
        <center><h3>Featured Products</h3></center>
        <div className="product-list">
          {products.map((product, index) => (
            <div className="product" key={index} onClick={() => handleAddToCart(product)}>
              <img src={`http://localhost:5000/public/image_product/${product.imageName}`} alt={product.name} style={{ width: '100px', height: 'auto' }} />
              <hr />
              <h5>{product.name}</h5>
              <p className='price'>${product.price.toFixed(2)}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {cartProducts.length > 0 && (
        <div className="shopping-cart">
          <h3>Shopping Cart</h3>
          <hr></hr>
          <div className="cart-item">
            <table width={'100%'}>
              <thead>
                <tr style={{ backgroundColor: 'gold', fontWeight: 'bold' }}>
                  <td>No</td>
                  <td>Img</td>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Qty</td>
                  <td>Sub Total</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td><img src={`http://localhost:5000/public/image_product/${product.imageName}`} alt={product.name} style={{ width: '50px' }} /></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {product.name.split(' ').slice(0, 3).join(' ')}
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <input 
                        type='number' 
                        style={{ width: '70px' }} 
                        value={product.quantity || 0}
                        onChange={(e) => handleQuantityChange(product, e.target.value)}
                      />
                    </td>
                    <td>${(product.price * (product.quantity || 0)).toFixed(2)}</td>
                    <td>
                      <button className='btn btn-danger' onClick={() => handleRemoveFromCart(product)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tr style={{backgroundColor:'orange'}}>
                <td colSpan={5} align='center'><b>TOTAL</b></td>
                <td colSpan={2}><b>${calculateTotal()}</b></td>
              </tr>
            </table>
            <button className='btn btn-danger' onClick={handleClearCart}>Clear Cart</button>
            <button className='btn btn-success' onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
