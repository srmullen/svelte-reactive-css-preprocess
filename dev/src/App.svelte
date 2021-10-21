<script>
	import Square from './Square.svelte';

	export let name;

	const colors = ['#ff3e00', 'blue', 'green'];

	export let colorIdx = 0;

	let color = colors[colorIdx];

	$: color2 = colors[(colorIdx + 1) % colors.length];

	let size = 200;

	function update() {
		colorIdx++;
		color = colors[colorIdx % colors.length];
		size = Math.random() * 200 + 100;
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<button on:click={update}>Update Color</button>
	<Square {size} {color} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: var(--color);
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 400;
	}

	p {
		color: var(--color2);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>