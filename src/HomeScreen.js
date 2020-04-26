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
    
    let user = await AsyncStorage.getItem('user');
    this.setState({url:url,user:JSON.parse(user)});

    let self=this;
        axios.post(self.state.url+'/product/getAll')
	    .then(function (response) {
	        // handle success  
          self.setState({data:response.data.rows}); 
	    })
	   	.catch(function (error) { })
	    .finally(function () { 
        self.setState({loadingmenu:false});
      });
	
  }

  searchData = async() => {
   	
  }

  MenuNav = async(optin) =>{

      if(optin==="HomeScreen"){
        this._menu.hide();
        this.props.navigation.navigate("HomeScreen")
      }else if (optin==="LogoutScreen"){

        let url=await AsyncStorage.getItem('url');
        AsyncStorage.clear();
        AsyncStorage.setItem('url', url);
        this._menu.hide();
        this.props.navigation.navigate("LoginScreen");
      }else{
        this._menu.hide();
        this.props.navigation.navigate(optin);
      }
      
  }

  renderItem = ({item}) => {
    let width=Dimensions.get('window').width;
    let w=Dimensions.get('window').width-(0.085*width);
        return (
            <View style={{borderColor: '#ededed',borderRadius:10,padding:10,
            borderWidth: 1,
            borderStyle: 'solid',alignItems: 'stretch',flex: 1, margin:5}}>
              <View style={{flex: 1,}} >
                <TouchableOpacity style={styles.image1} onPress={()=>this.Nav(item)}>
                  <Image
                     width={w} // height will be calculated automatically
                     source={{uri: this.state.url+"/"+item.image[0].path}}
                />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1.4,padding:15}} >
                  <Text style={{fontSize:18}}>{item.name}</Text>
                  <Text style={{fontSize:14,color:'#999999'}}>{item.category}</Text>
                  <Text style={{fontWeight:'bold',fontSize:15,color:'#EC407A'}}>{'\u0024'}{item.price}</Text>
                  <Text style={{fontSize:13}}>{item.categories}</Text>
                  <TouchableOpacity style={styles.image1} onPress={()=>this.Nav(item)}>
                    <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
                      <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',fontSize:11,}]}>VIEW DETAILS</Text>
                    </LinearGradient>
                  </TouchableOpacity>
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
    let account;
    let logo;

     account=<Menu
                    ref={this.setMenuRef}
                    button={<Text onPress={this.showMenu} style={{fontWeight:'bold',color:'#ffffff',marginRight:20,}}>Menu</Text>}>
                    <MenuItem onPress={()=>this.MenuNav('HomeScreen')}>Home</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={()=>this.MenuNav('UploadScreen')}>Upload a product</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={()=>this.MenuNav('Buyer')}>My Buying</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={()=>this.MenuNav('Selling')}>My Stock</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={()=>this.MenuNav('LogoutScreen')}>Logout</MenuItem>
                  </Menu>;
      logo=<Image
                    style={{width:30,height:30,margin:10}}
                    source={require('./res/logo3.png')}
                    resizeMode="contain"
              />;

		return (	
			<>
				<View style={styles.body}>
		        <NavigationEvents onDidFocus={() => this.loadData()} />
		        <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{width:'100%',height:Platform.OS === "ios"?140:80,paddingTop:Platform.OS === "ios"?50:0}}>
					<View style={{height:80,justifyContent:'flex-start',
		      alignItems:'center',flexDirection:'row'}} >
		            {logo}
		            <Text style={{flex:1,fontWeight:'bold',fontSize:14,color:'#ffffff'}}>{this.state.user.name}</Text>
		            {account}
		          </View>
				</LinearGradient>
		          

		          <View style={{flex:1,width:'100%'}}>
		          <TextInput
		                  placeholder='Enter something and enter to search'
		                      placeholderTextColor='#AFAFAF'
		                  style={{borderColor: '#ededed',paddingHorizontal:10,
		            borderBottomWidth: 1,marginHorizontal:10,borderWidth:1,borderColor:'#999',marginVertical:10,borderRadius:30,display:'none'}}
		                  onChangeText={ TextInputValue =>
		                          this.setState({search : TextInputValue }) }
		                    value={this.state.search}
		                      ref={(input) => this.search = input}
		                      onSubmitEditing={ () => this.searchData() }
		                  />
		          {loading}
		          </View>
				</View>
			</>
		)
	}
}
