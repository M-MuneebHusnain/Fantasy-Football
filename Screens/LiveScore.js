//LiveScore.js

// Importing components and libraries from React and React Native
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';

// LiveMatches functional component
const LiveScore = () => {
  // State variables to manage live Match data
  const [fixtures, setFixtures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch live matches on component mount
  useEffect(() => {
    // Function to fetch live mactches using API
    const fetchLiveFixtures = async () => {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&timezone=Europe/london',
        headers: {
          'X-RapidAPI-Key': '4c3817c1f6mshf047a241e66c5a2p1b7a77jsnad498db5b86d',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
      };

      try {
        // Make the API request
        const response = await axios.request(options);
        setFixtures(response.data.response);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Call function to fetch live macthes
    fetchLiveFixtures();
  }, []);

  // JS structure for LiveScore component
return (
  <ImageBackground
    source={require('../Background.jpg')}
    style={styles.backgroundImage}
  >
    <ScrollView>
      <View style={styles.container}>
        {/* Conditionally render the title */}
        {fixtures.length > 0 && (
          <Text style={styles.title}>Current Live Games ⚽</Text>
        )}

        {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
        {!isLoading && !error && fixtures.length === 0 && (
          <Text style={styles.noMatchesText}>No Live Matches Found.</Text>
        )}
        {fixtures.length > 0 && (
          <View>
            {fixtures.map((fixture) => (
              <View key={fixture.fixture.id} style={styles.matchCard}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{fixture.teams.home.name}</Text> {fixture.goals.home} -{' '}
                  {fixture.goals.away} <Text style={{ fontWeight: 'bold' }}>{fixture.teams.away.name}</Text>
                </Text>
                <Text>Time: {fixture.fixture.date}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  </ImageBackground>
);
};

// CSS for LiveScore component
const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
    color: 'white',
  },
  matchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  noMatchesText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    marginTop: 77,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 66,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 95,
  },
});

// Exporting LiveFixtures as the default export
export default LiveScore;
