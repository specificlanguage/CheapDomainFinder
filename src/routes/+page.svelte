<script>
    import SearchList from '$lib/components/SearchList.svelte';
    import HomeButton from '$lib/components/HomeButton.svelte';
</script>

<HomeButton />
<main class="container">
    <h1>Domain Finder</h1>
    <h3>Find a domain for a great price.</h3>
</main>
<SearchList />

<style>
    .container {
        align-content: center;
        margin-bottom: 2em;
        height: fit-content;
    }
</style>
