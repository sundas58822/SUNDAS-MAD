import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // sab screens ke liye common container
  container: {
    flex: 1,
    padding: 20,
  },
  
  // light mode background
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  
  // dark mode background
  darkContainer: {
    backgroundColor: '#333',
  },
  
  // title style
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  
  lightTitle: {
    color: '#333',
  },
  
  darkTitle: {
    color: '#fff',
  },
  
  // button style - sab buttons same dikhenge
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // input style
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    fontSize: 16,
    width: '100%',
  },
  
  // card style - white box
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // row style - icon aur input ek line mein
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  
  icon: {
    marginRight: 10,
  },
  
  // profile image style
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  // style.js mein title style update karo
title: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 30,
  textAlign: 'center',
  // fontFamily: 'Poppins-Bold',  // yahan nahi karna, kyunki font load ho nahi sakta yahan
},
});