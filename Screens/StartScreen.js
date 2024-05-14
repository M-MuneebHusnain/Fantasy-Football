//StartScreen.js

// Importing components and libraries from React and React Native
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppLogo from '../Logo.png';
import { useNavigation } from '@react-navigation/native';

// StartScreen functional components
const StartScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [showComponents, setShowComponents] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

// useEffect hook to handle component lifecycle events
  useEffect(() => {
    // Display the logo immediately
    setShowComponents(false);

    // Delay rendering of other components by 2 seconds
    const delay = setTimeout(() => {
      setShowComponents(true);
    }, 2000);

    // Clearing timeout to prevent memory leak
    return () => clearTimeout(delay);
  }, []);

  // Function to handle team building
  const handleBuildTeam = () => {
    if (userName.trim() !== '') {
      // Navigate to HomeScreen with entered username
      navigation.navigate('TabNavigator', { screen: 'HomeScreen', params: { UserName: userName } });
    } else {
      // Sets error message if username is empty
      setErrorMessage('Please enter your name');
    }
  };
  
   // JS structure for StartScreen component
  return (
    <View style={styles.container}>
      <Image source={AppLogo} style={styles.logo} />
      {showComponents && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              // Clearing error message when user starts typing
              setErrorMessage('');
            }}
          />
          <TouchableOpacity
            style={[styles.roundedButton, styles.buildTeamButton]}
            onPress={handleBuildTeam}
          >
            <Text style={styles.buttonText}>Build Your Dream Football Team</Text>
          </TouchableOpacity>
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
        </>
      )}
    </View>
  );
};

// CSS for StartScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  logo: {
    width: 128,
    height: 111,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  roundedButton: {
    borderRadius: 17,
    overflow: 'hidden',
  },
  buildTeamButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

// Exporting StartScreen as default export
export default StartScreen;
