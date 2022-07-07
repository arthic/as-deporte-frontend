import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { activeNote, startDeleting } from '../../actions/notes'
import { useForm } from '../../hooks/useForm'

import { NotesAppBar } from './NotesAppBar'

export const NoteScreen = () => {

	const dispatch = useDispatch()

	const {active: note} = useSelector(state => state.notes)
	// Custom
	const [formValues, handleInputChange, reset] = useForm(note)
	const {title, noteImg, content, _id} = formValues

	// Hook-React alamcena una var mutable que no redibuja todo el componente
	const activeId = useRef(note._id)

	// Manejar vista de la nota
	useEffect(() => {
		// Si es diferente de
		if(note._id !== activeId.current){
			reset(note)
			activeId.current = note._id
		}
	}, [note, reset])

	// Actualizar valores en el state
	useEffect(() => {
		dispatch(activeNote(title, noteImg, content, _id))
	}, [title, noteImg, content, _id, dispatch])

	const handleDelete = () => {
		dispatch(startDeleting(_id))
	}

	return (
		<div className="notes__main-content">

			<NotesAppBar/>

			<div className="notes__content">
				<input
					type="text"
					placeholder="Que paso hoy?"
					className="notes__title-input"
					autoComplete="off"
					name="title"
					value={title}
					onChange={handleInputChange}
				/>
				<textarea
					placeholder="..."
					className="notes__textarea"
					name="content"
					value={content}
					onChange={handleInputChange}
				></textarea>
				{
					(noteImg)
					&& (
						<div className="notes__image">
							<img
							src={noteImg}
							alt="imagen"
							/>
						</div>
					)
				}
			</div>

			<button
				className="btn btn-danger"
				onClick={handleDelete}
			>Borrar <i className="fas fa-trash"></i>
			</button>

		</div>
	)
}
