import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Link} from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { startLoginEmailPassword } from '../../actions/auth'
import validator from 'validator'
import { removeError, setError } from '../../actions/ui'

export const LoginScreen = () => {

	// React-Redux
	const dispatch = useDispatch()
	const {msgError} = useSelector( state => state.ui)
	// Del state extraigo el ui
	const {loading} = useSelector( state => state.ui)

	const [formValues, handleInputChange] = useForm({
		email: 'arthicc@gmail.com',
		password: '33112233'
	})

	const {email, password} = formValues;

	const handleLogin = (e) => {
		e.preventDefault()
		// Viene de los actions/auth.js
		if(isFormValid()) {
			dispatch(startLoginEmailPassword(email, password))
		}
	}

	// Validación de los datos
	const isFormValid = () => {
		if (!validator.isEmail(email)) {
			dispatch(setError('El correo no es válido'))
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
			<h3 className="auth__title">Iniciar Sessión</h3>
			<form
				onSubmit={handleLogin}
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
					placeholder="Email"
					name="email"
					className="auth__input"
					autoComplete="off"
					value={email}
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
				<button
					type="submit"
					className="btn btn-primary btn-block"
					disabled={loading}
				>
					Ingresar
				</button>

				<Link
					to="/auth/register"
					className="link"
				>
					Crear nueva cuenta
				</Link>
			</form>
		</>
	)
}
