<script>
  export let size = 200;
  export let color = 'red';

  $: sizepx = `${size}px`;
</script>

<div class="square"></div>

<style>
  .square {
    width: var(--sizepx);
    height: var(--sizepx);
    background-color: var(--color);
  }
</style>

