import Swal from 'sweetalert2'

// import {googleAuthProvider} from '../firebase/firebase-config'
// import firebase from '../firebase/firebase-config'
import { types } from "../types/types"
import { noteLogout } from './notes'
import { finishLoading, startLoading } from './ui'

// const url = 'https://as-deporte33.herokuapp.com'
const url = 'http://localhost:8080'

export const startLoginEmailPassword = (email, password) => {
	/* Prueba de funcion asincrona (Fetch, posteo de archivos,
	dispatch de otras acciones ) */
	return(dispatch) => {

		dispatch(startLoading())

		// Agregamos return para evaluar en el testing
		return fetch(`${url}/api/auth/login`, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ correo: email, password }),
			}).then((response) => {
				if (!response.status === 200) {
					Swal.fire('Error', 'Algo salio mal! :(' , 'error')
				}
				return response.json();
			}).then(({usuario, token}) => {
				localStorage.setItem('token', token);
				const {uid, nombre, ...data} = usuario
				dispatch(login(uid, nombre, data))
				dispatch(finishLoading())
			}).catch(e => {
				console.log(e);
				dispatch(finishLoading())
				Swal.fire('Error', 'Uno de los campos es incorrecto' , 'error')
			})
	}

}

// Asincrono
export const startRegisterWithEmailPasswordName = (formValues) => {
	return (dispatch) => {
		fetch(`${url}/api/usuarios`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formValues),
		}).then((response) => {
			// if (!response.status === 200) {
			// 	Swal.fire('Error', 'Algo salio mal! :(' , 'error')
			// }
			return response.json();
		}).then((response) => {
			Swal.fire('Saved', 'Registro exitoso', 'success')
			dispatch(startLoading())
			// const {uid, nombre, ...data} = formValues
			const {usuario, ...data} = response
			dispatch(login(usuario.uid, usuario.nombre, data))
			dispatch(finishLoading())
		}).catch(e => {
			console.log(e);
			Swal.fire('Error', 'Uno de los campos es incorrecto' , 'error')
		})
	}
}

export const login = (uid, displayName, data) => ({
	type: types.login,
	payload: {
		uid, displayName, data
	}
})
export const updateData = (displayName, data) => ({
	type: types.updateData,
	payload: {
		displayName,
		data
	}
})

// Asincrono
export const startLogout = () => {
	return async (dispatch) => {
		// await firebase.auth().signOut()

		/*Mandamos la accion logout que viene en definida abajo
		la cual manda el despacho al state, en el cual el authREducer
		se encarga de recetear los valores de la autenticación */
		dispatch(logout())
		dispatch(noteLogout())
	}
}

export const logout = () => ({
	type: types.logout
})