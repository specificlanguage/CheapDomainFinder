<script lang="ts">
    import SearchForm from "$lib/components/SearchForm.svelte";
    import fetcher from "$lib/fetcher.js";
    import {domain} from "$lib/stores.js";

    function findAvailability() {
        if($domain != ""){
            return
        }
        fetcher(`api/isAvailable?domain=${$domain}`).then(r => console.log(r))
    }

</script>

<SearchForm handleClick={findAvailability}/>