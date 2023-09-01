<script lang="ts">
    import SearchForm from '$lib/components/SearchForm.svelte';
    import fetcher from '$lib/fetcher.js';
    import { domain } from '$lib/stores.js';
    import './searchlist.css';
    import Loading from '$lib/components/Loading.svelte';
    import ResultsBox from "$lib/components/ResultsBox.svelte";
    import type { PriceResponse } from '$lib/types.js';

    // let results = [{"registrar":"GoDaddy","price":59.99,"url":"https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=speclang.io"},{"registrar":"NameSilo","price":39.99,"url":"https://www.namesilo.com/domain/search-domains?query=speclang.io"}]
    let results: Array<PriceResponse> = []
    let searched_domain: string | undefined = undefined;
    let loading = false;
    let available: boolean | undefined = undefined;
    let isPremium: boolean | undefined = undefined;

    results.sort((r1, r2) => r1.price - r2.price);

    async function findAvailability() {
        results = [];
        available = undefined;
        isPremium = undefined;

        if ($domain === '') {
            return;
        }
        loading = true;
        const res = await fetcher(`api/isAvailable?domain=${$domain}`).then((r) => r);
        searched_domain = $domain;
        if (!res.available) {
            available = false;
            loading = false;
        } else {
            available = true;
            await getPrices();
        }
    }

    async function getPrices() {
        const {premium} = await fetch(`api/isPremium?domain=${$domain}`).then(r => r.json())
        isPremium = premium;
        const res = await fetch(`api/prices?domain=${$domain}&premium=${isPremium}`).then(r => r.json())
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
            <b>{searched_domain}</b> is available!
            <br/>
            <div style="font-size: 16px">
            Please note that prices may vary on the registrar's page. Prices are listed as rates per year.
            </div>
        </div>
    </div>
    {#if isPremium}
        <div class='notice-box'>
            <div class='notice-text'>
                This is a <b>premium domain</b>; prices are marked up significantly, and not all registrar prices are listed here. Consider searching for something else.
            </div>
        </div>
    {/if}
{/if}

{#if results.length > 0}
    <ResultsBox results={results}/>
{/if}

{#if loading}
    <div style="text-align: center">
        <Loading />
    </div>
    {#if available}
        <p style='text-align: center'>Getting prices...</p>
    {:else}
        <p style='text-align: center'>Checking availability...</p>
    {/if}
{/if}
