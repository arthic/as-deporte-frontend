import { types } from "../types/types";
/*
{
	uid: 'asjksdjkasjkasdj',
	name: 'Arthic'
}
*/

export const authReducer = (state = {}, action) => {

	switch (action.type) {
		case types.login:
			return {
				uid: action.payload.uid,
				name: action.payload.displayName,
				data: action.payload.data
			}

		case types.updateData:
			return {
				uid: state.uid,
				name: action.payload.displayName,
				data: action.payload.data
			}

		case types.logout:
			return {}

		default:
			return state;
	}
}