import { GODADDY_API_KEY, GODADDY_API_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import fetcher from '$lib/fetcher.js';

export async function queryGoDaddy(domain_name: string) {
	let BASE_URL = 'https://api.ote-godaddy.com/';
	if (!dev) {
		BASE_URL = 'https://api.godaddy.com';
	}

	const URL = BASE_URL + `v1/domains/available?domain=${domain_name}`;
	const headers = new Headers();
	headers.append('Authorization', `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`);

	return fetcher(URL, { headers: headers })
		.then(async (r) => {
			const { available, price, currency } = r;
			console.log(r);
			return {
				isAvailable: available,
				...(available && {
					price: price
				})
			};
		})
		.catch((r) => {
			return {
				error: JSON.parse(r.error)
			};
		});
}