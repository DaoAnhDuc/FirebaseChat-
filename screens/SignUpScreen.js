import React from 'react';
import { Alert, AsyncStorage, Text, TextInput ,View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Loading from 'react-native-whc-loading';

export default class SignUpScreen extends React.Component {
	static navigationOptions = {
		header: null,
	};
	state = {
		username: '',
		name: '',
		password: '',
		rePassword: '',
		checkExisted: null,
		userID: 0,
		secure: true,
		iconName: "eye", 
		secure1: true,
		iconName1: "eye", 
		listFriend: [],
		listBan: [],
		listRequest: [],
		avatar:
			'https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2',
	};
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	submitForm = async () => {
		if (this.state.username.length == '' || this.state.password=='' ) {
			Alert.alert('Lỗi', 'Vui lòng nhập thông tin đăng nhập');
		} else if (0 < this.state.username.length  && this.state.username.length < 4) {
			Alert.alert('Lỗi', 'Tài khoản phải có ít nhất 4 kí tự');
		} else if (this.state.password.length < 4) {
			Alert.alert('Lỗi', 'Mật khẩu phải chứa ít nhất 4 kí tự');
		} else if (this.state.password != this.state.rePassword) {
			Alert.alert('Lỗi', 'Mật khẩu nhập lại chưa trùng khớp!');
		} else {
			await AsyncStorage.setItem('username', this.state.username);
			User.username = this.state.username;
			await firebase
				.database()
				.ref('users/' + User.username)
				.child('password')
				.once('value', (snapshot) => {
					this.state.checkExisted = snapshot.val();
				});
			this.refs.loading.show();
			if (this.state.checkExisted != null) {
				Alert.alert('Lỗi', 'Username đã được sử dụng');
				this.refs.loading.show(false);
			} else {
				await firebase
					.database()
					.ref('users/')
					.once('value')
					.then((snapshot) => {
						this.state.userID = snapshot.numChildren() + 1;
						this.state.userID = '000000' + this.state.userID;
						this.state.userID = this.state.userID.substr(-6);
					});
				await firebase
					.database()
					.ref('users/' + User.username)
					.set({
						name: this.state.name,
						password: this.state.password,
						userID: this.state.userID,
						listFriend: this.state.listFriend,
						listBan: this.state.listBan,
						listRequest: this.state.listRequest,
						avatar: this.state.avatar,
					});
				const response = await fetch(
					'https://firebasestorage.googleapis.com/v0/b/fir-chat-ffbb9.appspot.com/o/images%2Favatar%2Fdf.png?alt=media&token=c17a4c1b-f661-4e8e-80ed-4edeb56173b2'
				);
				const blob = await response.blob();

				var ref = await firebase
					.storage()
					.ref()
					.child('images/avatar/' + this.state.username);
				ref.put(blob);
				this.refs.loading.show(false);
				// console.log(this.state.userID);
				this.props.navigation.navigate('App');
			}
		}
	};
	goToLogin = () => {
		this.props.navigation.navigate('Auth');
	};
	showPass = () =>{
		let iconName = (this.state.secure) ? 'eye-slash' : 'eye';
		this.setState({
			secure: !this.state.secure,
			iconName: iconName,
		});
	}
	showPass1 = () =>{
		let iconName = (this.state.secure1) ? 'eye-slash' : 'eye';
		this.setState({
			secure1: !this.state.secure1,
			iconName1: iconName,
		});
	}
	render() {
		return (
			<View style={styles.container}>
				<Text style={{fontSize: 20,marginBottom: 10}}>Đăng ký tài khoản</Text>
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
					<Icon name="user-alt" style={styles.iconLeft} size={20} />
					<TextInput
						placeholder="Tên hiển thị"
						style={styles.input}
						value={this.state.name}
						onChangeText={this.handleChange('name')}
					/>
				</View>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<TextInput
						placeholder="Mật khẩu"
						style={styles.input}
						secureTextEntry={this.state.secure}
						value={this.state.password}
						onChangeText={this.handleChange('password')}
					/>
					<Icon name="key" style={styles.iconLeft} size={20} />
					<Icon name={this.state.iconName} style={styles.iconRight} size={20} onPress={this.showPass} />
				</View>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<TextInput
						placeholder="Nhập lại mật khẩu"
						style={styles.input}
						secureTextEntry={this.state.secure1}
						value={this.state.rePassword}
						onChangeText={this.handleChange('rePassword')}
					/>
					<Icon name="key" style={styles.iconLeft} size={20} />
					<Icon name={this.state.iconName1} style={styles.iconRight} size={20} onPress={this.showPass1} />
				</View>
				<TouchableOpacity onPress={this.submitForm}>
					<Text style={styles.btnRegister}>Đăng kí</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.goToLogin}>
					<Text style={styles.btnText}>Quay lại màn hình đăng nhập</Text>
				</TouchableOpacity>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #00ffcc" />
			</View>
		);
	}
}
