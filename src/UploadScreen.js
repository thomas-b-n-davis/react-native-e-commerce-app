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
    BackHandler,
    ActivityIndicator,
    FlatList,
    TextInput,
    Picker,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {styles} from './style';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

const createFormData = (file, body) => {
  const data = new FormData();

  data.append("file", {
    name: file.fileName,
    type: file.type,
    url:'',
    uri:
      Platform.OS === "android" ? file.uri : file.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

export default class HomeScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
       loadingmenu:false,
       data:[],
       user:{},
       item:{},
       loggedIn:false,
       u_name:'',
       fullname:'Iphone',
       price:'10',
       message:'',
       itemid:'',
       description:'',
       file: null,
       cat:'',
       category:'Electonics'
    }
  }

  componentDidMount(){
    this.loadData();
  }

  Nav = async() => {

  }

  loadData = async() => {
    const url = await AsyncStorage.getItem('url');
    this.setState({url:url});

    let user = await AsyncStorage.getItem('user');
    this.setState({user:JSON.parse(user)});

    const loggedIn = await AsyncStorage.getItem('loggedIn');
    if (loggedIn !== null) {
          this.setState({loggedIn:loggedIn});
    }
    
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ file: response })
      }
    })
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

handleUploadPhoto = () => {
  let self=this;
  this.setState({loadingmenu:true});
  fetch(this.state.url+"/upload", {
    method: "POST",
    body: createFormData(this.state.file, { user_id: self.state.user.id,name:self.state.fullname,price:self.state.price,description:self.state.description,category:self.state.category})
  })
    .then(response => response.text())
    .then(response => {
      this.props.navigation.navigate("HomeScreen");
    })
    .catch(error => {
      console.log("upload error", error);
      alert("Upload failed!");
    }).finally(function(){
      self.setState({loadingmenu:false});
    });
};

render(){
  const { file } = this.state;
  let loading ;
    if(this.state.loadingmenu===true){
      loading=<ActivityIndicator size="large" color="#E3685C" style={{width: '100%',alignItems:'center',}}/>;
    }else{
      loading=<TouchableOpacity onPress={()=>this.handleUploadPhoto()} style={{marginTop:20,width:'100%'}}>
          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
          <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left'}]}>SUBMIT</Text>
        </LinearGradient>
        </TouchableOpacity>;
    }

    return (  
      <>
        
        <View style={styles.body}>
          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={{width:'100%',height:Platform.OS === "ios"?120:80,paddingTop:Platform.OS === "ios"?50:0}}>
              <View style={{height:80,justifyContent:'flex-start',
              alignItems:'center',flexDirection:'row'}} >
              <TouchableOpacity style={{marginTop:10}} onPress={()=>this.props.navigation.navigate('HomeScreen')}>
                    <Image
                            style={{width:14,margin:10}}
                            source={require('./res/back.png')}
                            resizeMode="contain"
                      />
                      </TouchableOpacity>
                      <Text style={{fontWeight:'bold',fontSize:15,color:'#ffffff',marginTop:15,flex:1}}>Upload An Item</Text>
                      
                  </View>
            </LinearGradient>

          <ScrollView style={{width:'100%'}}>
                <View style={{padding:10,marginBottom:Platform.OS === "ios"?50:0}}>
                  {file && (
                    <React.Fragment>
                      <Image
                        source={{ uri: file.uri }}
                        style={{ width: 300, height: 300 }}
                      />
                        
                    </React.Fragment>
                  )}
                  <Button title="Choose Photo" onPress={this.handleChoosePhoto} /> 
                <TextInput
                    placeholder='Enter your Item name'
                        placeholderTextColor='#AFAFAF'
                    style={styles.inputBox1}
                    secureTextEntry={false}
                    onChangeText={ TextInputValue =>
                          this.setState({fullname : TextInputValue }) }
                    value={this.state.fullname}
                      ref={(input) => this.fullnmae = input}
                  />

                  <TextInput
                    placeholder='Item price'
                        placeholderTextColor='#AFAFAF'
                    style={styles.inputBox1}
                    secureTextEntry={false}
                    onChangeText={ TextInputValue =>
                          this.setState({price : TextInputValue }) }
                    value={this.state.price}
                      ref={(input) => this.price = input}
                  />

                  <TextInput
                      style={styles.inputBox}
                      placeholder='Item Description'
                      placeholderTextColor='#AFAFAF'
                      multiline={true}
                      numberOfLines={10}
                      secureTextEntry={true}
                      onChangeText={ TextInputValue =>
                          this.setState({description : TextInputValue }) }
                      value={this.state.description}
                      ref={(input) => this.description = input}
                  />

                 <Picker
                      selectedValue={this.state.category}
                      style={{marginTop:Platform.OS === "ios"?50:0,width: '100%',borderWidth:1,borderColor:'rgba(125, 93, 192, 0.5)'}}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({category: itemValue})
                      }>
                      <Picker.Item label="Electonics" value="Electonics" />
                      <Picker.Item label="Clothes" value="Clothes" />
                      <Picker.Item label="House Hold items" value="House Hold items" />
                      <Picker.Item label="Furniture" value="Furniture" />
                    </Picker>
                  {loading}
                </View>
          </ScrollView>
        </View>
        
      </>
    )
  }
}
