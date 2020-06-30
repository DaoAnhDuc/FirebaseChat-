import React from 'react'
import {View, Text} from 'react-native'

export default class FindScreen extends React.Component{
    static navigationOptions = ({ navigation }) => {
		return {
			title: 'Tìm bạn bè',
		};
	};
    render() {
		return (
			<View>
				<Text>This is find friend</Text>
			</View>
		);
	}
}