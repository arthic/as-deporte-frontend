import React from 'react'
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'

import { useForm } from '../../hooks/useForm';
import validator from 'validator'
import { removeError, setError } from '../../actions/ui';
import { startRegisterWithEmailPasswordName } from '../../actions/auth';

export const RegisterScreen = () => {
	/*
		{
			name: 'Aaron',
			email: 'aaron.lls.dev@gmail.com',
			password: '12345',
			password2: '12345'
		}

		// useForm

		const handleRegistrer = (e) {
			console.log(name, email,password, password2)
		}

	*/
	// React-Redux
	const dispatch = useDispatch()
	// Dispara un callback que trae el state
	// Del state extraigo el ui
	const {msgError} = useSelector( state => state.ui)

	// console.log(msgError);

	const [formValues, handleInputChange] = useForm({
		nombre: "Arthic",
		correo: "arthic@gmail.com",
		password: "33112233",
		imagen: "",
		direccion: "Tepocatl 33",
		ciudad: "Ciudad de México",
		pais: "México",
		telefono: "5525151137",
		notas: []
	})

	const {
		nombre, correo, password, direccion,
		ciudad, pais, telefono,
	} = formValues;

	const handleRegistrer = (e) => {
		e.preventDefault()
		// console.log(name, email,password, password2)
		if(isFormValid()) {
			dispatch(startRegisterWithEmailPasswordName(formValues))
			// console.log('Formulario correcto');
		}
	}

	const isFormValid = () => {
		if(nombre.trim().length === 0 ) {
			dispatch(setError('Name is required'))
			return false

			// src Validator
		} else if (!validator.isEmail(correo)) {
			dispatch(setError('Email is not valid'))
			return false
		} else if (password.length < 5) {
			dispatch(setError('La constraseña debe tener mínimo 6 caracteres'))
			return false
		}
		dispatch(removeError())
		return true
	}

	return (
		<>
			<h3 className="auth__title">Ingresa tus datos</h3>
			<form
				onSubmit={handleRegistrer}
				className="animate__animated animate__fadeIn animate__faster"
			>
				{
					msgError &&
					(
						<div className="auth__alert-error">
							{msgError}
						</div>
					)
				}
				<input
					type="text"
					placeholder="Name"
					name="nombre"
					className="auth__input"
					autoComplete="off"
					value={nombre}
					onChange={handleInputChange}
				/>
				<input
					type="text"
					placeholder="Email"
					name="correo"
					className="auth__input"
					autoComplete="off"
					value={correo}
					onChange={handleInputChange}
				/>
				<input
					type="password"
					placeholder="Password"
					name="password"
					className="auth__input"
					autoComplete="off"
					value={password}
					onChange={handleInputChange}
				/>
				<input
					type="text"
					placeholder="direccion"
					name="direccion"
					className="auth__input"
					autoComplete="off"
					value={direccion}
					onChange={handleInputChange}
				/>
				<input
					type="text"
					placeholder="ciudad"
					name="ciudad"
					className="auth__input"
					autoComplete="off"
					value={ciudad}
					onChange={handleInputChange}
				/>
				<input
					type="text"
					placeholder="pais"
					name="pais"
					className="auth__input"
					autoComplete="off"
					value={pais}
					onChange={handleInputChange}
				/>
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
					Registrar
				</button>

				<Link
					to="/auth/login"
					className="link"
				>
					Ya tienes una cuenta?
				</Link>
			</form>
		</>
	)
}
