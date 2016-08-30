import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	LayoutAnimation
} from 'react-native';
import PhotoGrid from 'react-native-photo-grid';

export default class PhotoGuessScene extends Component {
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

		this.fetchInstagramDataAsync();
	}

	fetchInstagramDataAsync() {
		let url = 'https://www.instagram.com/'+this.props.username+"/media"
		return fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {
				this.updatePhotos(responseJson)
			})
			.catch((error) => {
				console.error(error);
			});
	}

	updatePhotos(responseJson) {
		let fetchedPhotos = responseJson.items.slice(0,15).map((v,i,a) => {
			return { id: i, src: v.images.low_resolution.url, likes:v.likes.count}
		});
		fetchedPhotos.sort(function(a,b) { return b.likes - a.likes });
		fetchedPhotos.forEach(function(element, index, array) {
			element["rank"] = index+1;
		}, this);
		fetchedPhotos.sort((a,b) => { return (Math.random() * 2) - 1} )

		console.log(fetchedPhotos)
		this.setState({ photos:fetchedPhotos })
	}

	render() {
		console.log(this.state)
		return (
			<View style={styles.container}>
				<BestGrid photos={this.state.photos}/>
			</View>
		);
	}
}

class BestGrid extends React.Component {

	render() {
		console.log('Photos')
		console.log(this.props.photos)
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


	componentWillMount() {
		this.state = { h: 0 }
	}

	_onPress(item) {
		LayoutAnimation.easeInEaseOut();

		this.setState({ h: this.state.h === 0 ? 20 : 0 })
	}

	render() {
		console.log(this.props.item)
		var formattedLikes = formatNumber(this.props.item.likes)
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
				<Text style={[styles.results, { height: this.state.h }]}>#{this.props.item.rank} {formattedLikes}👍</Text>
			</TouchableOpacity>
		)
	}
}

var ranges = [
  { divider: 1e18 , suffix: 'P' },
  { divider: 1e15 , suffix: 'E' },
  { divider: 1e12 , suffix: 'T' },
  { divider: 1e9 , suffix: 'G' },
  { divider: 1e6 , suffix: 'M' },
  { divider: 1e3 , suffix: 'k' }
];

function formatNumber(n) {
  for (var i = 0; i < ranges.length; i++) {
    if (n >= ranges[i].divider) {
      return (n / ranges[i].divider).toFixed() + ranges[i].suffix;
    }
  }
  return n.toString();
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
		paddingTop: 50,
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
