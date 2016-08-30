/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	Image,
	TouchableHighlight,
	Navigator
} from 'react-native';

import PhotoGuessScene from './PhotoGuessScene';
import CelebPickScene from './CelebPickScene';

class photolikeproj extends Component {
	renderScene(route, navigator) {
		if (route.name == "CelebPickScene") {
			return <CelebPickScene navigator={navigator} {...route.passProps} />
		}
		else if (route.name == "PhotoGuessScene") {
			return <PhotoGuessScene navigator={navigator} {...route.passProps} />
		}
	}

	render() {
		return (
			<Navigator
				style={{ flex: 1 }}
				initialRoute={{ 
					name: 'CelebPickScene',
					title:"Pick a celebrity"
				 }}
				renderScene={this.renderScene}
				navigationBar={
					<Navigator.NavigationBar
						style={ styles.nav }
						routeMapper={ NavigationBarRouteMapper }
						/>
				} />
		);
	}
}

var NavigationBarRouteMapper = {
	LeftButton(route, navigator, index, navState) {
		if (index > 0) {
			return (
				<TouchableHighlight
					underlayColor="transparent"
					onPress={() => { if (index > 0) { navigator.pop() } } }>
					<Text style={ styles.leftNavButtonText }>Back</Text>
				</TouchableHighlight>)
		}
		else { return null }
	},
	RightButton(route, navigator, index, navState) {
		if (route.onPress) return (
			<TouchableHighlight
				onPress={ () => route.onPress() }>
				<Text style={ styles.rightNavButtonText }>
					{ route.rightText || 'Right Button' }
				</Text>
			</TouchableHighlight>)
	},
	Title(route, navigator, index, navState) {
		return <Text style={ styles.title }>{route.title}</Text>
	}
};

var styles = StyleSheet.create({
	leftNavButtonText: {
		fontSize: 18,
		marginLeft: 5,
		marginTop: 2
	},
	rightNavButtonText: {
		fontSize: 18,
		marginRight: 5,
		marginTop: 2
	},
	nav: {
		height: 50,
		backgroundColor: '#efefef',
		flex:1,
		flexDirection:'row',
	},
	title: {
		marginTop: 2,
		fontSize: 15
	},
});

AppRegistry.registerComponent('photolikeproj', () => photolikeproj);
