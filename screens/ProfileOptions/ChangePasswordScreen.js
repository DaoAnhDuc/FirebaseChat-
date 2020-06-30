import React from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import styles from '../../constants/style';
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'firebase';
import User from '../../User';
import SweetAlert from 'react-native-sweet-alert';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Loading from 'react-native-whc-loading';

export default class ChangePasswordScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Đổi mật khẩu',
		};
	};
	state = {
			passwordCurrent: '',
			password: '',
			rePassword: '',
			checkPassword:'',
			secure: true,
			iconName: "eye", 
			secure1: true,
			iconName1: "eye",
			secure2: true,
			iconName2: "eye",
		};
	
	handleChange = (key) => (val) => {
		this.setState({ [key]: val });
	};
	changePassword= async() =>{
		if(this.state.password != this.state.rePassword){
			Alert.alert('Lỗi', 'Mật khẩu nhập lại chưa trùng!')
		}else if(this.state.password.length< 4){
			Alert.alert('Lỗi', 'Mật khẩu phải từ 4 kí tự trở lên!');
		}else{
			this.refs.loading.show();
			await firebase
				.database()
				.ref('users/' + User.username)
				.child('password')
				.once('value', (snapshot) => {
					this.state.checkPassword = snapshot.val();
				});
			if(this.state.checkPassword == this.state.passwordCurrent){
				firebase
					.database()
					.ref('users/' + User.username)
					.update({ password: this.state.password }, function (error) {
						if (error) {
							// this.refs.loading.show(false);
							Alert.alert('Thất bại', 'Thay đổi không thành công!');
							console.log(error);
							
						} else {
							// this.refs.loading.show(false);
							Alert.alert('Thành công', 'Thay đổi mật khẩu thành công!');
							console.log(error);
						}
					});
			}else if(this.state.checkPassword != this.state.passwordCurrent){
				// this.refs.loading.show(false);
				Alert.alert('Thất bại', 'Bạn nhập chưa đúng mật khẩu cũ!');
			}
			this.refs.loading.show(false);
		}
	}
	showPass = () =>{
		let iconName = (this.state.secure) ? 'eye-slash' : 'eye';
		this.setState({
			secure: !this.state.secure,
			iconName: iconName,
		});
	}
	showPass1 = () =>{
		let iconName1 = (this.state.secure1) ? 'eye-slash' : 'eye';
		this.setState({
			secure1: !this.state.secure1,
			iconName1: iconName1,
		});
	}
	showPass2 = () =>{
		let iconName2 = (this.state.secure2) ? 'eye-slash' : 'eye';
		this.setState({
			secure2: !this.state.secure2,
			iconName2: iconName2,
		});
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<TextInput
						placeholder="Mật khẩu hiện tại"
						style={styles.input}
						autoFocus={true}
						secureTextEntry={this.state.secure}
						value={this.state.passwordCurrent}
						onChangeText={this.handleChange('passwordCurrent')}
					/>
					<Icon name="key" style={styles.iconLeft} size={26} />
					<Icon name={this.state.iconName} style={styles.iconRight} size={26} onPress={this.showPass} />
				</View>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<TextInput
						placeholder="Mật khẩu mới"
						style={styles.input}
						secureTextEntry={this.state.secure1}
						value={this.state.password}
						onChangeText={this.handleChange('password')}
					/>
					<Icon name="key" style={styles.iconLeft} size={26} />
					<Icon name={this.state.iconName1} style={styles.iconRight} size={26} onPress={this.showPass1} />
				</View>
				<View style={{ width: '80%', alignItems: 'center' }}>
					<TextInput
						placeholder="Nhập lại mật khẩu mới"
						style={styles.input}
						secureTextEntry={this.state.secure2}
						value={this.state.rePassword}
						onChangeText={this.handleChange('rePassword')}
					/>
					<Icon name="key" style={styles.iconLeft} size={26} />
					<Icon name={this.state.iconName2} style={styles.iconRight} size={26} onPress={this.showPass2} />
				</View>
				<TouchableOpacity>
					<Text style={styles.btnChange} onPress={this.changePassword}>
						Lưu
					</Text>
				</TouchableOpacity>
				<Loading ref="loading" backgroundColor="#ffffff" indicatorColor=" #00ffcc" />
			</View>
		);
	}
}

