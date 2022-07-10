import React from 'react'
import { useDispatch } from 'react-redux'

import {activeNote} from '../../actions/notes'

export const JournalEntry = ({title, noteImg, content, _id}) => {

	// React-Redux
	const dispatch = useDispatch()

	const handleEntryClick = () => {
		dispatch(
			activeNote(title, noteImg, content, _id)
		)
	}

	return (
		<div
			className="journal__entry pointer animate__animated animate__fadeIn animate__faster"
			onClick={handleEntryClick}
		>
			{
				noteImg &&
				<div
					className="journal__entry-picture"
					style={{
						backgroundSize: 'cover',
						backgroundImage: `url(${noteImg})`
					}}
				>
				</div>
			}

			<div className="journal__entry-body">
				<p className="journal__entry-title">
					{title}
				</p>
				<p className="journal__entry-content">
					{content}
				</p>
			</div>
		</div>
	)
}
