// import { db } from "../firebase/firebase-config"

export const loadNotes = async (notas) => {
	// const notesSnap = await db.collection(`${uid}/journal/notes`).get()
	const notes = []
	notas.map(note => notes.push(note))
	/* La data se encuentra dentro del propotipe de cada uno de los
	docs y hay una funcion data() para estraer la data vaya la redundancia*/
	// console.log(notesSnap);
	// notesSnap.forEach(snapHijo => {
	// 	notes.push({
	// 		id: snapHijo.id,
	// 		// El resto de los datos
	// 		...snapHijo.data()
	// 	})
	// })
	return notes
}