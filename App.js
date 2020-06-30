import React from 'react';
import {Image, View, Text} from 'react-native';
import { createSwitchNavigator, createAppContainer} from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScren';
import SignUpScreen from './screens/SignUpScreen';
import FriendScreen from './screens/FriendScreen';

import ListScreen from './screens/FriendOptions/ListScreen';
import FindScreen from './screens/FriendOptions/FindScreen';
import BanScreen from './screens/FriendOptions/BanScreen';

import ChangeNameScreen from './screens/ProfileOptions/ChangeNameScreen';
import ChangePasswordScreen from './screens/ProfileOptions/ChangePasswordScreen';

const AppStack = createStackNavigator({
	Home: HomeScreen,
	Chat: ChatScreen,
	Profile: ProfileScreen,
	ChangeName: ChangeNameScreen,
	ChangePassword: ChangePasswordScreen,
});

const FriendStack = createStackNavigator({
	Friend: FriendScreen,
	List: ListScreen,
	Find: FindScreen,
	Ban: BanScreen,	
});

AppStack.navigationOptions=({navigation})=>{
  let tabBarVisible = navigation.state.index===0;
  return {
    tabBarVisible
  }
}

const AuthStack = createStackNavigator({ Login: LoginScreen });
const SignUpStack = createStackNavigator({ SignUp: SignUpScreen });



const TabNavigator = createBottomTabNavigator(
	{
		Chats: AppStack,
		Friends: FriendStack,
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, horizontalm, tintColor }) => {
				var badgeCount=1;
				const { routeName } = navigation.state;
				let imageName = require('./images/chats.png');
				if (routeName === 'Friends') {
					imageName = require('./images/friends.png');
					badgeCount = 88;
				}
				return (
					<View>
						<Image source={imageName} style={{ width: 25, resizeMode: 'contain', tintColor }} />
						{badgeCount > 0 && (
							<View
								style={{
									// On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
									position: 'absolute',
									right: -6,
									top: 20,
									backgroundColor: 'red',
									borderRadius: 6,
									width: 14,
									height: 14,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{badgeCount<10? badgeCount: '9+' }</Text>
							</View>
						)}
					</View>
				);
			},
		}),
		tabBarOptions: {
			activeTintColor: 'tomato',
			inactiveTintColor: 'gray',
		},
	}
);

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoadingScreen,
			App: TabNavigator,
			Auth: AuthStack,
			SignUp: SignUpStack,
		},
		{
			initialRouteName: 'AuthLoading',
		}
	)
);
// console.ignoredYellowBox = ['Warning: Each'];
// YellowBox.ignoreWarnings(['Warning: ...']);
console.disableYellowBox = true;