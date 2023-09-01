import type {RequestEvent} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";
import {checkPremium} from "$lib/server/checkPremium.js";

export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split('?')[1]);

    if (!params.has('domain') || params.get('domain') === '') {
        return json({ error: 'missing domain name' }, { status: 400 });
    }

    const domain = params.get('domain')
    return json({premium: await checkPremium(domain ?? "")})
}