import Http from '../../../services/HttpService';
import { getInternetStatus } from './getInternetStatus';
import { getUser, getHouse } from './dbQueries';
import { AsyncStorage } from 'react-native';

export const getStatsHelper = async ({}) => {
	const token = await AsyncStorage.getItem('AuthToken');
	const status = await getInternetStatus();
	try {
		if (+status === 1) {
			const response = Http.get('stats', {}, { headers: { 'access-token': token } });
			console.log('stats log', response);
			return response;
		} else {
			const userCount = await getUser();
			const houseCount = await getHouse();
			const response = {
				data: {
					person_count: userCount.length,
					house_count: houseCount.length,
				},
				ok: true,
			};
			return response;
		}
	} catch (error) {
		return error;
	}
};
