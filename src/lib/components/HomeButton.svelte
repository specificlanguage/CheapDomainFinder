<script>
    import Icon from '@iconify/svelte';
    import '../../sakura.css';
</script>

<a class="top-corner" href="https://speclang.dev">
    <span class="icon">
        <Icon icon="material-symbols:chevron-left" style="font-size: 48px; display: inline" />
    </span>
    <img alt="" class="home-image inline" src="/domains/speclang.jpg" />
    <p class="inline back-text">Back to <b>speclang.dev</b></p>
</a>

<style>
    .inline {
        display: none;
    }

    .top-corner:hover .inline {
        display: inline;
    }

    .home-image {
        border-radius: 9999px;
        border-color: black;
        border-width: 1px;
        height: 40px;
        width: 40px;
        margin: 0px 1rem 0px 0px;
    }

    .back-text {
        margin: 0;
        padding-right: 0.5rem;
    }

    a:hover {
        text-decoration: none;
    }

    .top-corner {
        display: flex;
        align-items: center;

        margin: 15px;
        position: absolute;
        top: 0;
        left: 0;

        height: max-content;
        width: max-content;
        box-shadow: 5px 5px 5px grey;
        overflow: hidden;
        border-radius: 5px;
        background: darkgray;
        color: black;

        text-decoration: none;
    }

    .icon {
        margin-top: 10px;
    }
</style>
