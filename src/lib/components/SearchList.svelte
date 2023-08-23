<script lang="ts">
    import SearchForm from "$lib/components/SearchForm.svelte";
    import fetcher from "$lib/fetcher.js";
    import {domain} from "$lib/stores.js";
    import "./searchlist.css";
    import Loading from "$lib/components/Loading.svelte";

    let results = []
    let searched_domain: string | undefined = undefined
    let loading = false;
    let available: boolean | undefined = undefined

    async function findAvailability() {
        available = undefined;
        if($domain === ""){
            return
        }
        loading = true;
        const res = await fetcher(`api/isAvailable?domain=${$domain}`).then(r => r)
        searched_domain = $domain
        // console.log(res, res.isAvailable)
        if(!res.available){
            available = false;
            loading = false;
        } else {
            available = true;
        }
    }

    async function getPrices() {






        loading = false;
    }

</script>

<SearchForm handleClick={findAvailability}/>

<div style="margin-bottom: 1em"></div>

{#if !available && available !== undefined}
<div class="unavailable-box">
    <div class="unavailable-text">
        Oops! {searched_domain} isn't available! Try another domain.
    </div>
</div>
{:else}
    {#if available}
    <div class="available-box">
        <div class="available-text">
            {searched_domain} is available!
        </div>
    </div>
    {/if}
{/if}

{#if results !== []}
    <ul>
        <!--{#each Object.keys(results) as site}-->
        <!--    <li>-->
        <!--        <div>-->
        <!--            <a href="https://google.com">{site}: ${results[site]}</a>-->
        <!--        </div>-->
        <!--    </li>-->
        <!--{/each}-->
    </ul>
{/if}

{#if loading}
    <div style="text-align: center">
    <Loading/>
    </div>
{/if}
