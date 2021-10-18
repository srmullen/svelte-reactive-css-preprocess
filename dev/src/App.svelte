<script>
	export let name;

	const colors = ['#ff3e00', 'blue', 'green'];

	export let colorIdx = 0;

	let color = colors[colorIdx];

	$: color2 = colors[(colorIdx + 1) % colors.length];

	function updateColor() {
		colorIdx++;
		color = colors[colorIdx % colors.length]
	}

	// $: if (document) {
	// 	const r = document.querySelector(':root');
	// 	r.style.setProperty('--color', color);
	// 	r.style.setProperty('--color2', color2);
	// }
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<button on:click={updateColor}>Update Color</button>
</main>

<style>

	/* :root {
		--color: inherit;
		--color2: inherit;
	} */

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