/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import Buyer from './Buyer';
import Rate from './Rate';
import DetailsScreen from './DetailsScreen';
import Messages from './Messages';
import Selling from './Selling';
import Update from './Update';
import UploadScreen from './UploadScreen';
import Conversation from './Conversation';
import Rating from './Rating';
import SellerMessages from './SellerMessages';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
  SplashScreen: {screen: SplashScreen,navigationOptions:{headerShown:false}},
  LoginScreen: {screen: LoginScreen,navigationOptions:{headerShown:false}},
  SignUpScreen: {screen: SignUpScreen,navigationOptions:{headerShown:false}},
  HomeScreen: {screen: HomeScreen,navigationOptions:{headerShown:false}},
  DetailsScreen: {screen: DetailsScreen,navigationOptions:{headerShown:false}},
  Messages: {screen: Messages,navigationOptions:{headerShown:false}},
  Buyer: {screen: Buyer,navigationOptions:{headerShown:false}},
  Rate: {screen: Rate,navigationOptions:{headerShown:false}}, 
  Update: {screen: Update,navigationOptions:{headerShown:false}},
  Selling: {screen: Selling,navigationOptions:{headerShown:false}},
  UploadScreen: {screen: UploadScreen,navigationOptions:{headerShown:false}},
  SellerMessages: {screen: SellerMessages,navigationOptions:{headerShown:false}},
  Conversation: {screen: Conversation,navigationOptions:{headerShown:false}},
  Rating: {screen: Rating,navigationOptions:{headerShown:false}},
});


const App = createAppContainer(AppNavigator);

export default App;