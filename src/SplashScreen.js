import React from 'react';
import {
	SafeAreaView,
  	StyleSheet,
  	ScrollView,
  	View,
  	Text,
  	StatusBar,
  	Image,
  	Button,
    TextInput,
  	BackHandler,
    ImageBackground
 } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './style';

export default class SplashScreen extends React.Component{

	constructor(props){
		super(props)
		this.state = {
      url:false,
      uLink:''
		}
	}

	componentDidMount(){
		this.timeoutHandle = setTimeout(()=>{
      // Add your logic for the transition
      this.loadData();
    }, 500);
	}

  setUrl = async() => {
    console.log(this.state.uLink);
    AsyncStorage.setItem('url', this.state.uLink);
    this.loadData();
  }

  loadData = async() => {
    // AsyncStorage.setItem('url', 'http://192.168.0.197:28090');
    let url = await AsyncStorage.getItem('url');
      if (url !== null) {
      let loggedIn = await AsyncStorage.getItem('loggedIn');
      if (loggedIn !== null) {
        if (loggedIn === "true"){
          this.props.navigation.navigate('HomeScreen');
        }else{
          this.props.navigation.navigate('LoginScreen');
        }
      }else{
        // AsyncStorage.setItem('url', 'http://192.168.0.197:28090');
        let firstTime=AsyncStorage.getItem('firstTime');
        if (loggedIn !== null) 
          this.props.navigation.navigate('SignUpScreen');
        else
          this.props.navigation.navigate('LoginScreen');
      }
    }else{
      this.setState({url:true});
    }
  }

	render(){

    let loading1 ;
    if(this.state.url ===false){
      loading1=<View/>;
    }else{
      loading1=<TextInput
                      placeholder='IP'
                          placeholderTextColor='#222222'
                      style={{flex:0,borderColor: '#222222',paddingHorizontal:10,
                      marginBottom:Platform.OS === "ios"?40:0,
                      height:42,
                    borderBottomWidth: 1,marginHorizontal:2,borderWidth:1,borderColor:'#222222',marginVertical:10,borderRadius:30,width:'100%'}}
                      onChangeText={ TextInputValue =>
                              this.setState({uLink : TextInputValue })}
                        value={this.state.uLink}
                          ref={(input) => this.uLink = input}
                          onSubmitEditing={ () => this.setUrl() }
                      />
                       ;
    }

		return (
			<>
				<View style={styles.body}>
		      <Image
                  style={{width:'80%'}}
                  source={require('./res/logo3.png')}
                  resizeMode="contain"
          />
          {loading1}
		    </View>
			</>
		);
	}
}


