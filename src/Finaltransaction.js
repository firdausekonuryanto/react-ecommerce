// src/Header.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert'; // Import the Alert component
import './Finaltransaction.css';
import QRCode from 'qrcode.react';

function Finaltransaction() {
  const qrValue = '12345EF23RG'; 
  const [cartProducts, setCartProducts] = useState(JSON.parse(localStorage.getItem('cartProducts')) || []); // Load from localStorage
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    cartProducts.forEach(product => {
      total += product.price * (product.quantity || 1);
    });
    return total.toFixed(2);
  };

  const saveTransaction = async () => {
    setAlertMessage("Product added to cart!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    const transactionData = {
      cartProducts,
      total: calculateTotal(),
      personalInfo: {
        name: 'Firdaus Eko Nuryanto',
        gender: 'Male',
        address: 'Dsn. Sidomulyo RT/RW. 002/001',
        village: 'Gitik',
        postCode: '68462',
        district: 'Rogojampi',
        regency: 'Banyuwangi',
        province: 'Jawa Timur',
        country: 'Indonesia',
        phoneNumber: '0853 3832 1400'
      },
      paymentCode: qrValue
    };

    try {
      const response = await axios.post('http://localhost:5000/api/transaction', transactionData);
      setCartProducts([]);
      localStorage.removeItem('cartProducts'); // Remove cart data from local storage
      navigate('/'); // Redirect to checkout page
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <div className='final_transaction'>
      <Alert message={"Transaksi Tersimpan, Segera Lakukan Pembayaran !!!"} show={showAlert} onClose={() => setShowAlert(false)} />
      <h3>Final Transaction</h3>
      <hr></hr>

      <div className='parent_final_transaction' style={{ display: 'flex', width:'100%' }}>
      <div className='kiri' style={{width:'40%'}}>
      <div className='kode_pembayaran' align='center'>
        <span style={{ fontSize: '20px' }}>Kode Pembayaran</span><br />
        <span style={{ fontSize: '36px' }}><b>12345EF23RG</b></span>
      </div>

      <div align='center' style={{ marginTop: '30px' }}>
      <span style={{ fontSize: '20px' }}>Batas Waktu Pemabayaran</span> <br></br>
      <span style={{ fontSize: '12px', color:'red' }}>19 May 2024 Pukul 22:08:44 WB</span> <br></br>
      <span style={{ fontSize: '32px' }}><b>01:05:23</b></span> <br></br>
      </div>

      <div align='center' style={{ marginTop: '30px' }}>
        Segera lakukan pembayaran sebelum batas <br></br>
        waktu pembayaran habis.anda dapat <br></br>
        mengikuti langkah berikut<br></br>
      </div>

      <div align='center' style={{ marginTop: '30px' }}>
        <QRCode value={qrValue} size={106} /> {/* Adjust size as needed */}<br></br><br></br><br></br>
        <button className='btn btn-success' onClick={saveTransaction} >Checkout Now</button>
      </div>

      </div>
      <div className='kanan' style={{width:'60%'}}>
        <h4>Your order list bellow . . .</h4>
        <table width={'100%'}>
                <thead>
                  <tr style={{ backgroundColor: 'gold', fontWeight: 'bold' }}>
                    <td>No</td>
                    <td>Img</td>
                    <td>Name</td>
                    <td>Price</td>
                    <td>Qty</td>
                    <td>Sub Total</td>
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
                          value={product.quantity || 1}
                        />
                      </td>
                      <td>${(product.price * (product.quantity || 1)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tr style={{backgroundColor:'orange'}}>
                  <td colSpan={5} align='center'><b>TOTAL</b></td>
                  <td colSpan={2}><b>${calculateTotal()}</b></td>
                </tr>
        </table>

        <br></br><h4>Personal Identity . . .</h4>
        <table className="table table-striped">
        <tbody>
          <tr>
            <td>Name</td>
            <td>:</td>
            <td>Firdaus Eko Nuryanto</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>:</td>
            <td>Male</td>
          </tr>
          <tr>
            <td>Address / Dusun</td>
            <td>:</td>
            <td>Dsn. Sidomulyo RT/RW. 002/001</td>
          </tr>
          <tr>
            <td>Village</td>
            <td>:</td>
            <td>Gitik</td>
          </tr>
          <tr>
            <td>Post Code</td>
            <td>:</td>
            <td>68462</td>
          </tr>
          <tr>
            <td>Distric</td>
            <td>:</td>
            <td>Rogojampi</td>
          </tr>
          <tr>
            <td>Regency</td>
            <td>:</td>
            <td>Banyuwangi</td>
          </tr>
          <tr>
            <td>Prov.</td>
            <td>:</td>
            <td>Jawa Timur</td>
          </tr>
          <tr>
            <td>Country.</td>
            <td>:</td>
            <td>Indonesia</td>
          </tr>
          <tr>
            <td>Phone Number.</td>
            <td>:</td>
            <td>0853 3832 1400</td>
          </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default Finaltransaction;
