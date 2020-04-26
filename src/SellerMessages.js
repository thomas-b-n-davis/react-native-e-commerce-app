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
       message:'',
       pid:0,
       uid:0,
       receiver_id:0
		}
	}

  componentDidMount(){
    this.loadData();
  }

  loadData = async() => {
    let current = await AsyncStorage.getItem('current');
    current=JSON.parse(current);
    let loggedIn = await AsyncStorage.getItem('loggedIn');
    let url = await AsyncStorage.getItem('url');
    
    let user = await AsyncStorage.getItem('user');
    user=JSON.parse(user);
    this.setState({pid:current.id,uid:user.id,receiver_id:current.user_id});

    let self=this;
        axios.post(url+'/message/getAllCommunications/',{
              user_id:user.id,
              product_id:current.id
            })
	    .then(function (response) {
	        // handle success  
          self.setState({data:response.data.rows}); 
	    })
	   	.catch(function (error) { console.log(error);})
	    .finally(function () { 
        self.setState({loadingmenu:false});
      });
	
  }


  submit = async() =>{
    let self=this;
    let url = await AsyncStorage.getItem('url');
      self.setState({loadingmenu:true});
      if(this.state.message==""){
        self.setState({loadingmenu:true});
      }else{
        axios.post(url+'/message/send/',{
              receiver_id:this.state.receiver_id,
              message:this.state.message,
              sender_id:self.state.uid,
              product_id:self.state.pid
            })
            .then(function (response) {
              // handle success
              self.loadData();
              self.setState({loadingmenu:false});
            })
            .catch(function (error) {console.log(error);
              // handle error
              alert(' Sorry kindly check your internet and retry');
            })
            .finally(function () {
              // always executed
              self.setState({message:''});
            });
      }
  }

  viewallMsg = (item) =>{
    AsyncStorage.setItem('conversation',JSON.stringify(item));
    this.props.navigation.navigate('Conversation');
  }


  renderItem = ({item}) => {
    let txt=item.message;
      txt=txt.split("<br/>").join(",");

    return (<View style={{backgroundColor:'#ededed',borderColor: '#ededed',borderRadius:10,padding:10,
              borderWidth: 1,
              borderStyle: 'solid',alignItems: 'stretch',flex: 1, margin:5}}>
                <Text style={{fontSize:16}}>{txt}</Text>
                <Text style={{fontSize:11,color:'#999999'}}>{item.timestamp}</Text>

                <TouchableOpacity onPress={()=>this.viewallMsg(item)} style={{marginTop:15,width:'100%'}}>
                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                    <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left'}]}>View Conversation</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>);
  }

    renderSeparator = () => {
        return (
            <View style={{height: 1, width: '100%', marginTop: 15}}>
            </View>
        );
    }

	render(){
    let loading ;
    if(this.state.loadingmenu===true){
      loading=<ActivityIndicator size="large" color="#E3685C" style={{width: '100%',alignItems:'center',marginTop:100}}/>;
    }else{
      if(this.state.data.length>0){
      loading=<FlatList
      keyExtractor={(item, index) => index.toString()}
        data={this.state.data}
        renderItem={this.renderItem}
      />;
      }else{
        loading=<Text style={{fontSize:18,margin:20}}>No Messages Yet</Text>;
      }
    }

    let loading1 ;
    if(this.state.loading ===true){
      loading1=<ActivityIndicator size="large" color="#EC407A" style={{width: '100%',alignItems:'center',marginTop:5}}/>;
    }else{
      loading1=<TextInput
                      placeholder='Enter something and enter to search'
                          placeholderTextColor='#AFAFAF'
                      style={{flex:0,borderColor: '#ededed',paddingHorizontal:10,
                borderBottomWidth: 1,marginHorizontal:2,borderWidth:1,borderColor:'#999',marginVertical:10,borderRadius:30}}
                      onChangeText={ TextInputValue =>
                              this.setState({message : TextInputValue }) }
                        value={this.state.message}
                          ref={(input) => this.message = input}
                          onSubmitEditing={ () => this.submit() }
                      />
                       ;
    }
		return (	
			<>
				<View style={styles.body}>
		        <NavigationEvents onDidFocus={() => this.loadData()} />
		        <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{width:'100%',height:Platform.OS === "ios"?140:80,paddingTop:Platform.OS === "ios"?50:0}}>
          <View style={{height:80,justifyContent:'flex-start',
          alignItems:'center',flexDirection:'row'}} >
          <TouchableOpacity style={{marginTop:10}} onPress={()=>this.props.navigation.navigate('Selling')}>
                <Image
                        style={{width:14,margin:10}}
                        source={require('./res/back.png')}
                        resizeMode="contain"
                  />
                  </TouchableOpacity>
                  <Text style={{fontWeight:'bold',fontSize:29,color:'#ffffff',marginTop:15,flex:1}}>Messages</Text>
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
		          
		          {loading}

              <View style={{flex:0,width:'90%',marginHorizontal:'5%'}}>{loading1}</View>
		          </View>
				</View>
			</>
		)
	}
}
