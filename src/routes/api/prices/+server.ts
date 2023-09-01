import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { PriceResponse } from '$lib/types.js';
import {
    queryCloudflare,
    queryGoDaddy,
    queryHover,
    queryNamecheap,
    queryNameDotCom,
    queryNameSilo,
    querySquarespace
} from '$lib/server/domainPriceCheck.js';

export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split('?')[1]);

    if (!params.has('domain') || params.get('domain') === '') {
        return json({ error: 'missing domain name' }, { status: 400 });
    }

    const prices: Array<PriceResponse> = [];

    const domain = params.get('domain') ?? '';
    const isPremium = params.get('premium') ?? false;

    const queries = [
        queryGoDaddy(domain),
        queryNameSilo(domain),
        queryNameDotCom(domain)
    ];

    // The database doesn't always give correct prices for premium domains.
    if(!isPremium){
        queries.push(
            queryNamecheap(domain),
            queryHover(domain),
            querySquarespace(domain),
            queryCloudflare(domain)
        )
    }

    await Promise.allSettled(queries).then((results) =>
        results.forEach((result) => {
            if (result.status == 'fulfilled' && result.value != null) {
                if (result.value.price) {
                    prices.push(result.value);
                }
            }
        })
    );

    return json({ prices: prices }, { status: 200 });
}
