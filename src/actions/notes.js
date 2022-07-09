// import {db} from '../firebase/firebase-config'
import { loadNotes } from '../helpers/loadNotes'
import { types } from '../types/types'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import { fileUpload } from '../helpers/fileUpload'
// const url = 'https://as-deporte33.herokuapp.com'
const url = 'http://localhost:8080'

// react-journal
export const startNewNote = () => {
	// Como es func asyncrono, usamos un callback
	// El 2° argumetno es un func para obtener el state
	return async (dispatch, getState) => {
		// const {uid} = getState().auth

		// // Pad que mandaremos a firebase
		const newNote = {
			title: "",
			content: "",
			noteImg: "",
			// _id: ""
		}
		// try {
		// 	// De firebase-config
		// 	// `` Viene de la estructura que definimos en firebase
		// 	// Como es una promesa, 'async' al return de la func
		// 	const doc = await db.collection(`${uid}/journal/notes`).add(newNote)
			dispatch(activeNote(newNote.title, newNote.noteImg, newNote.content, newNote._id))
			dispatch(addNewNote("", newNote))
		// } catch (error) {
		// 	console.log(error);
		// }
	}
}

// () porque retorna un objeto
export const activeNote = (title, noteImg, content, _id) => ({
	type: types.notesActive,
	payload: {
		// ... toda la infromación en el mismo objeto
		title, noteImg, content, _id
	}
})

export const addNewNote = (id, note) => ({
	type: types.notesAddNew,
	payload: note
})

export const startLoadingNotes = (notas) => {
	return async (dispatch) => {
		// const notes = await loadNotes(notas)
		dispatch(setNotes(notas))
	}
}

export const setNotes = (notes) => ({
	type: types.notesLoad,
	payload: notes
})

// La nota ya viene con su id
export const startSaveNote = (active, user, {notes}) => {
	return async (dispatch, getState) => {

		const newNotas = notes.map(nota => {
			let notas = {};
			if (nota._id === active._id) {
				notas.title = active.title;
				notas.content = active.content;
				notas.noteImg = active.noteImg;
				notas._id = active._id;
			} else {
				notas = nota
			}
			return notas;
		})

		const sendData = {
			nombre: user.name,
			correo: user.data.correo,
			imagen: user.data.imagen,
			direccion: user.data.direccion,
			ciudad: user.data.ciudad,
			pais: user.data.pais,
			telefono: user.data.telefono,
			notas: newNotas
		}
		const token = localStorage.getItem('token');
		fetch(`${url}/api/notes/${user.uid}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-token': token
			},
			body: JSON.stringify(sendData),
		}).then((response) => {
			if (!response.status === 201) {
				Swal.fire('Error', 'Algo salio mal! :(' , 'error')
			}
			return response.json();
		}).then((response) => {
			const {currentUsuario} = response
			// let notas = {};
			// notas.title = active.title;
			// notas.content = active.content;
			// notas.noteImg = active.noteImg;
			// notas._id = active._id;
			const notaActual = currentUsuario.notas[0]
			dispatch(startLoadingNotes(currentUsuario.notas))
			dispatch(activeNote(notaActual.title, notaActual.noteImg, notaActual.content, notaActual._id))
			Swal.fire('Saved', active.title, 'success')
		}).catch(e => {
			console.log(e);
			Swal.fire('Error', 'Uno de los campos es incorrecto' , 'error')
		})
	}
}

// Actualiza unicamente la nota que cambie, para las tarjetas del sidebar
export const refreshNote = (title, noteImg, content, _id) => ({
	type: types.notesUpdated,
	payload: {
		title, noteImg, content, _id
		// id,
		// // Garantizar el key que tenga el id en el componente
		// note: {
		// 	id,
		// 	...note
		// }
	}
})

// Subir archivos
export const startUploading = (file) => {
	// getState para saber la nota actual
	return async (dispatch, getState) => {
		Swal.fire({
			title: 'Cargando...',
			text: 'Espere por favor',
			allowOutsideClick: false,
			onBeforeOpen: () => {
				Swal.showLoading()
			}
		})

		const {active: activeNote, ...notes} = getState().notes
		const user = getState().auth
		const fileUrl = await fileUpload(file)

		// // Actualizar URL
		activeNote.noteImg = fileUrl
		dispatch(startSaveNote(activeNote, user, notes))

		// Despues del await
		Swal.close()
	}
}

// Borrar notas de firebase
export const startDeleting = (id, sendData) => {
	return async (dispatch, getState) => {

		const token = localStorage.getItem('token');
		fetch(`${url}/api/notes/${sendData.uid}`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-token': token
			},
			body: JSON.stringify(sendData),
		}).then((response) => {
			if (!response.status === 201) {
				Swal.fire('Error', 'Algo salio mal! :(' , 'error')
			}
			return response.json();
		}).then((response) => {
			const {currentUsuario} = response
			// let notas = {};
			// notas.title = active.title;
			// notas.content = active.content;
			// notas.noteImg = active.noteImg;
			// notas._id = active._id;
			dispatch(startLoadingNotes(currentUsuario.notas))
			Swal.fire('Saved', 'Borrado exitoso', 'success')
		}).catch(e => {
			console.log(e);
			Swal.fire('Error', 'Uno de los campos es incorrecto' , 'error')
		})
		dispatch(deleteNote(id))

	}
}

// Borrar nota del store(state)
export const deleteNote = (id) => ({
	type: types.notesDelete,
	payload: id
})

// Borrar todas las notas del store(state) al hacer Logout
export const noteLogout = () => ({
	type: types.notesLogoutCleaning,
})