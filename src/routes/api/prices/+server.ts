import type { RequestEvent } from '@sveltejs/kit';
import type { PriceResponse } from '$lib/types.js';

import { json } from '@sveltejs/kit';
import { queryGoDaddy, queryNameSilo } from '$lib/server/domainPriceCheck.js';

export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split('?')[1]);

    if (!params.has('domain') || params.get('domain') === '') {
        return json({ error: 'missing domain name' }, { status: 400 });
    }

    const prices: Array<PriceResponse> = [];

    const domain = params.get('domain') ?? '';

    const queries = [queryGoDaddy(domain), queryNameSilo(domain)]
    await Promise.allSettled(queries).then((results) => results.forEach((result) => {
        if(result.status == "fulfilled" && result.value != null) {
            prices.push(result.value);
        }
    }))

    return json({prices: prices}, {status: 200})
}
