export default async function fetcher(path: string, options?: RequestInit) {
    return fetch(path, options).then(async res => {
        const data = await res.json()
        if (!res.ok) {
            throw new Error(JSON.stringify(data));
        }
        return data;
    })
}