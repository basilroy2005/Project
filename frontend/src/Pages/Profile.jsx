import React, { useEffect, useState } from 'react';
import './CSS/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
    email: '',
    username: '',
    phonenumber: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    additionalFeatures: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const res = await fetch('http://localhost:4000/getprofile', {
          method: 'GET',
          headers: {
            'auth-token': token,
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setForm({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            profilePicture: data.user.profilePicture || '',
            email: data.user.email || '',
            username: data.user.username || '',
            phonenumber: data.user.phonenumber || '',
            dateOfBirth: data.user.dateOfBirth || '',
            gender: data.user.gender || '',
            city: data.user.city || '',
            additionalFeatures: data.user.additionalFeatures || '',
          });
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No profile data found.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profilePicture: user.profilePicture || '',
      email: user.email || '',
      username: user.username || '',
      phonenumber: user.phonenumber || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      city: user.city || '',
      additionalFeatures: user.additionalFeatures || '',
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch('http://localhost:4000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setEditMode(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile');
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('product', file);
    try {
      const res = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success === 1 && data.image_url) {
        setForm((prev) => ({ ...prev, profilePicture: data.image_url }));
      }
    } catch (err) {
      setError('Error uploading profile picture');
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-picture-section">
        {(editMode ? form.profilePicture : user.profilePicture) && (
          <img
            src={editMode ? form.profilePicture : user.profilePicture}
            alt="Profile"
            className="profile-picture-preview"
          />
        )}
        {editMode && (
          <div className="profile-picture-upload">
            <input type="file" accept="image/*" onChange={handleProfilePicUpload} />
          </div>
        )}
      </div>
      {editMode ? (
        <div className="profile-fields">
          <label>First Name:<br /><input type="text" name="firstName" value={form.firstName} onChange={handleChange} /></label>
          <label>Last Name:<br /><input type="text" name="lastName" value={form.lastName} onChange={handleChange} /></label>
          <label>Email Address:<br /><input type="email" name="email" value={form.email} onChange={handleChange} disabled /></label>
          <label>Username:<br /><input type="text" name="username" value={form.username} onChange={handleChange} /></label>
          <label>Phone Number:<br /><input type="text" name="phonenumber" value={form.phonenumber} onChange={handleChange} /></label>
          <label>Date of Birth:<br /><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} /></label>
          <label>Gender:<br />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>City:<br /><input type="text" name="city" value={form.city} onChange={handleChange} /></label>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="profile-fields">
          <p><b>First Name:</b> {user.firstName}</p>
          <p><b>Last Name:</b> {user.lastName}</p>
          <p><b>Email Address:</b> {user.email}</p>
          <p><b>Username:</b> {user.username}</p>
          <p><b>Phone Number:</b> {user.phonenumber}</p>
          <p><b>Date of Birth:</b> {user.dateOfBirth}</p>
          <p><b>Gender:</b> {user.gender}</p>
          <p><b>City:</b> {user.city}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;