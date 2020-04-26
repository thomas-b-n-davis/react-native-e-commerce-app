import React from 'react';
import {
	SafeAreaView,
  	StyleSheet,
  	ScrollView,
  	View,
  	Text,
  	StatusBar,
  	Button,
  	Dimensions,
  	TextInput,
  	TouchableOpacity,
  	ActivityIndicator
 } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {styles} from './style';
import FastImage from 'react-native-fast-image';
import {NavigationEvents} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Image from 'react-native-scalable-image';

import axios from 'axios';

let width=Dimensions.get('window').width;
let w=Dimensions.get('window').width-(0.085*width);
export default class LoginScreen extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			loadingmenu:false,
			msgAllow:false,
			current:{},
			imgs:[],
			img:'logo.png',
			order:0
		}
	}

	componentDidMount(){
		this.load();
	}

	load = async() =>{
		let self =this;
		let current = await AsyncStorage.getItem('current');
		let url = await AsyncStorage.getItem('url');
		this.setState({url:url});
		current=JSON.parse(current);
		let user = await AsyncStorage.getItem('user');
		user=JSON.parse(user);

		if(Number(current.user_id)!==Number(user.id)){
			this.setState({msgAllow:true});
		}
		// this.setState({current:JSON.parse(current)});
		// console.log(this.state.current);
		axios.post(url+'/product/getById/',{
	            user_id:user.id,
	            id:current.id
	          })
	          .then(function (response) {
	            // handle success
	            console.log(response.data);
	            if(response.data.order>0)
	            	self.setState({order:1});

	            self.setState({current:response.data.rows[0],imgs:response.data.images,img:response.data.images[0].path});
	          })
	          .catch(function (error) {
	            // handle error
	            
	          });

	}

	imageNav(path){
		this.setState({img:path});		
	}
	popular(){
		let images=[];
		for(let t in this.state.imgs){
			let imgg=this.state.imgs[t];
			images.push(<TouchableOpacity style={{margin:10}} onPress={()=>this.imageNav(imgg.path)}><Image
			    width={100} // height will be calculated automatically
			   source={{uri: this.state.url+imgg.path}}
			 />
			 </TouchableOpacity>);
		}
		return images;
	}

	submit = async() =>{
		let self=this;
		let url = await AsyncStorage.getItem('url');
	    self.setState({loadingmenu:true});
	    if(this.state.email==""){
	      self.setState({loadingmenu:true});
	    }else if(this.state.password==""){
	      self.setState({loadingmenu:true});
	    }else{
	      
	    }
	}

	rating(){
	    this.props.navigation.navigate('Rating');
	  }

	render(){
		
		let msg;
		if(this.state.msgAllow==true){
			msg=<TouchableOpacity style={{marginTop:20}} onPress={()=>this.props.navigation.navigate('Messages')}>
			                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
			                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>Send message to seller</Text>
			                    </LinearGradient>
			                  </TouchableOpacity>
		}else{
			msg=<View></View>;
		}

		let rate;
		if(this.state.order===1){
			rate=<TouchableOpacity style={{marginTop:20}} onPress={()=>this.rating()}>
			                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
			                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>Rate the sale</Text>
			                    </LinearGradient>
			                  </TouchableOpacity>
		}else{
			rate=<View></View>;
		}

		return (
			<>
				<View style={styles.body}>
		        <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{width:'100%',height:Platform.OS === "ios"?140:80,paddingTop:Platform.OS === "ios"?50:0}}>
					<View style={{height:80,justifyContent:'flex-start',
		      alignItems:'center',flexDirection:'row'}} >
		      		<TouchableOpacity style={{marginTop:20}} onPress={()=>this.props.navigation.navigate('HomeScreen')}>
		            <Image
		                    style={{width:14,margin:10}}
		                    source={require('./res/back.png')}
		                    resizeMode="contain"
		              />

		              </TouchableOpacity>
		          </View>
				</LinearGradient>
		          

				<ScrollView>
		          <View style={{flex:1,width:'100%'}}>
		          		<View style={{flex: 1,}} >
			                <Image
			                     width={w} 
			                     source={{uri: this.state.url+"/"+this.state.img}}
			                />
			              </View>
			              <ScrollView
				              horizontal={true}
				              showsHorizontalScrollIndicator={false}>
				              <View style={{flexDirection:'row'}}>{this.popular()}</View>
				          </ScrollView>
			              <View style={{flex: 1.4,padding:15}} >
			              	<ScrollView>
			                  <Text style={{fontWeight:'bold',fontSize:23,color:'#666666'}}>{this.state.current.name}</Text>
			                  <Text style={{fontSize:14,color:'#999999'}}>{this.state.current.category}</Text>
			                  <Text style={{fontWeight:'bold',fontSize:30,color:'#EC407A',marginBottom:20}}>{'\u0024'}{this.state.current.price}</Text>
			                  <Text style={{fontSize:16,color:'#666666'}}>{this.state.current.description}</Text>
			                  <Text style={{fontSize:13}}>{this.state.current.categories}</Text>
			                  <TouchableOpacity style={styles.image1} onPress={()=>this.rating()}>
			                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
			                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>View Seller Reviews</Text>
			                    </LinearGradient>
			                  </TouchableOpacity>

			                  	{msg}
			                  	{rate}
			                  </ScrollView>
			              </View>
		          </View>
		          </ScrollView>
				</View>

			</>
		);
	}
}










