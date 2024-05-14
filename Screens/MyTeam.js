//MyTeam.js

// Importing components and libraries from React and React Native
import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Modal, Button, Image } from 'react-native';

// Importing custom hook to get selected players from HomeScreen
import { useSelectedPlayers } from '../Screens/HomeScreen';

// MyTeam component
const MyTeam = () => {
  // Get selected players using custom hook
  const { selectedPlayers, removePlayer, clearSelectedPlayers } = useSelectedPlayers();

  // State to control the visibility of the congratulatory popup
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle "Create Team" button press
  const handleCreateTeam = () => {
    setShowPopup(true);
  };

  // Function to handle "Okay" button press in the popup
  const handleOkayButton = () => {
    setShowPopup(false);

    // Clear selected players when Okay is clicked
    clearSelectedPlayers();
  };

  // Function to Remove Player from team
  const handleRemovePlayer = (playerId) => {
    removePlayer(playerId);
  };

  // JS structure for MyTeam component
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../Background.jpg')} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {selectedPlayers.length > 0 && <Text style={styles.title}>My Team 🏆</Text>}

          {selectedPlayers.length === 0 ? (
            <Text style={styles.noPlayerText}>No Players in Team 😕</Text>
          ) : (
            selectedPlayers.map((item) => (
              <View key={item.player_id} style={styles.playerCard}>
                <Image source={{ uri: item.player_photo }} style={styles.playerImage} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{item.player_name}</Text>
                  <Text>Position: {item.position}</Text>
                  <Text>International Team: {item.nationality}</Text>
                  <Text>Club: {item.team}</Text>
                  {/* Button to remove a player */}
                  <TouchableOpacity onPress={() => handleRemovePlayer(item.player_id)}>
                    <Text style={styles.removePlayerButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {selectedPlayers.length > 0 && (
            <TouchableOpacity style={styles.createTeamButton} onPress={handleCreateTeam}>
              <Text style={styles.createTeamButtonText}>Create Team</Text>
            </TouchableOpacity>
          )}

          {/* Semi-transparent overlay when the modal is visible */}
          {showPopup && <View style={styles.overlay} />}

          {/* Popup Modal for team creation confirmation */}
          <Modal visible={showPopup} animationType="slide" transparent={true}>
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>Congratulations Skipper!</Text>
              <Text style={styles.popupText}>Dream Team Created! 💪🏼</Text>
              <Button title="Okay! 😎" onPress={handleOkayButton} />
            </View>
          </Modal>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

// CSS for MyTeam component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
    color: 'white',
  },
  noPlayerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 300,
    height: 150,
    padding: 5,
    borderRadius: 10,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 5,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  removePlayerButton: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  createTeamButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  createTeamButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default MyTeam;
