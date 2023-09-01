import {DNSIMPLE_ACCOUNT_ID, DNSIMPLE_API_KEY} from "$env/static/private";
import fetcher from "$lib/fetcher.js";


export async function checkPremium(domain: string): Promise<boolean> {
    const URL = `https://api.dnsimple.com/v2/${DNSIMPLE_ACCOUNT_ID}/register/domains/${domain}`;
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${DNSIMPLE_API_KEY}`)
    return await fetcher(URL, {headers}).then(r => {
        const {premium} = r.data;
        return premium ?? false;
    }).catch(e => {
        console.log(e);
        return false;
    })
}