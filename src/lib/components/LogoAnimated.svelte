<script>
	export let size = 48;
</script>

<svg
	class="logo"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 64 64"
	width={size}
	height={size}
	role="img"
	aria-label="Behan.dev animated logo"
>
	<!-- Filters -->
	<defs>
		<!-- Glow for nodes -->
		<filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="2" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>

		<!-- Glow for electrons -->
		<filter id="electron-glow" x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="1.5" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>

		<!-- Circuit paths -->
		<path id="trace1" d="M42 14v8h6" />
		<path id="trace2" d="M42 30v6h10" />
		<path id="trace3" d="M52 36h-4v10" />
		<path id="trace4" d="M22 42h8v6" />
		<path id="trace5" d="M25 50h5" />
		<!-- combined for electron path -->
		<path id="trace4-5" d="M22 42h8v6 v2 h-5" />
		<path id="trace6" d="M30 46h5" />
	</defs>

	<!-- Background -->
	<!-- <rect width="64" height="64" rx="12" fill="#0f172a"/> -->

	<!-- Bold B -->
	<path
		d="M18 12h17c8 0 13 4 13 10 0 4-2 7-6 9 6 1 9 5 9 11 0 8-6 13-14 13H18V12zm16 18c4 0 7-2 7-6s-3-6-7-6h-6v12h6zm2 24c5 0 8-3 8-7s-3-7-8-7h-8v14h8z"
		fill="#22c55e"
	/>

	<!-- Circuit tracks -->
	<g stroke="#06402B" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<use href="#trace1" />
		<use href="#trace2" />
		<use href="#trace3" />
		<use href="#trace4" />
		<use href="#trace5" />
		<use href="#trace6" />
	</g>

	<!-- Nodes (pulse glow) -->
	<g class="nodes-pulse" fill="#06402B" filter="url(#node-glow)">
		<circle cx="42" cy="14" r="2.5" />
		<circle cx="48" cy="22" r="2.5" />
		<circle cx="42" cy="30" r="2.5" />
		<circle cx="52" cy="36" r="2.5" />
		<circle cx="48" cy="46" r="2.5" />
		<circle cx="22" cy="42" r="2.5" />
		<circle cx="22" cy="42" r="2.5" />
		<circle cx="36" cy="46" r="2.5" />
		<circle cx="25" cy="50" r="2.5" />
	</g>

	<!-- Nodes (static white) -->
	<g class="nodes-static" fill="#ffffff">
		<circle cx="42" cy="14" r="1" />
		<circle cx="48" cy="22" r="1" />
		<circle cx="42" cy="30" r="1" />
		<circle cx="52" cy="36" r="1" />
		<circle cx="48" cy="46" r="1" />
		<circle cx="22" cy="42" r="1" />
		<circle cx="22" cy="42" r="1" />
		<circle cx="36" cy="46" r="1" />
		<circle cx="25" cy="50" r="1" />
	</g>

	<!-- Electrons (hover only) -->
	<g class="electrons" fill="#fde047" filter="url(#electron-glow)">
		<circle r="1">
			<animateMotion dur="1.8s" repeatCount="indefinite">
				<mpath href="#trace1" />
			</animateMotion>
		</circle>

		<circle r="1">
			<animateMotion dur="2.3s" repeatCount="indefinite">
				<mpath href="#trace2" />
			</animateMotion>
		</circle>

		<circle r="1">
			<animateMotion dur="2s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1">
				<mpath href="#trace3" />
			</animateMotion>
		</circle>

		<circle r="1">
			<animateMotion dur="2.8s" repeatCount="indefinite">
				<mpath href="#trace4-5" />
			</animateMotion>
		</circle>
	</g>
</svg>

<style>
	/* Node pulse */
	.nodes-pulse circle {
		animation: pulse 2.5s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: center;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.15);
		}
	}

	/* Electrons hidden until hover */
	.electrons {
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.logo:hover .electrons {
		opacity: 1;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.nodes-pulse circle {
			animation: none;
		}
		.electrons {
			display: none;
		}
	}

	:global(body.reduced-motion) .nodes-pulse circle {
		animation: none;
	}

	:global(body.reduced-motion) .electrons {
		display: none;
	}
</style>
