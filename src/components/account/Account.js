import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import Swal from 'sweetalert2'
import { removeError, setError } from '../../actions/ui';
import { updateData } from '../../actions/auth';
import { startLoadingNotes } from '../../actions/notes';
import validator from 'validator'
import { url } from '../../helpers/getAPI';
import { fileUpload } from '../../helpers/fileUpload';

export const Account = () => {
    const dispatch = useDispatch()
    const {data, name, uid} = useSelector(state => state.auth)
    const {msgError} = useSelector( state => state.ui)
    const {notes} = useSelector( state => state.notes)

    const [formValues, handleInputChange] = useForm(data)
    data['nombre']= name
    const {ciudad, correo, direccion, imagen, pais, telefono, nombre} = formValues
    const [image, setImage] = useState(imagen);

    const handleSubmit = (e) => {
		e.preventDefault()
		if(isFormValid()) {
            const token = localStorage.getItem('token');
			fetch(`${url}/api/notes/${uid}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify({...formValues, notas:notes}),
            }).then((response) => {
                if (!response.status === 200) {
                    Swal.fire('Error', 'Algo salio mal! :(' , 'error')
                }
                return response.json();
            }).then((response) => {
                const {currentUsuario} = response
                const {uid, nombre, ...data} = currentUsuario
                dispatch(updateData( nombre, data))
                dispatch(startLoadingNotes(currentUsuario.notas))
                Swal.fire('Saved', 'LISTO!!! :)', 'success')
            }).catch(e => {
                console.log(e);
                Swal.fire('Error', 'Uno de los campos es incorrecto' , 'error')
            })
		}
	}

    const isFormValid = () => {
		if(name.trim().length === 0 ) {
			dispatch(setError('Name is required'))
			return false
		} else if (!validator.isEmail(correo)) {
			dispatch(setError('Email is not valid'))
			return false
		}
		dispatch(removeError())
		return true
	}

    const handlePictureClick = () => {
		document.querySelector('#fileSelector').click()
	}

	const handleFileChange = async (e) => {
		const file = e.target.files[0]
		if (file) {
			const fileUrl = await fileUpload(file)
            setImage(fileUrl)
            data['imagen']= fileUrl
		}
	}

    return (
        <div className="account">
            <Link
                to="/"
                className="link"
            >
                <i className="fa-solid fa-arrow-left-long row"></i>
                Regresar
            </Link>
            <div className="img-container">
            {
                (image.length > 0) ? (
                    <div className="">
                        <img
                            src={image}
                            alt="imagen"
                            />
                    </div>
                ) : (
                    <i className="fa-solid fa-user"></i>
                )
            }
            </div>
            {
                msgError &&
                (
                    <div className="auth__alert-error">
                        {msgError}
                    </div>
                )
            }
            <button
                onClick={handlePictureClick}
            >
                <i className="far fa-image"></i>
                Cambiar foto
            </button>
            <input
                type="file"
                id="fileSelector"
                name="file"
                style={{display: "none"}}
                onChange={handleFileChange}
            />
            <form
				onSubmit={handleSubmit}
				className="animate__animated animate__fadeIn animate__faster"
			>
                <label htmlFor="nombre">Nombre: </label>
				<input
					type="text"
					placeholder="Name"
					name="nombre"
					className="auth__input"
					autoComplete="off"
					value={nombre}
					onChange={handleInputChange}
				/>
                <label htmlFor="correo">Correo: </label>
				<input
					type="text"
					placeholder="Email"
					name="correo"
					className="auth__input"
					autoComplete="off"
					value={correo}
					onChange={handleInputChange}
				/>
                <label htmlFor="direccion">Dirección: </label>
				<input
					type="text"
					placeholder="direccion"
					name="direccion"
					className="auth__input"
					autoComplete="off"
					value={direccion}
					onChange={handleInputChange}
				/>
                <label htmlFor="ciudad">Ciudad: </label>
				<input
					type="text"
					placeholder="ciudad"
					name="ciudad"
					className="auth__input"
					autoComplete="off"
					value={ciudad}
					onChange={handleInputChange}
				/>
                <label htmlFor="pais">País: </label>
				<input
					type="text"
					placeholder="pais"
					name="pais"
					className="auth__input"
					autoComplete="off"
					value={pais}
					onChange={handleInputChange}
				/>
                <label htmlFor="telefono">Teléfono: </label>
				<input
					type="text"
					placeholder="telefono"
					name="telefono"
					className="auth__input"
					autoComplete="off"
					value={telefono}
					onChange={handleInputChange}
				/>
				<button
					type="submit"
					className="btn btn-primary btn-block mb-5"
				>
					Guardar cambios
				</button>
			</form>
        </div>
    )
}
