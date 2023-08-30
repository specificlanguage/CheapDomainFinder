<script lang="ts">
    import Icon from '@iconify/svelte';

    export let results;
</script>

<ul class="results-box">
    {#each results as res, i}
        <hr style="position: inherit" />
        <li class="single-result">
            <div class="align-left">
                <img class="result-image" src={'/' + res.registrar + '.png'} alt={res.registrar} />
            </div>
            <div class="result-button align-right">
                {#if res.renewPrice !== undefined}
                    <div style="margin-bottom: 3rem" />
                {/if}
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                    <button class="result-button result-click">
                        ${res.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                        <Icon icon="material-symbols:north-east" style="font-size: 18px;" />
                    </button>
                </a>
                {#if res.renewPrice !== undefined}
                    <p style="display: block; font-size: 14px">
                        Renews at ${res.renewPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                {/if}
            </div>
        </li>
        {#if i === results.length - 1}
            <hr style="position: inherit" />
        {/if}
    {/each}
</ul>
