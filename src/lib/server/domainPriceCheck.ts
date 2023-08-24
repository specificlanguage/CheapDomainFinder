import { GODADDY_API_KEY, GODADDY_API_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import fetcher from '$lib/fetcher.js';

export interface PriceResponse {
    price?: number;
    url?: string;
}

export async function queryGoDaddy(domain_name: string): Promise<PriceResponse> {
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
            return {
                ...(available && {
                    price: price / 1000000,
                    url: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${domain_name}`
                })
            };
        })
        .catch((r) => {
            return {};
        });
}