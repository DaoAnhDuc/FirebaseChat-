import React from 'react';
import { View, Text } from 'react-native';

export default class ListScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Danh Sách bạn bè',
		};
	};
	render() {
		return (
			<View>
				<Text>This is list friend</Text>
			</View>
		);
	}
}
