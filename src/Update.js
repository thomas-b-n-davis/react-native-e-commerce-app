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
    ActivityIndicator,
    FlatList,
    TextInput,
    Picker,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {styles} from './style';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Image from 'react-native-scalable-image';

const createFormData = (file, body) => {
  const data = new FormData();

  if(file===null){
    data.append("file", {});

    //data.append{"_parts": [["file", []], ["user_id", 9], ["name", "Iphone"], ["price", "10"], ["description", "Test"], ["category", "Electonics"]]}
  }else{
    data.append("file", {
      name: file.fileName,
      type: file.type,
      url:'',
      uri:
        Platform.OS === "android" ? file.uri : file.uri.replace("file://", "")
    }); 
    
}

 
  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  console.log("====>");
  console.log(data);
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
       fullname:'',
       price:'0',
       message:'',
       itemid:'',
       description:'',
       file: null,
       cat:'',
       category:'Electonics',
       current:{},
       images:''
    }
  }

  componentDidMount(){
    this.loadData();
  }

  Nav = async() => {

  }

  loadData = async() => {
    let self=this;
    const url = await AsyncStorage.getItem('url');
    this.setState({url:url});

    let current = await AsyncStorage.getItem('current');
    current=JSON.parse(current);
    this.setState({current:current,fullname:current.name,price:String(current.price),description:current.description,category:current.category});

    let user = await AsyncStorage.getItem('user');
    this.setState({user:JSON.parse(user)});

    const loggedIn = await AsyncStorage.getItem('loggedIn');
    if (loggedIn !== null) {
          this.setState({loggedIn:loggedIn});
    }


    axios.post(url+'/product/getById/',{
              user_id:this.state.user.id,
              id:this.state.current.id
            })
            .then(function (response) {
              // handle success
             let cat=response.data.rows[0];
             console.log(response.data.images);
              self.setState({current:cat,images:response.data.images,fullname:cat.name,price:String(cat.price),description:cat.description,category:cat.category});
            })
            .catch(function (error) {
              // handle error
              
    });
    
  }

  deleteImage(id){
    let self=this;

     var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"product_id":self.state.current.id,"id":id,"user_id":self.state.user.id});

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(this.state.url+"/image", requestOptions)
      .then(response => response.text())
      .then(result => this.loadData())
      .catch(error => console.log('error', error));
      

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
  fetch(this.state.url+"/updateupload/"+this.state.current.id, {
    method: "POST",
    body: createFormData(this.state.file, { user_id: self.state.user.id,name:self.state.fullname,price:self.state.price,description:self.state.description,category:self.state.category})
  })
    .then(response => response.text())
    .then(response => {
      console.log('--->');
      console.log(response);
      this.loadData();
    })
    .catch(error => {
      this.loadData();
    }).finally(function(){
      self.setState({loadingmenu:false});
    });
};

render(){
  const { file } = this.state;
  let loading ;
    if(this.state.loadingmenu===true){
      loading=<ActivityIndicator size="large" color="#E3685C" style={{width: '100%',alignItems:'center',marginTop:10}}/>;
    }else{
      loading=<TouchableOpacity onPress={()=>this.handleUploadPhoto()} style={{marginTop:15,width:'100%'}}>
          <LinearGradient end={{x: 1, y: 0}} colors={['#EC407A','#F34768', '#FF7043']} style={styles.linearGradient}>
          <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left'}]}>UPDATE</Text>
        </LinearGradient>
        </TouchableOpacity>;
    }


    let width=Dimensions.get('window').width;
    let w=Dimensions.get('window').width-(0.085*width);


     let images=[];

     let wi=300;
     let imgsss=this.state.images;
     console.log(imgsss);
     if(typeof(imgsss)==='object'){
       
      for(let t in imgsss){
        let imgg=imgsss[t];
        images.push(<View style={{alignItems:'center'}}><FastImage
  style={{height:300,width:300,margin:10}}
  source={{
    uri: 'http://192.168.0.197:28090/uploads/20200225_153525.jpg',
  }}
/>
         <TouchableOpacity onPress={()=>this.deleteImage(imgg.id)} style={{marginTop:5}}>
          <Text style={[styles.coloredButton,styles.sTxt,styles.colorWhite,{textAlign:'left',color:'#EC407A',fontWeight:'bold',borderWidth:1,borderColor:'#EC407A',paddingHorizontal:20}]}>Remove this image</Text>
        </TouchableOpacity>
        </View>);
      }
    }

    return (  
      <>
        
        <View style={styles.body}>
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
                      <TouchableOpacity style={{marginTop:20}} onPress={()=>this.props.navigation.navigate('Selling')}>
                        <Text style={{fontWeight:'bold',fontSize:15,color:'#ffffff',marginTop:15,flex:1}}>{this.state.current.name}</Text>
                      </TouchableOpacity>
                  </View>
            </LinearGradient>

          <ScrollView style={{width:'100%'}}>
              <ScrollView style={{}}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <View style={{flexDirection:'row'}}>{images}</View>
                  </ScrollView> 
                

                <View style={{padding:10,marginBottom:Platform.OS === "ios"?50:0}}>
                  
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
                    style={{marginTop:10, width: '100%',borderWidth:1,borderColor:'rgba(125, 93, 192, 0.5)'}}
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
