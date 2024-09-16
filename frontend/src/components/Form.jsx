import React from 'react'
import { useState } from 'react'

const emotions = [
  'Happy',
  'Sad',
  'Angry',
  'Surprised',
  'Fearful',
  'Disgusted',
  'Neutral'
]

const genres = [
  'Action',
  'Adventure',
  'Comedy',
  'Family',
  'Fantacy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Drama',
  'Crime',
  'Historical'
  
]

export const Form = () => {
  const [selectedGenres, setSelectedGenres] = useState(
    emotions.reduce((acc, emotion) => {
      acc[emotion] = '';
      return acc;
    }, {})
  )

  const handleGenreChange = (emotion, genre) => {
    setSelectedGenres((prev) => ({
      ...prev,
      [emotion]: genre,
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const preferences = Object.entries(selectedGenres).map(([emotion, genre]) => ({
      emotion,
      genre,
    }));

    try {
      const response = await fetch('http://localhost:8000/emotion-preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
      });

      if (response.ok) {
        alert('Preferences saved successfully!');
      } else {
        console.error('Failed to save preferences.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Choose Your Movie Preferences Based on Your Emotions</h2>
      {emotions.map((emotion) => (
        <div key={emotion} style={{ marginBottom: '15px' }}>
          <label htmlFor={emotion} style={{ display: 'block', marginBottom: '5px' }}>
            When you are {emotion.toLowerCase()}, what kind of movie do you prefer?
          </label>
          <select
            id={emotion}
            value={selectedGenres[emotion]}
            onChange={(e) => handleGenreChange(emotion, e.target.value)}
            required
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  )
}
