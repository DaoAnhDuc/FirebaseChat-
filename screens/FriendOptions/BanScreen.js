import React from 'react';
import { View, Text } from 'react-native';

export default class BanScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Danh Sách bạn bè đã chặn',
		};
	};
	render() {
		return (
			<View>
				<Text>This is ban friend</Text>
			</View>
		);
	}
}
