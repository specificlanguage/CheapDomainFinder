function updateOptions(options: RequestInit) {
    const update: RequestInit = {...options};
    if (localStorage.getItem("uuid")) {
        update.headers = {
            ...update.headers,
            'Authorization': `${localStorage.getItem("uuid")}`
        }
    }

    if(typeof options.body == "object"){
        update.headers = {
            ...update.headers,
            'Content-Type': "application/json"
        }
    }


    return update
}

export default async function fetcher(path: string, options?: RequestInit) {
    return fetch(path, updateOptions(options ?? {})).then(async res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    })
}