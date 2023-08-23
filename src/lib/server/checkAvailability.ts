import { DOMAIN_CHECKER_API_KEY } from '$env/static/private';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': DOMAIN_CHECKER_API_KEY,
    'X-RapidAPI-Host': 'domain-checker7.p.rapidapi.com'
  }
};

export async function checkAvailability (domain: string) {
  const url = `https://domain-checker7.p.rapidapi.com/whois?domain=${domain}`;
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    return error;
  }
}

