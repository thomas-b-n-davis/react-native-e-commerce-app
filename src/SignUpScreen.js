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
import RNPickerSelect from 'react-native-picker-select';

export default class SignUpScreen extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			email:'exesdavis@hotmail.com',
			password:'timmyses',
			loading:false,
			tel:'0202009791',
			name:'Thomas Davis'
		}
	}

	componentDidMount(){

	}

	login(){
		this.props.navigation.navigate("LoginScreen");
	}
	submit = async() =>{
		let self=this;
		let url = await AsyncStorage.getItem('url');
	    self.setState({loadingmenu:true});
	    if(this.state.name==""){
	      self.setState({loadingmenu:true});
	    }else if(this.state.email==""){
	      self.setState({loadingmenu:true});
	    }else if(this.state.tel==""){
	      self.setState({loadingmenu:true});
	    }else if(this.state.password==""){
	      self.setState({loadingmenu:true});
	    }else{
	      axios.post(url+'/user/add',{
	            name:this.state.name,
	            telephone:this.state.tel,
	            email:this.state.email,
	            password:this.state.password,
	            status:0
	          })
	          .then(function (response) {
	            // handle success
	            console.log(response.data);
	            if(response.data.status==='failed'){
	              alert(response.data.message);
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
					<Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left'}]}>SIGN UP</Text>
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
	                <ScrollView style={{width:'100%'}}>
					

					<View style={styles.formBody}>
						<Text style={[styles.label]}>Full Name</Text>
						<View style={[styles.fullWidth]}>
								<TextInput
				                    style={styles.inputBox}
				                    secureTextEntry={false}
				                    onChangeText={ TextInputValue =>
				                          this.setState({name : TextInputValue }) }
				                    value={this.state.name}
				                      ref={(input) => this.name = input}
				                  />
						</View>
						<View style={styles.seperator}></View>

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
						<Text style={[styles.label]}>Telephone</Text>
						<View style={[styles.fullWidth]}>
								<TextInput
				                    style={styles.inputBox}
				                    secureTextEntry={true}
				                    onChangeText={ TextInputValue =>
				                          this.setState({tel : TextInputValue }) }
				                    value={this.state.tel}
				                      ref={(input) => this.tel = input}
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
						<View style={styles.seperator}></View>
						<TouchableOpacity onPress={()=>this.login()} style={[]}>
		                	<Text>
		                		<Text style={[styles.sTxt,styles.mTop]}>Already have an account?</Text>
		                		<Text style={[styles.colorRed,styles.bold,styles.mLeft]}>  SIGN IN</Text>
		                	</Text>	
		                </TouchableOpacity>
		                {loader}
		            </View>
		            </ScrollView>
		    	</View>

			</>
		);
	}
}










