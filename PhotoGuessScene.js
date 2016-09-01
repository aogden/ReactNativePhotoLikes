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
		this.state = { photos: [], paginationId:Infinity, photoIdSuffix:''};
	}

	componentWillMount() {
		console.log(this.props.navigator.getCurrentRoutes());
		this.props.navigator.getCurrentRoutes()[1].onPress = this.onPressNext.bind(this);
		this.props.navigator.getCurrentRoutes()[1].rightText = 'Next';
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

	onPressNext() {
		console.log('press next '+this)
		this.fetchInstagramDataAsync();
	}

	fetchInstagramDataAsync() {
		var url = 'https://www.instagram.com/'+this.props.username+"/media"

		//If we are fetching next batch use pagination id
		if(this.state.paginationId < Infinity)
			url += "?max_id="+this.state.paginationId+this.state.photoIdSuffix;

		return fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				this.updatePhotos(responseJson)
			})
			.catch((error) => {
				console.error(error);
			});
	}

	updatePhotos(responseJson) {
		let fetchedPhotos = responseJson.items.slice(0,15).map((v,i,a) => {
			var stringTokens = v.id.split('_')
			this.state.photoIdSuffix = '_'+stringTokens[1]
			return { id: i, src: v.images.low_resolution.url, likes:v.likes.count, imageBaseId:parseInt(stringTokens[0])}
		});
		fetchedPhotos.sort(function(a,b) { return b.likes - a.likes });
		fetchedPhotos.forEach(function(element, index, array) {
			element["rank"] = index+1;
		}, this);
		fetchedPhotos.sort((a,b) => { return (Math.random() * 2) - 1} )

		this.state.paginationId = fetchedPhotos.reduce(function(min, cur) {
				return Math.min(min,cur.imageBaseId)
			},this.state.paginationId)

		this.setState({ photos:fetchedPhotos })
	}

	render() {
		return (
			<View style={styles.container}>
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


	componentWillMount() {
		this.state = { h: 0 }
	}

	_onPress(item) {
		LayoutAnimation.easeInEaseOut();

		this.setState({ h: this.state.h === 0 ? 20 : 0 })
	}

	render() {
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
