import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { checkAvailability } from '$lib/server/checkAvailability.js';

/** @type {import('./$types').RequestHandler} */
/**
 * Returns a response checking whether a given domain is available or not.
 * @param request - A Request with URL parameters of "domain".
 * @constructor
 */
export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split('?')[1]);
    if (params.has('domain') && params.get('domain') !== '') {
        const domain = params.get('domain') ?? '';
        const { available } = await checkAvailability(domain);
        return json({ available }, { status: 200 });
    } else {
        return json({ error: 'missing domain name' }, { status: 400 });
    }
}
