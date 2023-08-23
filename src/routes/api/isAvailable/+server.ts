import type {RequestEvent} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {queryGoDaddy} from "$lib/server/domainPriceCheck.js";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }: RequestEvent) {
    const params = new URLSearchParams(request.url.split("?")[1]);
    if(params.has("domain") && params.get("domain") !== "") {
        const domain = params.get("domain") ?? ""
        const {isAvailable}= await queryGoDaddy(domain);
        return json({isAvailable}, {status: 201})
    } else {
        return json({error: "missing domain name"}, {status: 400})
    }
}




