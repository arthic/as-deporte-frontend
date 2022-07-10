import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startSaveNote, startUploading } from '../../actions/notes'

export const NotesAppBar = () => {

	const dispatch = useDispatch()

	// Extraemos del estate la nota activa
	const {active, ...notes} = useSelector(state => state.notes)
	const user = useSelector( state => state.auth)
	useEffect(() => {
	}, [user, active]);

	// const activeDate = moment(active.date)
	const handleSave = () => {
		dispatch(startSaveNote(active, user, notes))
	}

	const handlePictureClick = () => {
		document.querySelector('#fileSelector').click()
	}

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			dispatch(startUploading(file))
		}
	}

	return (
		<div className="notes__appbar">
			<input
				type="file"
				id="fileSelector"
				name="file"
				style={{display: "none"}}
				onChange={handleFileChange}
			/>

			<div className="notes__appbar-icons">
				<i
					className="far fa-image"
					onClick={handlePictureClick}
					></i>
				<i
					className="fas fa-save"
					onClick={handleSave}
				></i>
			</div>
		</div>
	)
}
