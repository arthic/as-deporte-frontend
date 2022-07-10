export const loadNotes = async (notas) => {
	const notes = []
	notas.map(note => notes.push(note))

	return notes
}