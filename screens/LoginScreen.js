import React from 'react';
import { Alert, AsyncStorage,Image,CheckBox, Text, TextInput, View, TouchableOpacity, SafeAreaView } from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/style';
import Loading from 'react-native-whc-loading';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class App extends React.Component {
	static navigationOptions = {
		header: null,
	};
	state = {
		username: '',
		password: '',
		checkPass: '',
		secure: true,
		saveUser: true,
		iconName: "eye", 
	};
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	submitForm = async() => {
		if (this.state.username.length < 4) {
			Alert.alert('Error', 'Tài khoản phải có ít nhất 4 kí tự');
		} else if (this.state.password.length < 4) {
			Alert.alert('Error', 'Mật khẩu phải chứa ít nhất 4 kí tự');
		} else {
			this.refs.loading.show();
			await AsyncStorage.setItem('username', this.state.username);
			User.username = this.state.username;
			await firebase
				.database()
				.ref('users/' + User.username)
				.child('password')
				.once('value', (snapshot) => {
					this.state.checkPass = snapshot.val();
				});
			this.refs.loading.show(false);
			if (this.state.password == this.state.checkPass) {
				this.props.navigation.navigate('App');
			} else {
				Alert.alert('Đăng nhập không thành công', 'Tài khoản hoặc mật khẩu bạn nhập chưa đúng');
			}
		}
	};
	singUp = () => {
		this.props.navigation.navigate('SignUp');
	};
	showPass = () =>{
		let iconName = (this.state.secure) ? 'eye-slash' : 'eye';
		this.setState({
			secure: !this.state.secure,
			iconName: iconName,
		});
	}
	render() {
		return (
			<View style={styles.container}>
				<Image
					source={require('../images/logo.png')}
					style={{ width: 160, height: 160, marginBottom: 30, opacity: 0.8, marginTop: -100 }}
				/>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<Icon name="user-alt" style={styles.iconLeft} size={20} />
					<TextInput
						placeholder="Tài khoản"
						autoFocus={true}
						style={styles.input}
						value={this.state.username}
						onChangeText={this.handleChange('username')}
					/>
				</View>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<TextInput
						placeholder="Mật khẩu"
						secureTextEntry={this.state.secure}
						style={styles.input}
						value={this.state.password}
						onChangeText={this.handleChange('password')}
					/>
					<Icon name="key" style={styles.iconLeft} size={20} />
					<Icon name={this.state.iconName} style={styles.iconRight} size={20} onPress={this.showPass} />
				</View>
				<TouchableOpacity onPress={this.submitForm}>
					<Text style={styles.btnLogIn}>Đăng nhập</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.singUp}>
					<Text style={{fontSize: 16, marginTop: 10}}>Bạn chưa có tài khoản? <Text style={styles.btnText}>Đăng kí tại đây</Text></Text>
				</TouchableOpacity>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #00ffcc" />
			</View>
		);
	}
}