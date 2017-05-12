import firebase from 'firebase';

import config from './config.js';

if (process.browser) {
	firebase.initializeApp(config);
}

export function signup({ email, password }) {
	return Promise.resolve(
		firebase.auth().createUserWithEmailAndPassword(email, password)
	);
}

export function signin({ email, password }) {
	return Promise.resolve(
		firebase.auth().signInWithEmailAndPassword(email, password)
	);
}

export function signout() {
	return Promise.resolve(firebase.auth().signOut());
}

export function AuthChanged() {
	return new Promise((resolve, reject) => {
		return firebase.auth().onAuthStateChanged(user => {
			if (user) {
				return resolve(user);
			} else {
				return reject(null);
			}
		});
	});
}
