import React, { useState, useEffect } from 'react';
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
  'Neutral'
];

const genres = [
  'Action',
  'Adventure',
  'Comedy',
  'Family',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',  
  'Animation',
  'Drama',
  'Crime',
  'Historical',
  'Others'
];

export const Form = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const token = localStorage.getItem(ACCESS_TOKENS);
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
    console.log(preferences);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/emotion-preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
    <form onSubmit={handleSubmit} >
      <h2>Choose Your Movie Preferences Based on Your Emotions</h2>
      <div style={{ maxHeight: '400px'}}>
      {emotions.map((emotion, i) => (
        <div key={i} style={{ marginBottom: '30px', padding: '10px', overflow: 'hidden' }}>
          <label>
            When you are feeling <span style={{ textTransform: 'capitalize' }}>{emotion}</span>, what kind of movies do you prefer?
          </label>
          <div
                style={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        padding: '10px',
                        boxSizing: 'border-box',
                }}
            >
              {genres.map((genre) => (
                <div key={`${i}-${genre}`}
                  style={{
                    display: 'flex',
                    alignItems: 'left',
                    gap: '20px',
                    marginBottom: '10px',
                  }}
                >
                  
                  <input
                    type="checkbox"
                    id={`${i}-${genre}`}
                    checked={selectedGenres[emotion]?.genres.includes(genre) || false}
                    onChange={() => handleGenreChange(emotion, genre)}
                    style={{
                      width: '16px',
                      height: '16px',
                      alignContent: 'left',
                    }}
                  />
                  <label htmlFor={`${i}-${genre}`} style={{ whiteSpace: 'discard-before' }}>{genre}</label>
                </div>
              ))}
          </div>
          {selectedGenres[emotion]?.genres.includes('Others') && (
            <input
              type="text"
              placeholder="Enter your preferred genre"
              value={selectedGenres[emotion]?.other || ''}
              onChange={(e) => handleOtherGenreChange(emotion, e.target.value)}
              required
            />
          )}
      </div>
))}

        <button type="submit">Submit</button>
        </div>
    </form>
  );
};

