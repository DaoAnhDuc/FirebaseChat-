import React from "react";
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TextInput,
	Alert,
  AsyncStorage,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import User from "../User";
import * as ImagePicker from "expo-image-picker";
import styles from "../constants/style";
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase";
import Loading from "react-native-whc-loading";

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: "Profile",
  };

  state = {
    name: User.name,
    username: User.username,
    url:
      "https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2",
  };
  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  getURL() {
    var renderImg = firebase
      .database()
      .ref("users/" + User.username + "/avatar");
    renderImg.once("value", (snapshot) => {
      this.state.url = snapshot.val();
    });
  }
  componentWillMount() {
    this.getURL();
  }
  onChooseImagePress = async () => {
    // let result = await ImagePicker.launchCameraAsync();
    let result = await ImagePicker.launchImageLibraryAsync();
    // console.log(result.uri)

    if (!result.cancelled) {
      this.uploadImage(result.uri, this.state.username)
        .then(() => {
          this.props.navigation.navigate("Home");
          this.props.navigation.navigate("Profile");
          Alert.alert("Success");
          this.refs.loading.show(false);
          console.log(this.state.url);
        })
        .catch((error) => {
          this.refs.loading.show(false);
          Alert.alert(error);
        });
    }
  };

  uploadImage = async (uri, imageName) => {
    this.refs.loading.show();
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = await firebase
      .storage()
      .ref()
      .child("images/avatar/" + imageName);
    // ghi vào storage
    firebase
      .storage()
      .ref()
      .child("images/avatar/" + imageName)
      .getDownloadURL()
      .then(function (url) {
        firebase
          .database()
          .ref("users")
          .child(User.username)
          .update({ avatar: url });
      });
    // ghi vào realtime database
    return ref.put(blob);
  };
  render() {
    return (
      <View style={styles.profile}>
        <View style={{display: "flex",flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginBottom: 10}}>
          <TouchableOpacity onPress={this.onChooseImagePress}>
            <Image
              style={{
                width: 80,
								height: 80,
								marginVertical: 20,
								marginHorizontal: 20,
                resizeMode: "cover",
                marginBottom: 10,
                borderRadius: 75,
              }}
              source={{ uri: this.state.url }}
              // source={this.state.imageSource}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>{this.state.name}</Text>
        </View>
        {/* <TextInput
					value={this.state.name}
					onChangeText={this.handleChange('name')}
					style={styles.input}
					textAlign={'center'}
				/> */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("ChangeName")}
        >
					<View>
          	<Text style={styles.btnChange}><Icon name="user-edit" size={16} />  Đổi tên</Text>
					</View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("ChangePassword")}
        >
          <Text style={styles.btnChange}><Icon name="unlock" size={16} />   Đổi mật khẩu</Text>
        </TouchableOpacity>
				<TouchableOpacity
          onPress={() => alert("Thông báo")}
        >
					<View>
          	<Text style={styles.btnChange}><Icon name="bell" size={16} />  Thông báo</Text>
					</View>
        </TouchableOpacity>
				<TouchableOpacity
          onPress={() => alert("Cài đặt")}
        >
					<View>
          	<Text style={styles.btnChange}><Icon name="cog" size={16} />  Cài đặt</Text>
					</View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text onPress={this._logOut} style={styles.btnLogOut}>
					<Icon name="sign-out-alt" size={16} /> Đăng xuất
          </Text>
        </TouchableOpacity>
        <Loading
          ref="loading"
          backgroundColor="#ffffff"
          indicatorColor=" #00ffcc"
        />
      </View>
    );
  }
}
