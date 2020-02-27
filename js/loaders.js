// Assets & Loaders --------------------------------------------------------
import * as THREE from 'three';
import _ from 'lodash';
class LoadingManager {
	constructor() {
		this.loadingManager = new THREE.LoadingManager();
		this.loadingManager.onLoad = () => {
			// document.getElementById( 'loading' ).style.display = 'none'; // hide loading animation when finished
			console.log( 'Done.' );
		};


		this.loadingManager.onProgress = function ( item, loaded, total ) {
			console.log( loaded + '/' + total, item );
		};

		this.shaderLoader = new THREE.XHRLoader( this.loadingManager );
		this.shaderLoader.setResponseType( 'text' );
		this.shaderLoader.loadMultiple = ( SHADER_CONTAINER, urlObj ) => {
			_.each( urlObj, ( value, key ) => {
				this.shaderLoader.load( value,  ( shader ) => {
					SHADER_CONTAINER[ key ] = shader;
				} );
			} );

		};

		this.SHADER_CONTAINER = {};
		this.shaderLoader.loadMultiple( this.SHADER_CONTAINER, {
			neuronVert: 'shaders/neuron.vert',
			neuronFrag: 'shaders/neuron.frag',
			axonVert: 'shaders/axon.vert',
			axonFrag: 'shaders/axon.frag'
		} );

		this.OBJ_MODELS = {};
		var OBJloader = new THREE.ObjectLoader( this.loadingManager );
		OBJloader.load( 'models/brain_vertex_low.obj', ( model ) => {
			this.OBJ_MODELS.brain = model.children[ 0 ];
		} );

		this.TEXTURES = {};
		var textureLoader = new THREE.TextureLoader( this.loadingManager );
		textureLoader.load( 'sprites/electric.png', ( tex ) => {
			this.TEXTURES.electric = tex;
		} );
	}
}

export default new LoadingManager();
