<script lang="ts">
    import SearchForm from "$lib/components/SearchForm.svelte";
    import fetcher from "$lib/fetcher.js";
    import {domain} from "$lib/stores.js";
    import "./searchlist.css";

    let results = {}
    let isAvailable: boolean | undefined = undefined
    let searched_domain: string | undefined = undefined

    async function findAvailability() {
        if($domain === ""){
            return
        }
        const res = await fetcher(`api/isAvailable?domain=${$domain}`).then(r => r)
        searched_domain = $domain
        if(res.isAvailable === false){
            isAvailable = false;
        } else {
            isAvailable = true;
        }
    }

</script>

<SearchForm handleClick={findAvailability}/>

{#if isAvailable === false}
<div class="unavailable-box">
    <div class="unavailable-text">
        Oops! {searched_domain} isn't available! Try something else.
    </div>
</div>
{/if}

{#if results !== {}}
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
