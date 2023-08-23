<script lang="ts">

    import {domain} from "../stores.js";

    export let handleClick: () => void;

</script>


<form>
    <input class="domain-input" type="text" id="domain" name="domain" placeholder="Enter domain..." required bind:value={$domain}/>
    <button class="submit-button" type="submit" on:click|preventDefault={handleClick}>Search</button>
</form>

<style>

    form {
        margin-left: 1em;
        margin-right: 1em;
    }

    input {
        height: 75px;
        width: 75%;
        font-size: 24px;
        border-radius: 0.75rem;
    }

    button.submit-button {
        display: inline;
        font-size: 24px;
        width: 20%;
        height: 75px;
        border-radius: 0.75rem;
    }

</style>