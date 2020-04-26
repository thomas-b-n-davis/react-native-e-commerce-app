import React from 'react';
import {
	SafeAreaView,
  	StyleSheet,
  	ScrollView,
  	View,
  	Text,
  	StatusBar,
  	Button,
  	BackHandler,
    TextInput,
    ActivityIndicator,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {styles} from './style';
import FastImage from 'react-native-fast-image';
import {NavigationEvents} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Image from 'react-native-scalable-image';

export default class HomeScreen extends React.Component {
	constructor(props){
		super(props)
		this.state={
       loadingmenu:true,
       data:[],
       loggedIn:false,
       u_name:'',
       user:{},
       search:'',
       message:'test',
       pid:0,
       uid:0,
       receiver_id:0
		}
	}

  componentDidMount(){
    // this.loadData();
  }



  submit = async() =>{
    let self=this;
    
    let current = await AsyncStorage.getItem('current');
    current=JSON.parse(current);
    let loggedIn = await AsyncStorage.getItem('loggedIn');
    let url = await AsyncStorage.getItem('url');
    
    let user = await AsyncStorage.getItem('user');
    user=JSON.parse(user);
    this.setState({pid:current.id,uid:user.id,receiver_id:current.user_id});


      self.setState({loadingmenu:true});
      if(this.state.message==""){
        self.setState({loadingmenu:true});
      }else{
        console.log(url+'/reviews');
        axios.post(url+'/reviews',{
              user_id:self.state.uid,
              review:this.state.message,
              seller_id:this.state.receiver_id,
              product_id:self.state.pid
            })
            .then(function (response) {
              // handle success
              console.log(response.data);
              self.props.navigation.navigate("Buyer")
              // self.setState({loadingmenu:false});
            })
            .catch(function (error) {console.log(error);
              // handle error
              alert(' Sorry kindly check your internet and retry');
            })
            .finally(function () {
              // always executed
              //self.setState({message:''});
            });
      }
  }


  renderItem = ({item}) => {
    if(item.sender_id===this.state.uid){
      return (
              <View style={{backgroundColor:'#ededed',borderColor: '#ededed',borderRadius:10,padding:10,
              borderWidth: 1,
              borderStyle: 'solid',alignItems: 'stretch',flex: 1, margin:5}}>
                <Text style={{fontSize:16}}>{item.message}</Text>
                <Text style={{fontSize:11,color:'#999999'}}>{item.timestamp}</Text>
              </View>

          );
      }else{
        return (<LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{padding:10,borderRadius:10,marginTop:10,width:'96%',height:80,marginHorizontal:'2%'}}>
                <View style={{
                borderStyle: 'solid',alignItems: 'stretch',flex: 1, margin:5}}>
                  <Text style={{fontSize:16,color:'#ffffff'}}>{item.message}</Text>
                  <Text style={{fontSize:11,color:'#eeeeee'}}>{item.timestamp}</Text>
                </View>
              </LinearGradient>

          );
      }
  }

    renderSeparator = () => {
        return (
            <View style={{height: 1, width: '100%', marginTop: 15}}>
            </View>
        );
    }

	render(){
    let loader;
    if(this.state.loading ===true){
      loader=<ActivityIndicator size="large" color="#EC407A" style={{width: '100%',alignItems:'center',marginTop:10}}/>;
    }else{
      loader=<TouchableOpacity onPress={()=>this.submit()} style={{marginTop:15,width:'100%'}}>
          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
          <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left'}]}>SUBMIT</Text>
        </LinearGradient>
        </TouchableOpacity>;
    }

		return (	
			<>
				<View style={styles.body}>
		        <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{width:'100%',height:Platform.OS === "ios"?140:80,paddingTop:Platform.OS === "ios"?50:0}}>
              <View style={{height:80,justifyContent:'flex-start',
              alignItems:'center',flexDirection:'row'}} >
              <TouchableOpacity style={{marginTop:10}} onPress={()=>this.props.navigation.navigate('DetailsScreen')}>
                    <Image
                            style={{width:14,margin:10}}
                            source={require('./res/back.png')}
                            resizeMode="contain"
                      />
                      </TouchableOpacity>
                      <Text style={{fontWeight:'bold',fontSize:29,color:'#ffffff',marginTop:15,flex:1}}>Rating</Text>
                      <TouchableOpacity style={{marginTop:10}} onPress={()=>this.loadData()}>
                    <Image
                            style={{width:14,margin:10}}
                            source={require('./res/refresh.png')}
                            resizeMode="contain"
                      />
                      </TouchableOpacity>
                  </View>
            </LinearGradient>
		          

		          <View style={{flex:1,width:'100%'}}>
		          
              
              <View style={{flex:0,width:'90%',marginHorizontal:'5%'}}>
              <TextInput
                      placeholder='Enter your comments'
                          placeholderTextColor='#AFAFAF'
                      style={{flex:0,borderColor: '#ededed',paddingHorizontal:10,
                borderBottomWidth: 1,marginHorizontal:2,borderWidth:1,borderColor:'#999',marginVertical:10,borderRadius:10,height:120}}
                      onChangeText={ TextInputValue =>
                              this.setState({message : TextInputValue }) }
                        value={this.state.message}

                          ref={(input) => this.message = input} 
                      />
              {loader}</View>
		          </View>
				</View>
			</>
		)
	}
}
