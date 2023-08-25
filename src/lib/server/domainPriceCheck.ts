import {
    GODADDY_API_KEY,
    GODADDY_API_SECRET,
    NAMESILO_API_KEY
} from '$env/static/private';
import { dev } from '$app/environment';
import fetcher from '$lib/fetcher.js';
import { XMLParser } from 'fast-xml-parser';

export interface PriceResponse {
    price: number;
    url: string;
}

export async function queryGoDaddy(domain_name: string): Promise<PriceResponse | null> {
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
            return null;
        });
}

export async function queryNameSilo(domain_name: string): Promise<PriceResponse | null> {
    // Somehow, it's easier not to use the sandbox for this one.
    const BASE_URL = `https://www.namesilo.com/api/checkRegisterAvailability?version=1&type=xml&key=${NAMESILO_API_KEY}`
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix : "@_",
    })

    const resp = await fetch(BASE_URL + `&domains=${domain_name}`).then(r => r.text());
    if(resp.includes("Invalid Request")){
        return null;
    }
    const output = parser.parse(resp).namesilo.reply;
    if(output.code >= 400) {
        return null;
    }
    const available = output.available;

    return {
        price: parseFloat(available.domain['@_price']),
        url: `https://www.namesilo.com/domain/search-domains?query=${domain_name}`
    }
}