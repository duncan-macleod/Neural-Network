import * as THREE from 'three';
import { Axon, Connection } from './axon';
import Signal from './signal';
// Neuron ----------------------------------------------------------------

function Neuron( x, y, z, data, sprite, targetScale = 2 ) {

	this.connection = [];
	this.receivedSignal = false;
	this.lastSignalRelease = 0;
	this.releaseDelay = 0;
	this.fired = false;
	this.firedCount = 0;
	this.prevReleaseAxon = null;
	THREE.Vector3.call( this, x, y, z );
	this.neuronInfo = {...data};
	this.sprite = sprite;
	if (sprite) {
		this.spawnAnimate();
	}
	this.currentScale = 0;
	this.targetScale = targetScale;
	this.defaultScale = targetScale;

	this.spawnFrames = 15;
	this.scalePerFrame = this.targetScale / this.spawnFrames;

}

Neuron.prototype = Object.create( THREE.Vector3.prototype );

Neuron.prototype.connectNeuronTo = function ( neuronB ) {
	var neuronA = this;
	// create axon and establish connection
	var axon = new Axon( neuronA, neuronB );
	neuronA.connection.push( new Connection( axon, 'A' ) );
	neuronB.connection.push( new Connection( axon, 'B' ) );
	return axon;

};

Neuron.prototype.createSignal = function ( particlePool, minSpeed, maxSpeed ) {

	this.firedCount += 1;
	this.receivedSignal = false;

	var signals = [];
	// create signal to all connected axons
	for ( var i = 0; i < this.connection.length; i++ ) {
		// if ( this.connection[ i ].axon !== this.prevReleaseAxon ) {
			var c = new Signal( particlePool, minSpeed, maxSpeed );
			c.setConnection( this.connection[ i ] );
			signals.push( c );
		// }
	}
	return signals;

};

Neuron.prototype.spawnAnimate = function (direction = 1) {
	if (direction > 0) {
		if (this.currentScale >= this.targetScale) {
			return;
		}
		this.currentScale += this.scalePerFrame;
	} else {
		if (this.currentScale <= this.targetScale) {
			return;
		}
		this.currentScale -= this.scalePerFrame;
	}

	this.sprite.scale.set(this.currentScale, this.currentScale, this.currentScale);

	setTimeout(() => this.spawnAnimate(direction), 0);
}

Neuron.prototype.resetScale = function () {
	this.focused = false;
	this.targetScale = this.defaultScale;
	this.currentScale = this.defaultScale;
	if (this.sprite.scale.x !== this.targetScale) {
		this.spawnAnimate(this.targetScale > this.sprite.scale.x ? -1 : 1);
	}
	this.sprite.scale.set(this.defaultScale, this.defaultScale, this.defaultScale);
}

Neuron.prototype.onClick = function () {
	this.focused = true;
	this.setScale(this.defaultScale);
}

Neuron.prototype.setScale = function (scale) {
	const direction = this.targetScale >= scale ? -1 : 1;
	this.targetScale = scale;
	this.spawnAnimate(direction);
}

Neuron.prototype.reset = function () {
	this.receivedSignal = false;
	this.lastSignalRelease = 0;
	this.releaseDelay = 0;
	this.fired = false;
	this.focused = false;
	this.firedCount = 0;

};

export default Neuron;