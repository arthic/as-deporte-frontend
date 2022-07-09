import React, { useEffect, useState } from 'react'
import {
	BrowserRouter as Router,
	Redirect,
	Switch
} from 'react-router-dom'

import {useDispatch, useSelector} from 'react-redux'

// import firebase from '../../firebase/firebase-config'
import { login } from '../../actions/auth'
import { startLoadingNotes } from '../../actions/notes'

import { AuthRouter } from './AuthRouter'
import { JournalScreen } from '../journal/JournalScreen'

import { PublicRoute } from './PublicRoute'
import { PrivateRoute } from './PrivateRoute'
import { Account } from '../account/Account'

export const AppRouter = () => {

	// React-Redux
	const dispatch = useDispatch()
	const {uid, name, data} = useSelector( state => state.auth)

	const [isLoggedIn, setIsLoggedIn] = useState(false)

	// Mantener el estado de la autenticación al recargar
	// Como la dependencia [] está vacía, solo se ejecuta una vez
	// Pero siempre se ejecuta cada que canbie el estado de la autenticación
	useEffect(() => {
		/*Crea un observable  un tipo de objeto especial que se puede disparar
		mas de una vez (el auth cambia, se autentica se refresca el usuario
		siempre se dispara el observable )*/
			if(uid) {
				dispatch(login(uid, name, data))
				setIsLoggedIn(true)

				dispatch(startLoadingNotes(data.notas))
			} else {
				setIsLoggedIn(false)
			}
		// No va cambiar realmente pero evitamos el warning
	}, [uid, dispatch, name, data])

	return (
		<>
			<Router>
				<div>
					<Switch>
						<PublicRoute
							path="/auth"
							component={AuthRouter}
							isAutenticated={isLoggedIn}
						/>
						<PrivateRoute
							exact
							path="/"
							component={JournalScreen}
							isAutenticated={isLoggedIn}
						/>
						<PrivateRoute
							exact
							path="/account"
							component={Account}
							isAutenticated={isLoggedIn}
						/>
						{/* Muy importante */}
						<Redirect to="/auth/login" />
					</Switch>
				</div>
			</Router>
		</>
	)
}
