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
	View,
	TouchableOpacity,
	Image,
	LayoutAnimation
} from 'react-native';
import PhotoGrid from 'react-native-photo-grid';

class photolikeproj extends Component {
	constructor() {
		super();
		this.state = { photos: [] };
	}

	componentDidMount() {
		//Standin photos with likes
		let photos = Array.apply(null, Array(15)).map((v, i) => {	
			return { id: i, src: 'https://placehold.it/200x200?text=' + (i + 1), likes: Math.floor((Math.random() * 1000) + 1) }
		});
		photos.sort(function(a,b) { return b.likes - a.likes });
		photos.forEach(function(element, index, array) {
			element["rank"] = index+1;
		}, this);
		photos.sort((a,b) => { return (Math.random() * 2) - 1} )

		this.setState({ photos });
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}> Guess Which Pic Was 👍 Most </Text>
				<BestGrid photos={this.state.photos}/>
			</View>
		);
	}
}

class BestGrid extends React.Component {

	render() {
		return (
			<PhotoGrid
				data = { this.props.photos }
				itemsPerRow = { 3 }
				itemMargin = { 1 }
				renderHeader = { this.renderHeader }
				renderItem = { this.renderItem }
				/>
		);
	}

	//   renderHeader() {
	//     return(
	//       <Text>I'm on top!</Text>
	//     );
	//   }

	renderItem(item, itemSize) {
		return (
			<GridPhoto key={item.id} item={item} itemSize={itemSize} />
		)
	}

}

class GridPhoto extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = { h: 0 }
	}

	componentWillMount() {
	}

	_onPress(item) {
		LayoutAnimation.easeInEaseOut();

		this.setState({ h: this.state.h === 0 ? 20 : 0 })
		console.log("likes " + item.likes);
	}

	render() {
		console.log(this.props);
		var likeText = 'Likes ' + this.props.item.likes;
		return (
			<TouchableOpacity
				key = { this.props.item.id }
				style = {{ width: this.props.itemSize, height: this.props.itemSize }}
				activeOpacity = {1.0}
				onPress = { () => {
					// Do Something
					this._onPress(this.props.item);
				} }>
				<Image
					style = {{ width: this.props.itemSize, height: this.props.itemSize - this.state.h }}
					source = {{ uri: this.props.item.src }}
					/>
				<Text style={[styles.results, { height: this.state.h }]}>#{this.props.item.rank} {this.props.item.likes}👍</Text>
			</TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 20
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	results: {
		textAlign: 'center',
		fontSize: 12,
		backgroundColor: 'white',
		height: 0
	}
});

AppRegistry.registerComponent('photolikeproj', () => photolikeproj);
