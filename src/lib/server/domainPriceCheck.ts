import {
    GODADDY_API_KEY,
    GODADDY_API_SECRET,
    NAMECOM_API_KEY,
    NAMECOM_API_USERNAME,
    NAMESILO_API_KEY
} from '$env/static/private';
import { dev } from '$app/environment';
import { XMLParser } from 'fast-xml-parser';
import { parseDomain, ParseResultType } from 'parse-domain';

import fetcher from '$lib/fetcher.js';
import type { PriceResponse } from '$lib/types.js';
import { queryForTLD } from '$lib/server/callDB.js';

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
                    registrar: 'GoDaddy',
                    price: price / 1000000,
                    url: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${domain_name}`
                })
            };
        })
        .catch((e) => {
            console.log(e);
            return null;
        });
}

export async function queryNameSilo(domain_name: string): Promise<PriceResponse | null> {
    // Somehow, it's easier not to use the sandbox for this one.
    const URL =
        `https://www.namesilo.com/apibatch/checkRegisterAvailability?version=1&type=xml&key=${NAMESILO_API_KEY}&domains=` +
        domain_name;
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
    });

    // This makes it a little easier to get around a possible 210.
    const filterHeaders = new Headers();
    filterHeaders.append('User-Agent', 'CheapDomainFinder Website');

    const resp = await fetch(URL, { headers: filterHeaders }).then((r) => r.text());
    if (resp.includes('Invalid Request')) {
        return null;
    }
    const output = parser.parse(resp).namesilo.reply;
    if (output.code != 300 || output.detail != 'success' || !output.available) {
        console.log(output);
        return null;
    }
    const available = output.available;

    return {
        registrar: 'NameSilo',
        price: parseFloat(available.domain['@_price']),
        url: `https://www.namesilo.com/domain/search-domains?query=${domain_name}`,
        ...(available['@_premium'] === '1' && {
            premium: true
        })
    };
}

export async function queryNameDotCom(domain_name: string): Promise<PriceResponse | null> {
    const URL = `https://api.name.com/v4/domains/${domain_name}:getPricing`;
    // console.log(URL)
    const headers = new Headers();
    headers.append(
        'Authorization',
        'Basic ' + Buffer.from(NAMECOM_API_USERNAME + ':' + NAMECOM_API_KEY).toString('base64')
    );

    return await fetcher(URL, { headers })
        .then((r) => {
            // console.log(r);
            const { purchasePrice, renewalPrice, premium } = r;
            return <PriceResponse>{
                registrar: 'Name.com',
                price: purchasePrice,
                renewPrice: renewalPrice,
                url: `https://www.name.com/domain/search/${domain_name}`,
                ...(premium && { premium })
            };
        })
        .catch((e) => {
            console.log(e);
            return null;
        });
}

export async function queryNamecheap(domain_name: string): Promise<PriceResponse | null> {
    return queryRegistrarInDB(
        domain_name,
        'namecheap',
        'Namecheap',
        `https://www.namecheap.com/domains/registration/results/?domain=`,
        true
    );
}

export async function queryHover(domain_name: string): Promise<PriceResponse | null> {
    return queryRegistrarInDB(
        domain_name,
        'hover',
        'Hover',
        `https://www.hover.com/domains/results?q=`,
        true
    );
}

export async function querySquarespace(domain_name: string): Promise<PriceResponse | null> {
    return queryRegistrarInDB(
        domain_name,
        'squarespace',
        'Squarespace',
        `https://domains.squarespace.com/`,
        false
    );
}

export async function queryCloudflare(domain_name: string): Promise<PriceResponse | null> {
    const resp = await queryRegistrarInDB(
        domain_name,
        'cloudflare',
        'Cloudflare',
        `https://dash.cloudflare.com/`,
        false
    );
    if (resp != null) {
        resp.price = resp.price + 0.18;
    }
    return resp;
}

export async function queryRegistrarInDB(
    domain_name: string,
    registrarInDB: string,
    return_registrar: string,
    base_end_url: string,
    addDomainAtEnd: boolean
): Promise<PriceResponse | null> {
    const parseResult = parseDomain(domain_name);
    if (parseResult.type !== ParseResultType.Listed) {
        return null;
    }

    const { topLevelDomains } = parseResult;
    const tld = topLevelDomains.join('');
    const row = await queryForTLD(registrarInDB, tld)
        .then((row) => row)
        .catch((e) => {
            console.log(e);
            return null;
        });

    if (row == null) {
        return null;
    }

    const url = base_end_url + (addDomainAtEnd ? domain_name : '');

    return {
        registrar: return_registrar,
        price: row.register,
        ...(row.renew != row.register && {
            renewPrice: row.renew
        }),
        url
    };
}
