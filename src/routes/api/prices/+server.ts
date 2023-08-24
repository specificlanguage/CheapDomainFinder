import type { RequestEvent } from '@sveltejs/kit';
import type { PriceResponse } from '$lib/server/domainPriceCheck.js';

import { json } from '@sveltejs/kit';
import { queryGoDaddy } from '$lib/server/domainPriceCheck.js';

export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split('?')[1]);

    if (!params.has('domain') || params.get('domain') === '') {
        return json({ error: 'missing domain name' }, { status: 400 });
    }

    const prices: PriceResponse[] = [];

    const domain = params.get('domain') ?? '';

    prices.push(await queryGoDaddy(domain));
}
