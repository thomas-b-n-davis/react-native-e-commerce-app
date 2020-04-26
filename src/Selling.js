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
       img:'',
       imgList:{},
       url:''
		}
	}

  componentDidMount(){
    this.loadData();
  }

  _menu = null;
 
    setMenuRef = ref => {
      this._menu = ref;
    };
   
    hideMenu = () => {
      this._menu.hide();
    };
   
    showMenu = () => {
      this._menu.show();
    };

  Nav = async(item) => {
    AsyncStorage.setItem('current',JSON.stringify(item));
    this.props.navigation.navigate('DetailsScreen');
  }

  loadData = async() => {
    let loggedIn = await AsyncStorage.getItem('loggedIn');
    let url = await AsyncStorage.getItem('url');
    this.setState({url:url});
    
    let user = await AsyncStorage.getItem('user');
    this.setState({user:JSON.parse(user)});


    let self=this;
        axios.get(url+'/product/getByUserId/'+self.state.user.id)
	    .then(function (response) {
	        // handle success  
          self.setState({data:response.data.rows}); 
	    })
	   	.catch(function (error) { })
	    .finally(function () { 
        self.setState({loadingmenu:false});
      });
	
  }


   deleteImage(id){
    let self=this;

     var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"id":id,"user_id":self.state.user.id});

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(this.state.url+"/product", requestOptions)
      .then(response => response.text())
      .then(result => this.loadData())
      .catch(error => console.log('error', error));
      

  }

  searchData = async() => {
   	
  }

  status(status){
    if(Number(status)==0)
      return "Pending";
    else if(Number(status)==1)
      return "Confirmed";
    else if(Number(status)==2)
      return "Completed";
    else if(Number(status)==3)
      return "Completed";
  }

  MenuNav(optin){

      if(optin==="HomeScreen"){
        this._menu.hide();
        this.props.navigation.navigate("HomeScreen")
      }else if (optin==="LogoutScreen"){
        AsyncStorage.clear();
        this._menu.hide();
        this.props.navigation.navigate("SignUpScreen");
      }else{
        this._menu.hide();
        this.props.navigation.navigate(optin);
      }
      
  }

  imageNav(path,id){

    
    let l=this.state.imgList;
    l[id]=path;
    this.setState({imgList:l});   
    console.log(this.state.imgList); 
  }
  Update = (item) =>{
    // console.log(item);
    AsyncStorage.setItem('current',JSON.stringify(item));
    this.props.navigation.navigate('Update');
  }

  messages(item){
    AsyncStorage.setItem('current',JSON.stringify(item));
    this.props.navigation.navigate('SellerMessages');
  }

  renderItem = ({item}) => {
    let width=Dimensions.get('window').width;
    let w=Dimensions.get('window').width-(0.085*width);


     let images=[];

     let wi=300;
     if(item.image.length==1)
      wi=w;

    for(let t in item.image){
      let imgg=item.image[t];
      images.push(<Image
          width={wi}
         source={{uri: this.state.url+"/"+imgg.path}}
       />);
    }

    // let l=this.state.imgList;
    // l[item.id]=item.image[0].path;
    // this.setState({imgList:l});


    let rate;
    if(Number(item.status)===0){
      rate=<View><TouchableOpacity style={styles.image1} onPress={()=>this.Nav(item)}>
                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:11,}]}>VIEW DETAILS</Text>
                    </LinearGradient>
                  </TouchableOpacity><TouchableOpacity style={{marginTop:10}} onPress={()=>this.messages(item)}>
                          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                            <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>View Messages</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop:10}} onPress={()=>this.Update(item)}>
                          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                            <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>Update Item</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop:10}} onPress={()=>this.deleteImage(item.id)}>
                          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                            <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>Delete Item</Text>
                          </LinearGradient>
                        </TouchableOpacity></View>
    }else if(Number(item.status)===1){
      rate=<View><TouchableOpacity style={styles.image1} onPress={()=>this.Nav(item)}>
                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:11,}]}>VIEW DETAILS</Text>
                    </LinearGradient>
                  </TouchableOpacity><TouchableOpacity style={{marginTop:10}} onPress={()=>this.messages(item)}>
                          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                            <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>View Messages</Text>
                          </LinearGradient>
                        </TouchableOpacity><TouchableOpacity style={{marginTop:10}} onPress={()=>this.props.navigation.navigate('Rate')}>
                          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                            <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>Cancel Order</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginTop:10}} onPress={()=>this.props.navigation.navigate('Rate')}>
                          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                            <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:12,}]}>Mark As Sold</Text>
                          </LinearGradient>
                        </TouchableOpacity></View>
    }else{
      rate=<View><Text style={{fontSize:13,marginBottom:10,fontWeight:'bold'}}>{this.status(item.status)}</Text>
      <TouchableOpacity style={styles.image1} onPress={()=>this.Nav(item)}>
                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:11,}]}>VIEW DETAILS</Text>
                    </LinearGradient>
                  </TouchableOpacity></View>;
    }
        return (
            <View style={{borderColor: '#ededed',borderRadius:10,padding:10,
            borderWidth: 1,
            borderStyle: 'solid',alignItems: 'stretch',flex: 1, margin:5}}>
              <View style={{flex: 1,}} >
                
                <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <View style={{flexDirection:'row'}}>{images}</View>
                  </ScrollView>
              </View>
              <View style={{flex: 1.4,padding:15}} >
                  <Text style={{fontSize:18}}>{item.name}</Text>
                  <Text style={{fontSize:14,color:'#999999'}}>{item.category}</Text>
                  <Text style={{fontWeight:'bold',fontSize:15,color:'#EC407A'}}>{'\u0024'}{item.price}</Text>
                  <Text style={{fontSize:13}}>{item.categories}</Text>
                  {rate}
              </View>
            </View>

        );
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
      loading=<FlatList
        keyExtractor={(item, index) => index.toString()}
        data={this.state.data}
        renderItem={this.renderItem}
      />;
    }
    

		return (	
			<>
				<View style={styles.body}>
		        <NavigationEvents onDidFocus={() => this.loadData()} />
		        <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{width:'100%',height:Platform.OS === "ios"?140:80,paddingTop:Platform.OS === "ios"?50:0}}>
          <View style={{height:80,justifyContent:'flex-start',
          alignItems:'center',flexDirection:'row'}} >
          <TouchableOpacity style={{marginTop:10}} onPress={()=>this.props.navigation.navigate('HomeScreen')}>
                <Image
                        style={{width:14,margin:10}}
                        source={require('./res/back.png')}
                        resizeMode="contain"
                  />
                  </TouchableOpacity>
                  <Text style={{fontWeight:'bold',fontSize:16,color:'#ffffff',marginTop:15,flex:1}}>My Stock</Text>
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
		          </View>
				</View>
			</>
		)
	}
}
