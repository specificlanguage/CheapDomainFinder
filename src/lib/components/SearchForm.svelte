<script lang="ts">

    import {domain} from "../stores.js";

    let domain_name: string;
    export let handleClick: () => void;

</script>


<form>
    <input class="domain-input" type="text" id="domain" name="domain" placeholder="Enter domain..." required bind:value={$domain}/>
    <button class="submit-button" type="submit" on:click={handleClick}>Submit</button>
</form>

<style>

    input {
        height: 75px;
        width: 50%;
        font-size: 24px;
        border-radius: 0.75rem;
    }

    button.submit-button {
        display: inline;
        font-size: 24px;
        height: 75px;
        border-radius: 0.75rem;
    }

</style>