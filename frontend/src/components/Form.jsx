import React, { useState } from 'react';
import { validateToken } from './ProtectedRoute';
import { ACCESS_TOKENS } from '../constants';
import { useNavigate } from 'react-router-dom';

const emotions = [
  'Happy',
  'Sad',
  'Angry',
  'Surprised',
  'Fearful',
  'Disgusted',
  'Neutral',
];

const genres = [
  'Action', 'Adventure', 'Comedy', 'Family', 'Fantasy',
  'Horror', 'Romance', 'Sci-Fi', 'Thriller',
  'Animation', 'Drama', 'Crime', 'Historical', 'Others',
];

export const Form = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState(
    emotions.reduce((acc, emotion) => {
      acc[emotion] = { genres: [], other: '' };
      return acc;
    }, {})
  );

  const handleGenreChange = (emotion, genre) => {
    setSelectedGenres((prev) => {
      const isSelected = prev[emotion].genres.includes(genre);
      const updatedGenres = isSelected
        ? prev[emotion].genres.filter((g) => g !== genre)
        : [...prev[emotion].genres, genre];

      return {
        ...prev,
        [emotion]: {
          ...prev[emotion],
          genres: updatedGenres,
          other: genre === 'Others' && !isSelected ? '' : prev[emotion].other,
        },
      };
    });
  };

  const handleOtherGenreChange = (emotion, value) => {
    setSelectedGenres((prev) => ({
      ...prev,
      [emotion]: { ...prev[emotion], other: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const isValidToken = await validateToken();

    if (!isValidToken) {
      alert('Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }

    const preferences = Object.entries(selectedGenres).map(([emotion, { genres, other }]) => ({
      emotion,
      genres: genres.includes('Others') ? [...genres.filter((g) => g !== 'Others'), other] : genres,
    }));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/emotion-preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKENS)}`,
        },
        body: JSON.stringify({ preferences: preferences, user }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save preferences:', errorData);
        alert('Failed to save preferences. Check the console for more details.');
      } else {
        alert('Preferences saved successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving preferences.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Choose Your Movie Preferences Based on Your Emotions</h2>
      {emotions.map((emotion) => (
        <div key={emotion} style={{ marginBottom: '20px' }}>
          {/* Emotion label */}
          <label
            style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}
          >
            When you are feeling <span style={{ textTransform: 'capitalize' }}>{emotion.toLowerCase()}</span>, what kind of movies do you prefer?
          </label>

          {/* Scrollable genre list */}
          <div
            style={{
              maxHeight: '150px', // Set fixed height for the scroll container
              overflowY: 'scroll', // Enable vertical scrolling
              border: '1px solid #ccc',
              padding: '10px',
              width: '300px', // Set fixed width for uniformity
            }}
          >
            {genres.map((genre) => (
              <div
                key={`${emotion}-${genre}`}
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  type="checkbox"
                  id={`${emotion}-${genre}`}
                  checked={selectedGenres[emotion].genres.includes(genre)}
                  onChange={() => handleGenreChange(emotion, genre)}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={`${emotion}-${genre}`}>{genre}</label>
              </div>
            ))}
          </div>

          {/* Other genre input */}
          {selectedGenres[emotion].genres.includes('Others') && (
            <input
              type="text"
              placeholder="Enter your preferred genre"
              value={selectedGenres[emotion].other}
              onChange={(e) => handleOtherGenreChange(emotion, e.target.value)}
              style={{
                marginTop: '10px',
                display: 'block',
                width: '100%',
              }}
              required
            />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
