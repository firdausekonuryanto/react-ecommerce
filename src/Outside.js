import React, { useEffect, useState, useCallback, useRef  } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Outside.css';
import ModalComponent from './ModalComponent';
import { Modal, Button } from 'react-bootstrap';

function Outside() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartProducts, setCartProducts] = useState(JSON.parse(localStorage.getItem('cartProducts')) || []); // Load from localStorage
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [show, setShow] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [data, setData] = useState({ testing: '', messages: [] });
  const audioRef = useRef(null); 

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    address: '',
    village: '',
    postcode: '',
    distric: '',
    regency: '',
    province: '',
    country: '',
    phone: '',

});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);


  useEffect(() => {
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const images = document.querySelectorAll('.images img');
    const totalSlides = images.length;

    const showSlide = (slideIndex) => {
      for (let i = 0; i < images.length; i++) {
        images[i].style.opacity = 0;
        images[i].style.transform = 'matrix(2, 0, 0, 2, 0, 0)';
      }
      images[slideIndex].style.opacity = 1;
      images[slideIndex].style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
    };

    const nextSlide = () => {
      setCurrentSlide((prevSlide) => {
        const newSlide = (prevSlide + 1) % totalSlides;
        showSlide(newSlide);
        return newSlide;
      });
    };

    showSlide(currentSlide);
    const intervalId = setInterval(nextSlide, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');

    ws.onmessage = (event) => {
      const newMessage = event.data;
      setData((prevData) => ({
        ...prevData,
        messages: [...prevData.messages, newMessage],
      }));
      if (audioRef.current) {
        audioRef.current.play();
      }
    };

    return () => {
      ws.close();
    };
  }, []);
  
  const fetchProducts = useCallback(() => {
    axios.get(`${process.env.REACT_APP_API_URL}api/product`, {
      params: { page: currentPage, limit: 10 }
    })
      .then(response => {
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [currentPage]);

  const searchProducts = useCallback(debounce((query) => {
    axios.get(`${process.env.REACT_APP_API_URL}api/product`, {
      params: { q: query }
    })
      .then(response => setProducts(response.data.products))
      .catch(error => console.error('Error fetching products:', error));
  }, 300), [currentPage]);

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

  const handlePlaySound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleMessage = (event) => {
    handlePlaySound();
  };

  const handleCheckout = () => {
    navigate('/Finaltransaction'); 
  }

  return (
    <div style={{marginBottom:'30px'}}>
     <div>
     <audio ref={audioRef} src={`${process.env.REACT_APP_API_URL}public/image_product/sound.mp3`} />
     {/* <button onClick={handlePlaySound}>Play Sound</button> */}
    </div>

      <div className='container-fluid header_outside' style={{display:'flex', width:'100%'}}>
          <div align='center' style={{width:'33%'}}>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-instagram"
          viewBox="0 0 16 16"
          style={{marginLeft: '50px'}}
        >
          <path
            d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-facebook"
          style={{marginLeft: '10px'}}
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-whatsapp"
          style={{marginLeft: '10px'}}
          viewBox="0 0 16 16"
        >
          <path
            d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
          />
        </svg>
          </div>
          <div align='center' style={{width:'33%'}}><span style={{fontSize:'14px', letterSpacing: '.1rem'}}><b>FREE SHIPPING WITH A MINIMUM PURCHASE OF 250K**</b></span></div>
          <div align='center' style={{width:'33%'}}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight:'5px'}} width="16" height="16" fill="currentColor" className="bi bi-person-fill-down" viewBox="0 0 16 16">
  <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
</svg> <span onClick={handleShowRegister}>Register</span> 
<svg xmlns="http://www.w3.org/2000/svg" style={{marginRight:'5px', marginLeft:'10px'}} width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
  <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>
<span onClick={handleShowLogin}>Login</span></div>
      </div>
      <div className='container-fluid second_header_outside' style={{display:'flex', width:'100%'}}>           
           
<div className='container'>
<div>
      <h1>Consume Data</h1>
      <p>{data.testing}</p>
      <ul>
        {data.messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
          <nav className="navbar navbar-expand-lg" style={{width:'100%', color:'white'}} >
  <a className="navbar-brand" style={{color:'white', letterSpacing: '.1rem'}} href="#">Sunratu Shop</a>
  <div className="collapse navbar-collapse" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" href="#">Home</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Most Popular</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Shoes</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Shirts</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Bag</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Contact | Customer Service</a>
      </li>
    </ul>
  </div>
</nav>
</div>
      </div>
      <div className="slider">
    <div className="images">
    <img src={`${process.env.REACT_APP_API_URL}public/slider/slider_0.webp`} />
    <img src={`${process.env.REACT_APP_API_URL}public/slider/slider_1.webp`} />
<img src={`${process.env.REACT_APP_API_URL}public/slider/slider_2.webp`} />
<img src={`${process.env.REACT_APP_API_URL}public/slider/slider_3.webp`} />
    </div>
  </div>
    <div className="container">
      <div className="banner">
        <h2>Welcome to Sunratu Shop! </h2>
        <p style={{letterSpacing:'2px'}}>Find the perfect pair of what your looking for.</p>
        <div className="input-group mb-3">
          <input type="text" className="form-control custom-input form-control_search" placeholder="Type in your search keyword" aria-label="Type in your search keyword" aria-describedby="button-addon2" value={searchQuery}
            onChange={handleSearch}></input>
        </div>
      </div>

      <div className="featured-products">
      <div align='left'>
        <h3><b>The Most Shoes Popular </b></h3>
        <span>There are 156 kind of product</span>
        <hr></hr>
        <div className="product-list">
          {products.map((product, index) => (
            <div className="product" key={index} onClick={() => handleAddToCart(product)}>
              <img src={`${process.env.REACT_APP_API_URL}public/image_product/${product.imageName}`} alt={product.name} style={{ width: '100px', height: 'auto' }} />
              <hr />
              <h5>{product.name}</h5>
              <p className='price'>${product.price.toFixed(2)}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        <a href='' className=' link-underline link-underline-opacity-0' >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search-heart-fill" viewBox="0 0 16 16">
            <path d="M6.5 13a6.47 6.47 0 0 0 3.845-1.258h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1A6.47 6.47 0 0 0 13 6.5 6.5 6.5 0 0 0 6.5 0a6.5 6.5 0 1 0 0 13m0-8.518c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018"/>
          </svg>
          All SHoes Product
        </a>
        </div>
      </div>

      <div className="featured-products">
      <div align='right'>
        <h3><b>The Most Shirts Popular </b></h3>
        <span>There are 156 kind of product</span>
        <hr></hr>
        <div className="product-list">
          {products.map((product, index) => (
            <div className="product" key={index} onClick={() => handleAddToCart(product)}>
              <img src={`${process.env.REACT_APP_API_URL}public/image_product/${product.imageName}`} alt={product.name} style={{ width: '100px', height: 'auto' }} />
              <hr />
              <h5>{product.name}</h5>
              <p className='price'>${product.price.toFixed(2)}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        <a href='' className=' link-underline link-underline-opacity-0' >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search-heart-fill" viewBox="0 0 16 16">
            <path d="M6.5 13a6.47 6.47 0 0 0 3.845-1.258h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1A6.47 6.47 0 0 0 13 6.5 6.5 6.5 0 0 0 6.5 0a6.5 6.5 0 1 0 0 13m0-8.518c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018"/>
          </svg>
          All Shirts Product
        </a>
        </div>
      </div>

      <div className="featured-products">
        <div align='left'>
        <h3><b>The Most Bag Popular</b> </h3>
        <span>There are 156 kind of product</span>
        </div>
        <hr></hr>
        <div className="product-list">
          {products.map((product, index) => (
            <div className="product" key={index} onClick={() => handleAddToCart(product)}>
              <img src={`${process.env.REACT_APP_API_URL}public/image_product/${product.imageName}`} alt={product.name} style={{ width: '100px', height: 'auto' }} />
              <hr />
              <h5>{product.name}</h5>
              <p className='price'>${product.price.toFixed(2)}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        <a href='' className=' link-underline link-underline-opacity-0' >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search-heart-fill" viewBox="0 0 16 16">
            <path d="M6.5 13a6.47 6.47 0 0 0 3.845-1.258h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1A6.47 6.47 0 0 0 13 6.5 6.5 6.5 0 0 0 6.5 0a6.5 6.5 0 1 0 0 13m0-8.518c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018"/>
          </svg>
          All Bag Product
        </a>
      </div>
    </div>

    <div>
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Woohoo, you're reading the login modal!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogin}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseLogin}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRegister} onHide={handleCloseRegister} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='registration_main' style={{display:'flex'}}>
            <div className='regis_left' style={{marginRight:'20px'}}>
            <table className="table table-striped">
        <tbody>
          <tr>
            <td>Name</td>
            <td>:</td>
            <td>
              <input 
                                type="text" 
                                className="form-control" 
                                id="inputName" 
                                name="name" 
                                placeholder="Fullname"
                                value={formData.name} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Place & Date Birthday</td>
            <td>:</td>
            <td>
              <input 
                                type="text" 
                                className="form-control" 
                                id="inputPlace" 
                                name="place_birthday" 
                                placeholder="Place Birthday"
                                value={formData.place_birthday} required
                                onChange={handleChange}
                            />
              <input 
                                type="date" 
                                className="form-control" 
                                id="inputDate" 
                                name="date_birthday" 
                                placeholder="Place Birthday"
                                value={formData.date_birthday} required
                                onChange={handleChange}
                            />
                            </td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>:</td>
            <td>
            <div className="row">
                            <div className="col-sm-10" style={{display:'flex'}}>
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="gender" 
                                        id="gridRadios1" 
                                        value="Male"
                                        checked={formData.gender === 'Male'}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="gridRadios1">
                                        Male
                                    </label>
                                </div>
                                <div className="form-check" style={{marginLeft:'10px'}}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="gender" 
                                        id="gridRadios2" 
                                        value="Female"
                                        checked={formData.gender === 'Female'}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="gridRadios2">
                                        Female
                                    </label>
                                </div>
                            </div>
                        </div>
            </td>
          </tr>
          <tr>
            <td>Address / Dusun</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputAddress" 
                                name="address" 
                                placeholder="Address"
                                value={formData.address} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Village</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputVillage" 
                                name="village" 
                                placeholder="Vilage"
                                value={formData.village} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Post Code</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputPostCode" 
                                name="postcode" 
                                placeholder="Post Code"
                                value={formData.postcode} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Distric</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputDistric" 
                                name="distric" 
                                placeholder="Distric"
                                value={formData.distric} required
                                onChange={handleChange}
                            /></td>
          </tr>
          </tbody>
        </table>
            </div>
            <div className='regis_right'>
            <table className="table table-striped">
        <tbody>
          <tr>
            <td>Regency</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputRegency" 
                                name="regency" 
                                placeholder="Regency"
                                value={formData.regency} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Prov.</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputProv" 
                                name="province" 
                                placeholder="Province"
                                value={formData.province} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Country.</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputCountry" 
                                name="country" 
                                placeholder="Country"
                                value={formData.country} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Phone Number.</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputNumber" 
                                name="phone" 
                                placeholder="Phone Number"
                                value={formData.phone} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Email.</td>
            <td>:</td>
            <td><input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                name="email" 
                                placeholder="email"
                                value={formData.email} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Username</td>
            <td>:</td>
            <td><input 
                                type="text" 
                                className="form-control" 
                                id="inputUsername" 
                                name="username" 
                                placeholder="username"
                                value={formData.username} required
                                onChange={handleChange}
                            /></td>
          </tr>
          <tr>
            <td>Password</td>
            <td>:</td>
            <td><input 
                                type="password" 
                                className="form-control" 
                                id="inputPassword" 
                                name="password" 
                                placeholder="password"
                                value={formData.password} required
                                onChange={handleChange}
                            /></td>
          </tr>
          </tbody>
        </table>
            </div>
          </div>
       

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRegister}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseRegister}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    </div>
  );
}

export default Outside;
