import type {RequestEvent} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {queryGoDaddy} from "$lib/server/domainPriceCheck.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split("?")[1]);
    console.log(params.entries())
    if(params.has("domain")){
        const domain = params.get("domain") ?? ""
        const resp = await queryGoDaddy(domain);
        console.log(resp);
        return json({domain}, {status: 201})
    } else {
        return json({error: "missing domain name"}, {status: 400})
    }
}




