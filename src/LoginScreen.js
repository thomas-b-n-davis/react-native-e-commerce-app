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
  	TouchableOpacity,
  	ActivityIndicator
 } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './style';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

export default class LoginScreen extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			email:'exesdavis@hotmail.com',
			password:'timmyses',
			confirmpassword:'',
			loadingmenu:false
		}
	}

	componentDidMount(){
		this.clr();
	}

	clr = async() =>{
		// AsyncStorage.clear();
		// this.props.navigation.navigate("SplashScreen");
	}

	login = async() =>{
		this.props.navigation.navigate("SignUpScreen");
	}

	submit = async() =>{
		let self=this;
		let url = await AsyncStorage.getItem('url');
		console.log(url);
	    self.setState({loadingmenu:true});
	    if(this.state.email==""){
	      self.setState({loadingmenu:true});
	    }else if(this.state.password==""){
	      self.setState({loadingmenu:true});
	    }else{
	    	console.log(url+'/user/login');
	      axios.post(url+'/user/login',{
	            email:this.state.email,
	            password:this.state.password
	          })
	          .then(function (response) {
	            // handle success
	            if(response.data.status==='failed'){
	              alert("Sorry wrong username or password");
	            }else{
	              AsyncStorage.setItem('loggedIn', "true");
	              AsyncStorage.setItem('user', JSON.stringify(response.data.callback));
	              self.props.navigation.navigate('HomeScreen');
	            }
	          })
	          .catch(function (error) {console.log(error);
	            // handle error
	            alert(' Sorry kindly check your internet and retry');
	          })
	          .finally(function () {
	            // always executed
	            self.setState({loadingmenu:false});
	          });
	    }
	}

	render(){
		let loader;
		if(this.state.loading ===true){
			loader=<ActivityIndicator size="large" color="#EC407A" style={{width: '100%',alignItems:'center',marginTop:10}}/>;
		}else{
			loader=<TouchableOpacity onPress={()=>this.submit()} style={{marginTop:15,width:'100%'}}>
			    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
					<Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left'}]}>SIGN IN</Text>
				</LinearGradient>
		    </TouchableOpacity>;
		}

		return (
			<>
				
				<View style={styles.body}>
					<Image
	                  style={{width:100,marginTop:Platform.OS === "ios"?40:0}}
	                  source={require('./res/logo3.png')}
	                  resizeMode="contain"
	                />
	                <View style={[styles.fullWidth,styles.flexOne]}>

						<View style={[styles.formBody]}>
							<Text style={[styles.label]}>Email Address</Text>
							<View style={[styles.fullWidth]}>
									<TextInput
					                    style={styles.inputBox}
					                    secureTextEntry={false}
					                    onChangeText={ TextInputValue =>
					                          this.setState({email : TextInputValue }) }
					                    value={this.state.email}
					                      ref={(input) => this.email = input}
					                  />
							</View>
							<View style={styles.seperator}></View>
							<Text style={[styles.label]}>Password</Text>
							<View style={[styles.fullWidth]}>
									<TextInput
					                    style={styles.inputBox}
					                    secureTextEntry={true}
					                    onChangeText={ TextInputValue =>
					                          this.setState({password : TextInputValue }) }
					                    value={this.state.password}
					                      ref={(input) => this.password = input}
					                  />
							</View>	

							<View style={styles.seperator}></View>
						</View>
	                </View>
	                <View style={[styles.mdiContainer,{flex:0.3}]}>
							<TouchableOpacity onPress={()=>this.login()} style={[]}>
			                	<Text>
			                		<Text style={[styles.sTxt,styles.mTop]}>Don't have an account?</Text>
			                		<Text style={[styles.colorRed,styles.bold,styles.mLeft]}>  SIGN UP</Text>
			                	</Text>	
			                </TouchableOpacity>
			                {loader}
		            </View>
		    	</View>

			</>
		);
	}
}










