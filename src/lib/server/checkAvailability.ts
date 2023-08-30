import { parseDomain, ParseResultType } from 'parse-domain';

const options = {
    method: 'GET'
};

export async function checkAvailability(domain: string): Promise<boolean> {
    const parseResult = parseDomain(domain);
    if (parseResult.type !== ParseResultType.Listed) {
        return false;
    }

    const url = `https://www.rdap.net/domain/${domain}`;
    try {
        const response = await fetch(url, options);
        if (response.status == 404) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}
