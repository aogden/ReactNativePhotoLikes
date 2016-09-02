import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	LayoutAnimation,
	ListView,
	TouchableHighlight,
	Navigator
} from 'react-native';

import instaFile from './insta.json'

export default class CelebPickScene extends Component {
	constructor(props)
	{
		super(props);
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			dataSource: ds.cloneWithRows(instaFile.usernames),
			selectedRowData: ""
		};
	}

	onPress(rowData) {
		this.setState({selectedRowData:rowData});
		this.props.navigator.push({
			name: "PhotoGuessScene",
			passProps:{username:rowData},
			title:"Guess Which Pic Was 👍 Most"
		})
	}

	renderRow(rowData) {
		return(
			<TouchableHighlight onPress= { () => this.onPress(rowData) }>
				<View style={styles.row}>
					<Text style={styles.text}>{rowData}</Text>
				</View>
			</TouchableHighlight>
		)
	}

	render() {
		return (			
			<View style={{paddingTop: 50, flex:1}}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={(rowData) => this.renderRow(rowData)}
				/>
			</View>
		);
	}
}

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
	fontSize: 24,
	textAlign: 'center',
  },
});