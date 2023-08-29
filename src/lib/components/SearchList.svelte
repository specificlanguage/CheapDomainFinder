<script lang="ts">
    import SearchForm from '$lib/components/SearchForm.svelte';
    import fetcher from '$lib/fetcher.js';
    import { domain } from '$lib/stores.js';
    import './searchlist.css';
    import Loading from '$lib/components/Loading.svelte';
    import Icon from '@iconify/svelte'
    import type { PriceResponse } from '$lib/types.js';

    // let results = [{"registrar":"GoDaddy","price":59.99,"url":"https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=speclang.io"},{"registrar":"NameSilo","price":39.99,"url":"https://www.namesilo.com/domain/search-domains?query=speclang.io"}]
    let results: Array<PriceResponse> = []
    let searched_domain: string | undefined = undefined;
    let loading = false;
    let available: boolean | undefined = undefined;

    results.sort((r1, r2) => r1.price - r2.price);

    async function findAvailability() {
        available = undefined;
        if ($domain === '') {
            return;
        }
        loading = true;
        const res = await fetcher(`api/isAvailable?domain=${$domain}`).then((r) => r);
        searched_domain = $domain;
        // console.log(res, res.isAvailable)
        if (!res.available) {
            available = false;
            loading = false;
        } else {
            available = true;
            await getPrices();
        }
    }

    async function getPrices() {
        const res = await fetch(`api/prices?domain=${$domain}`).then(r => r.json())
        res.prices.sort((r1, r2) => r1.price - r2.price);
        results = res.prices;
        loading = false;
    }

</script>

<div style="margin-bottom: 1em">
    <SearchForm handleClick={findAvailability} />
</div>


{#if !available && available !== undefined}
    <div class="unavailable-box">
        <div class="unavailable-text">
            Oops! {searched_domain} isn't available! Try another domain.
        </div>
    </div>
{:else if available}
    <div class="available-box">
        <div class="available-text">
            {searched_domain} is available!
        </div>
    </div>
{/if}

{#if results.length > 0}
    <div class='notice-box'>
        <div class='notice-text'>
            Please note that prices may vary on the registrar's page.
        </div>
    </div>
    <ul class='results-box'>
        {#each results as res, i}
            <hr style='position: inherit'/>
            <li class='single-result'>
                <div class='align-left'>
                    <img class='result-image' src={'/' + res.registrar + ".png"} alt={res.registrar}>
                </div>
                <div class='result-button align-right'>
                    {#if res.renewPrice !== undefined}
                        <div style="margin-bottom: 3rem"></div>
                    {/if}
                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                        <button class='result-button result-click'>
                            ${res.price}
                            <Icon icon="material-symbols:north-east" style='font-size: 18px;' />
                        </button>
                    </a>
                    {#if res.renewPrice !== undefined}
                        <p style="display: block; font-size: 14px">
                            Renews at ${res.renewPrice}
                        </p>
                    {/if}
                </div>
            </li>
            {#if i === results.length - 1}
                <hr style='position: inherit'/>
            {/if}
        {/each}
    </ul>
{/if}

{#if loading}
    <div style="text-align: center">
        <Loading />
    </div>
    {#if available}
        <p style='text-align: center'>Getting prices...</p>
    {/if}
{/if}
