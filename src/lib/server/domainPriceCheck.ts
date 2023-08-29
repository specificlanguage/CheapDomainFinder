import { GODADDY_API_KEY, GODADDY_API_SECRET, NAMESILO_API_KEY } from '$env/static/private';
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
        .catch(() => null);
}

export async function queryNameSilo(domain_name: string): Promise<PriceResponse | null> {
    // Somehow, it's easier not to use the sandbox for this one.
    const URL = `https://www.namesilo.com/apibatch/checkRegisterAvailability?version=1&type=xml&key=${NAMESILO_API_KEY}&domains=` + domain_name
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix : "@_",
    })

    // This makes it a little easier to get around a possible 210.
    const filterHeaders = new Headers()
    filterHeaders.append("User-Agent", "CheapDomainFinder Website");

    const resp = await fetch(URL, {headers: filterHeaders}).then(r => r.text());
    if(resp.includes("Invalid Request")){
        return null;
    }
    const output = parser.parse(resp).namesilo.reply;
    if(output.code != 300 || output.detail != "success" || !output.available){
        console.log(output);
        return null;
    }
    const available = output.available;

    return {
        registrar: "NameSilo",
        price: parseFloat(available.domain['@_price']),
        url: `https://www.namesilo.com/domain/search-domains?query=${domain_name}`
    }
}

export async function queryNamecheap(domain_name: string): Promise<PriceResponse | null> {

    const parseResult = parseDomain(domain_name)
    if (parseResult.type !== ParseResultType.Listed) {
        return null;
    }

    const {topLevelDomains} = parseResult;
    const tld = topLevelDomains.join(".")
    const row = await queryForTLD("namecheap", tld).then(row => row).catch(e => null)
    if (row == null){
        return null;
    }

    return {
        registrar: "Namecheap",
        price: row.register,
        renewPrice: row.renew,
        url: `https://www.namecheap.com/domains/registration/results/?domain=${domain_name}`
    }

}

export async function queryHover(domain_name: string): Promise<PriceResponse | null> {

    const parseResult = parseDomain(domain_name)
    if (parseResult.type !== ParseResultType.Listed) {
        return null;
    }

    const {topLevelDomains} = parseResult;
    const tld = topLevelDomains.join(".")
    const row = await queryForTLD("hover", tld).then(row => row).catch(e => null)
    if (row == null){
        return null;
    }

    return {
        registrar: "Hover",
        price: row.register,
        renewPrice: row.renew,
        url: `https://www.hover.com/domains/results?q=${domain_name}`
    }

}