//HomeScreen.js

// Importing components and libraries from React and React Native
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Picker } from '@react-native-picker/picker';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { View, Text, Image, TextInput, Button, StyleSheet, FlatList, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Creating context for managing selected players
const SelectedPlayersContext = createContext();

// Provider component for selected players context
export const SelectedPlayersProvider = ({ children }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // Function to add a player to the selected players list / My Team
  const addPlayer = (player) => {
    setSelectedPlayers((prevSelectedPlayers) => [...prevSelectedPlayers, player]);
  };

  // Function to remove a player from the selected players list / My Team
  const removePlayer = (playerId) => {
    const updatedPlayers = selectedPlayers.filter((player) => player.player_id !== playerId);
    setSelectedPlayers(updatedPlayers);
  };

  // Function to clear all selected players
  const clearSelectedPlayers = () => {
    setSelectedPlayers([]);
  };

  return (
    <SelectedPlayersContext.Provider value={{ selectedPlayers, addPlayer, removePlayer, clearSelectedPlayers }}>
      {children}
    </SelectedPlayersContext.Provider>
  );
};

// Custom hook to access selected players context
export const useSelectedPlayers = () => {
  const context = useContext(SelectedPlayersContext);
  if (!context) {
    throw new Error('useSelectedPlayers must be used within a SelectedPlayersProvider');
  }
  return context;
};

// HomeScreen component
const HomeScreen = ({ route, navigation }) => {
  // Custom hook to access the selected players context
  const { selectedPlayers, addPlayer } = useSelectedPlayers();

  // Destructure parameters from the route
  const { UserName } = route.params || {};

  // State variables
  const [topScorers, setTopScorers] = useState([]);
  const [isLoadingTopScorers, setIsLoadingTopScorers] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [showTopScorerText, setShowTopScorerText] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // Sort Option Labels
  const sortOptions = [
    { label: 'Goals (High-Low) Default', value: 'goalsDesc' },
    { label: 'Goals (Low-High)', value: 'goalsAsc' },
    { label: 'Name (A-Z)', value: 'nameAsc' },
    { label: 'Name (Z-A)', value: 'nameDesc' },
    { label: 'Country (A-Z)', value: 'countryAsc' },
    { label: 'Country (Z-A)', value: 'countryDesc' },
  ];

  // API for Search
  const searchPlayers = async () => {
    if (!searchInput.trim()) {
      setError('Please enter player name');
      return;
    }

    setIsLoadingSearch(true);
    setError(null);

    const searchOptions = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/players/',
      params: { league: '39', search: searchInput },
      headers: {
        'X-RapidAPI-Key': '4c3817c1f6mshf047a241e66c5a2p1b7a77jsnad498db5b86d',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    };

    try {
      const searchResponse = await axios.request(searchOptions);
      const playerData = searchResponse.data.response.map((player) => ({
        player_id: player.player.id,
        player_name: `${player.player.firstname} ${player.player.lastname}`,
        position: player.statistics[0].games.position,
        team: player.statistics[0].team.name,
        nationality: player.player.nationality,
        player_photo: player.player.photo,
        age: player.player.age,
        showMore: false, // Property for "See More" functionality
        height: player.player.height,
        weight: player.player.weight,
        injured: player.player.injured,
        fouls: player.statistics[0].fouls.total,
        goals: player.statistics[0].goals.total,
        assists: player.statistics[0].goals.assists,
        rating: player.statistics[0].games.rating,
      }));

      setSearchResults(playerData);
      setShowTopScorerText(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Function to handle search input changes
  const handleSearchInputChange = (text) => {
    setSearchInput(text);
    setSearchResults([]);
    setShowTopScorerText(true);
  };

  // Function to toggle "See More" state for a player in search results
  const toggleMoreDetails = (player) => {
    const updatedResults = searchResults.map((p) =>
      p.player_id === player.player_id ? { ...p, showMore: !p.showMore } : p
    );
    setSearchResults(updatedResults);
  };

  // API for TopScorer
  const fetchTopScorers = async () => {
    setIsLoadingTopScorers(true);
    setError(null);

    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers',
      params: { league: '39', season: '2023' },
      headers: {
        'X-RapidAPI-Key': '4c3817c1f6mshf047a241e66c5a2p1b7a77jsnad498db5b86d',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const modifiedTopScorers = response.data.response.map((scorer) => ({
        player_id: scorer.player.id,
        player_name: `${scorer.player.firstname} ${scorer.player.lastname}`,
        position: scorer.statistics[0].games.position,
        team: scorer.statistics[0].team.name,
        nationality: scorer.player.nationality,
        player_photo: scorer.player.photo,
        goals: scorer.statistics[0].goals.total,
        assists: scorer.statistics[0].goals.assists,
        rating: scorer.statistics[0].games.rating,
      }));

      setTopScorers(modifiedTopScorers);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoadingTopScorers(false);
    }
  };

  useEffect(() => {
    fetchTopScorers();
  }, []);

  // Function to handle player addition to team
  const addToTeam = (player) => {
    // Check if player is in team
    if (!selectedPlayers.some((selectedPlayer) => selectedPlayer.player_id === player.player_id)) {
      // Add player to team & show success message 
      addPlayer(player);
      showMessage({
        message: 'Player added to team ✅',
        type: 'success',
        position: 'bottom',
      });
    }
    // Navigate to MyTeam
    navigation.navigate('MyTeam');
  };

  useEffect(() => {
    console.log("Selected Players:", selectedPlayers);
  }, [selectedPlayers]);

  // Function to apply Sort
  const applyFilter = () => {
    const sortedPlayers = sortPlayers(topScorers);
    setTopScorers(sortedPlayers);
  };

  // Sort players and update state 
  const sortPlayers = (players) => {
    if (sortBy === 'random') {
      return players;
    }

    // Sort Conditions
    const compareFunction = (a, b) => {
      if (sortBy === 'nameAsc') {
        return a.player_name.localeCompare(b.player_name);
      } else if (sortBy === 'nameDesc') {
        return b.player_name.localeCompare(a.player_name);
      } else if (sortBy === 'countryAsc') {
        return a.nationality.localeCompare(b.nationality);
      } else if (sortBy === 'countryDesc') {
        return b.nationality.localeCompare(a.nationality);
      } else if (sortBy === 'goalsAsc') {
        return a.goals - b.goals;
      } else if (sortBy === 'goalsDesc') {
        return b.goals - a.goals;
      }

      return 0;
    };

    // Return new array of sorted players based on compare function
    return [...players].sort(compareFunction);
  };

  // JS Structure for HomeScreen component and subcomponents for Top Scorers & Search
  return (
  <ImageBackground source={require('../Background.jpg')} style={styles.container}>
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {UserName}</Text>
        <View>
          <Image source={require('../Logo.png')} style={styles.logo} />
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a player"
          value={searchInput}
          onChangeText={handleSearchInputChange}
        />
        <Button title="Search" onPress={searchPlayers} />
      </View>

      <View style={styles.errorContainer}>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort By:</Text>
        <Picker
          style={styles.sortPicker}
          selectedValue={sortBy}
          onValueChange={(itemValue) => setSortBy(itemValue)}
        >
          {sortOptions.map((option, index) => (
            <Picker.Item key={index} label={option.label} value={option.value} />
          ))}
        </Picker>
        <Button title="Apply" onPress={applyFilter} />
      </View>

      {isLoadingTopScorers || isLoadingSearch ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {showTopScorerText || searchResults.length === 0 && !error && (
            <Text style={styles.noResultsText}>No results found.</Text>
          )}

          {showTopScorerText && topScorers.length > 0 && (
            <>
              {showTopScorerText && !isLoadingTopScorers && !isLoadingSearch && !error && (
                <Text style={styles.topScorerTitle}>English Premier League Top Scorers</Text>
              )}
              <FlatList
                data={topScorers}
                keyExtractor={(item) => item.player_id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.playerCard}>
                    <Image source={{ uri: item.player_photo }} style={styles.playerPhoto} />
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{item.player_name}</Text>
                      <Text>Position: {item.position}</Text>
                      <Text>International Team: {item.nationality}</Text>
                      <Text>Club: {item.team}</Text>
                      <Text>Goals: {item.goals}</Text>
                      <Text>Assists: {item.assists}</Text>
                      <Text>Rating: {item.rating}</Text>
                      {/* Conditionally render the "Added to Team" text or "Add to Team" button */}
                      {selectedPlayers.some((selectedPlayer) => selectedPlayer.player_id === item.player_id) ? (
                        <Text style={styles.addToTeamButton}>Added to Team ✅</Text>
                      ) : (
                        <TouchableOpacity onPress={() => addToTeam(item)}>
                          <Text style={styles.addToTeamButton}>Add to Team</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              />
            </>
          )}

          {!showTopScorerText && searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.player_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.playerCard}>
                  {/* Display the first five details initially */}
                  <Image source={{ uri: item.player_photo }} style={styles.playerPhoto} />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{item.player_name}</Text>
                    <Text>Position: {item.position}</Text>
                    <Text>International Team: {item.nationality}</Text>
                    <Text>Club: {item.team}</Text>
                    <Text>Age: {item.age}</Text>
                    {/* "See More" button to show more details */}
                    <TouchableOpacity onPress={() => !item.showMore && toggleMoreDetails(item)}  disabled={item.showMore} >
                      <Text style={styles.seeButton}>
                        {item.showMore ? '' : 'See More'}
                      </Text>
                    </TouchableOpacity>
                    {/* Additional details shown when "See More" is clicked */}
                    {item.showMore && (
                      <>
                        <Text>Height: {item.height}</Text>
                        <Text>Weight: {item.weight}</Text>
                        <Text>Injured: {item.injured ? 'Yes' : 'No'}</Text>
                        <Text>Fouls: {item.fouls}</Text>
                        {/* Display goals and assists only if position is not goalkeeper */}
                        {item.position !== 'Goalkeeper' && (
                          <>
                            <Text>Goals: {item.goals}</Text>
                            <Text>Assists: {item.assists}</Text>
                          </>
                        )}
                        <Text>Rating: {item.rating}</Text>
                        {/* Display "See Less" button at the end before "Add to Team" */}
                        <TouchableOpacity onPress={() => toggleMoreDetails(item)}>
                         <Text style={styles.seeButton}>See Less</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {/* Conditionally render the "Added to Team" text or "Add to Team" button */}
                    {selectedPlayers.some((selectedPlayer) => selectedPlayer.player_id === item.player_id) ? (
                      <Text style={styles.addToTeamButton}>Added to Team ✅</Text>
                    ) : (
                      <TouchableOpacity onPress={() => addToTeam(item)}>
                        <Text style={styles.addToTeamButton}>Add to Team</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}
      </ScrollView>
    {/* FlashMessage for displaying messages at the bottom */}
    <FlashMessage position="bottom" />
  </ImageBackground>
);

};

// CSS for HomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  topScorerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 5,
  },
  sortLabel: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  sortPicker: {
    color: 'black',
    height: 30,
    flex: 1,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  playerPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    resizeMode: 'cover',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addToTeamButton: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  seeButton: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  noResultsText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});

// Exporting HomeScreen as the default export
export default HomeScreen;
