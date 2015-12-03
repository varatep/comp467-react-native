/**
 * Dragos Guta
 * Varatep Buranintu
 */
 'use strict';

 var React = require('react-native');
 var Camera = require('react-native-camera');

 var {
 	AppRegistry,
 	StyleSheet,
 	Text,
 	View,
 	TouchableHighlight,
 	ScrollView,
 	Image,
 	CameraRoll,
 	NativeModules,
 } = React;

 var dgvb = React.createClass({
 	getInitialState: function() {
 		return {
 			cameraType: Camera.constants.Type.back,
 			renderPhotos: false,
 			images: [],
 			selected: '',
 		};
 	},

 	componentDidMount: function() {
 		var fetch = {
 			first: 25, //photos from roll
 		};
 		CameraRoll.getPhotos(fetch, this._storePhotos, this._logImageError);
 	},

 	_storePhotos: function(data) {
 		var assets = data.edges;
 		var images = assets.map((asset) => asset.node.image);
 		this.setState({
 			images: images,
 		});
 	},

 	_logImageError: function(err) {
 		console.log(err);
 	},

 	_selectImage: function(uri) {
 		NativeModules.ReadImageData.readImage(uri, (image) => {
 			this.setState({
 				selected: image,
 			});
 			console.log("image uri: " + image);
 		});
 	},
 	
 	_switchCamera: function() {
 		var state = this.state;
 		state.cameraType = state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back;
 		this.setState(state);
 	},
 	
 	_takePicture: function() {
 		this.refs.cam.capture(function(err, data) {
 			console.log(err, data);
 		});
 	},

 	_showPhotos: function(data) {
 		this.setState({
 			renderPhotos: data
 		});
 	},

 	_runOCR: function() {

 	},

    render: function() {
    	if(this.state.renderPhotos) {
 			return (
 				<ScrollView style={styles.scrollViewContainer}>
 				<View style={styles.toolbar}>
                	<TouchableHighlight style={styles.button} onPress={this._showPhotos.bind(null, false)}>
 						<Text style={styles.toolbarButton}>Back</Text>
 					</TouchableHighlight>
 					<Text style={styles.toolbarTitle}>Photos</Text>
 					<TouchableHighlight style={styles.button} onPress={this._runOCR}>
 						<Text style={styles.toolbarButton}>OCR</Text>
 					</TouchableHighlight>
                </View>
 				<View style={styles.imageGrid}>
 				{ this.state.images.map((image) => {
 					return (
 						<TouchableHighlight onPress={this._selectImage.bind(null, image.uri)}>
 						<Image style={styles.image} source={{ uri: image.uri }} />
 						</TouchableHighlight>
 						);
 					})
 				}
 				</View>
 			    </ScrollView>
 			);
 		}
 		else {
 			return (
            <View style={styles.mainContainer}>
                <View style={styles.toolbar}>
                	<TouchableHighlight style={styles.button} onPress={this._switchCamera}>
 							<Text style={styles.toolbarButton}>Flip</Text>
 					</TouchableHighlight>
                    <Text style={styles.toolbarTitle}>TRAAS</Text>
                    <TouchableHighlight style={styles.button} onPress={this._showPhotos}>
 							<Text style={styles.toolbarButton}>Photos</Text>
 					</TouchableHighlight>
                </View>
                <Camera ref="cam" style={styles.content} type={this.state.cameraType}>
 					<View style={styles.buttonBarLower}>
 						<TouchableHighlight style={styles.button} onPress={this._takePicture}>
 							<Text style={styles.buttonText}>Take Picture</Text>
 						</TouchableHighlight>
 					</View>
 				</Camera>
 		    </View>
        	);
 		}
    }
 });

var styles = StyleSheet.create({
	toolbar: {
        backgroundColor:'#81c04d',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row'   
    },
    toolbarButton: {
        width: 50,            
        color:'#fff',
        textAlign:'center'
    },
    toolbarTitle: {
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1               
    },
	scrollViewContainer: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	imageGrid: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	image: {
		width: 100,
		height: 100,
		margin: 10,
	},
	buttonBarLower: {
		flexDirection: "row",
		position: "absolute",
		bottom: 25,
		right: 0,
		left: 0,
		justifyContent: "center"
	},
	button: {
		padding: 10,
		borderWidth: 1,
		borderColor: "#FFFFFF",
		margin: 5
	},
	buttonText: {
		color: "#FFFFFF"
	},
	mainContainer:{
        flex:1                  
    },
    content:{
        backgroundColor:'transparent',
        flex:1                
    }
});

var blob = new Blob();

AppRegistry.registerComponent('dgvb', () => dgvb);