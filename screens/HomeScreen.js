import React from 'react';
import { SafeAreaView, Dimensions, Image, Text, Alert, FlatList, TouchableOpacity } from 'react-native';
import User from '../User';
import firebase from 'firebase';
import { ListItem } from 'react-native-elements';

export default class HomeScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Chats',
			headerRight: (
				<TouchableOpacity onPress={() => navigation.navigate('Profile')}>
					<Image
						style={{ width: 32, height: 32, marginRight: 10, resizeMode: 'cover', tintColor: '#999' }}
						source={require('../images/user.png')}
					/>
				</TouchableOpacity>
			),
		};
	};

	state = {
		users: [],
		dbRef: firebase.database().ref('users'),
		dbRefMess: firebase.database().ref('messages'),
		messageLast: [],
	};
	getListMessLast= async() =>{
		await this.state.dbRef.on('child_added', (val) => {
			let person = val.val();
			person.username = val.key;
			if (person.username != User.username) {
				this.state.dbRefMess
					.child(User.username)
					.child(person.username)
					.on('value', (snapshot) => {
						try {
							var key =Object.keys(snapshot.val())[snapshot.numChildren()-1];
							this.state.dbRefMess
								.child(User.username)
								.child(person.username)
								.child(key)
								.on('value', (snap) => {
									var mess = [person.username, snap.val().from, snap.val().message, snap.val().time, snap.val().type];
									this.state.messageLast.push(mess);
								});
						} catch (error) {}
					});
			}
		});
	}
	getUSer=()=>{
		this.state.dbRef.on('child_added', (val) => {
			let person = val.val();
			person.username = val.key;
			if (person.username === User.username) {
				User.name = person.name;
			} else {
				this.setState((prevState) => {
					return {
						users: [...prevState.users, person],
					};
				});
			}
		});
	}
	componentWillMount() {
		this.getListMessLast();
		this.getUSer();
	}

	componentWillUnmount() {
		this.state.dbRef.off();
	}
	convertTime = (time) => {
		var d = new Date(time);
		var c = new Date();
		var hours = d.getHours();
		var minutes = '0' + d.getMinutes();
		var formattedTime = ('0' + hours).substr(-2) + ':' + minutes.substr(-2);
		if (d.getDate() != c.getDate()) {
			formattedTime = ('0' + (d.getDate())).substr(-2) + '/' + ('0' + (d.getMonth()+1)).substr(-2);
		}
		return formattedTime;
	};
	convertMess = (from, mess, time) => {
		var FM_real = from + ':' + mess;
		var FM = from + ': ' + mess + '                                      ';
		var res;
		if(FM_real.length> 29){
			res = FM.substring(0, 27)+ "...";
		}else{
			res = FM.substring(0, 30);
		}
		return res + ' ∙ ' + time;
	};
	getMess = (item) => {
		var result, time, from, mess;
		try {
			result = this.state.messageLast.find((MESS) => MESS[0] == item.username);
			from = result[1] == item.username ? item.name : 'Bạn';
			if(result[4]=='image'){
				result = from + ' đã gủi một ảnh ∙ ' + this.convertTime(result[3]);
			}
			else if(result[4]=='text'){
				mess = result[2];
				time = this.convertTime(result[3]);
				result = this.convertMess(from, mess, time);
			}

		} catch (error) {
			result = 'Các bạn đã được kết nối với nhau!';
		}
		return result;
	};
	renderItem = ({ item }) => (
		<TouchableOpacity
			onPress={() => this.props.navigation.navigate('Chat', item)}
			style={{ borderBottomColor: '#ccc' }}
		>
			<ListItem
				title={item.name}
				subtitle={this.getMess(item)}
				leftAvatar={{ source: { uri: item.avatar } }}
				bottomDivider
				chevron
			/>
		</TouchableOpacity>
	);
	_logOut = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	};
	render() {
		const { height } = Dimensions.get('window');
		return (
			<SafeAreaView>
				<FlatList data={this.state.users} renderItem={this.renderItem} keyExtractor={(item) => item.username} />
			</SafeAreaView>
		);
	}
}