import { DOMAIN_CHECKER_API_KEY } from '$env/static/private';

const options = {
    method: 'GET',
};

export async function checkAvailability(domain: string): Promise<boolean> {
    const url = `https://www.rdap.net/domain/${domain}`;
    try {
        const response = await fetch(url, options);
        console.log(response);
        if(response.status == 404){
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
