import type {RequestEvent} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split("?")[1]);
    console.log(params.entries())
    if(params.has("domain")){
        const domain = params.get("domain")
        console.log(domain)
        return json({domain}, {status: 201})
    } else {
        return json({error: "missing domain name"}, {status: 400})
    }
}


