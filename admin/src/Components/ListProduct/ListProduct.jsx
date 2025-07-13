import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png'


const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', old_price: '', new_price: '', category: '', image: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts') // Fixed the URL
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((error) => console.error('Error fetching products:', error)); // Added error handling
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }

  const handleUpdate = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      category: product.category,
      image: product.image
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;

    // If a new file is selected, upload it first
    if (selectedFile) {
      const formDataImg = new FormData();
      formDataImg.append('product', selectedFile);

      const imgRes = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formDataImg,
      });
      const imgData = await imgRes.json();
      if (imgData.success) {
        imageUrl = imgData.image_url;
      }
    }

    await fetch('http://localhost:4000/updateproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editProduct.id, ...formData, image: imageUrl })
    });
    setShowModal(false);
    setEditProduct(null);
    setSelectedFile(null);
    await fetchInfo();
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return <>
            <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt="" className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}}className='listproduct-remove-icon'src={cross_icon} alt="" />
            <button className="listproduct-update-btn" onClick={() => handleUpdate(product)}>Update</button>
          </div>
          <hr />
          </>
        })}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
              <label>Name: <input name="name" value={formData.name} onChange={handleChange} /></label><br />
              <label>Old Price: <input name="old_price" value={formData.old_price} onChange={handleChange} /></label><br />
              <label>New Price: <input name="new_price" value={formData.new_price} onChange={handleChange} /></label><br />
              <label htmlFor="category">Category:</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
              <br />
              <label>
                Image Upload: <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
              {formData.image && !selectedFile && (
                <div>
                  <img src={formData.image} alt="Current" style={{ width: 80, marginTop: 8 }} />
                </div>
              )}
              <br />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;
