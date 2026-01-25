<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { logger } from '$lib/logger';

	let canvas: HTMLCanvasElement | undefined = $state();
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame: number | undefined;
	let particles: Particle[] = [];
	let connections: Connection[] = [];

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		radius: number;
	}

	interface Connection {
		fromIndex: number; // index of from particle
		toIndex: number; // index of to particle
		distance: number;
		createdAt: number; // timestamp when connection was created
	}

	onMount(() => {
		if (!canvas) {
			logger.error('Canvas element not found');
			return;
		}

		ctx = canvas.getContext('2d', { alpha: true });
		if (!ctx) {
			logger.error('Could not get 2D context');
			return;
		}

		const isDarkMode = () => document.documentElement.classList.contains('dark');

		let width = 0;
		let height = 0;
		let lastConnectionTime = 0; // Track when connections were last created
		const connectionInterval = 5000; // Create new connections every 5s

		const initParticles = () => {
			if (!canvas || width === 0 || height === 0) return;
			const particleCount = Math.floor((width * height) / 15000);
			particles = [];

			for (let i = 0; i < particleCount; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.5,
					vy: (Math.random() - 0.5) * 0.5,
					radius: Math.random() * 2 + 2
				});
			}
		};

		const resetAnimation = () => {
			// Clear the canvas
			if (ctx && canvas) {
				const dark = isDarkMode();
				ctx.fillStyle = dark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
				ctx.fillRect(0, 0, width, height);
			}
			// Clear connections and reset connection timer
			connections = [];
			lastConnectionTime = 0;
			// Reinitialize particles
			initParticles();
		};

		const resize = () => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			canvas.width = width;
			canvas.height = height;
			initParticles();
		};

		// Initial resize with a small delay to ensure canvas is fully rendered
		setTimeout(() => {
			resize();
		}, 0);
		window.addEventListener('resize', resize);

		// Watch for theme changes and reduced motion changes
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					resetAnimation();
					// Restart animation if reduced motion was disabled
					if (!document.body.classList.contains('reduced-motion')) {
						animate();
					}
				}
			}
		});

		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['class']
		});

		const animate = () => {
			if (!ctx || !canvas) return;

			// Check for reduced motion
			const reducedMotion = document.body.classList.contains('reduced-motion');
			if (reducedMotion) {
				// Skip animation when reduced motion is enabled
				return;
			}

			const dark = isDarkMode();
			const currentTime = Date.now();
			const connectionLifetime = 3000; // Connection fades over 3 seconds

			// Clear with slight fade for trail effect - darker in dark mode, lighter in light mode
			ctx.fillStyle = dark ? 'rgba(0, 0, 0, 0.008)' : 'rgba(255, 255, 255, 0.0005)';
			ctx.fillRect(0, 0, width, height);

			// Update and draw particles
			particles.forEach((particle) => {
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Bounce off edges
				if (particle.x < 0 || particle.x > width) particle.vx *= -1;
				if (particle.y < 0 || particle.y > height) particle.vy *= -1;

				// Keep in bounds
				particle.x = Math.max(0, Math.min(width, particle.x));
				particle.y = Math.max(0, Math.min(height, particle.y));
			});

			// Find new connections and update existing ones
			const connectionMap = new SvelteMap<string, Connection>();

			// Add existing connections to map (keyed by particle pair indices)
			connections.forEach((conn) => {
				const key = `${conn.fromIndex}-${conn.toIndex}`;
				connectionMap.set(key, conn);
			});

			// Only create new connections if enough time has passed (throttle to 5s)
			const canCreateNewConnections = currentTime - lastConnectionTime >= connectionInterval;

			// Check for new connections and update existing ones
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 150) {
						const key = `${i}-${j}`;
						if (!connectionMap.has(key)) {
							// New connection - only create if throttling allows
							if (canCreateNewConnections) {
								connectionMap.set(key, {
									fromIndex: i,
									toIndex: j,
									distance,
									createdAt: currentTime
								});
								lastConnectionTime = currentTime;
							}
						} else {
							// Update existing connection distance
							const existing = connectionMap.get(key)!;
							existing.distance = distance;
						}
					}
				}
			}

			// Update connections array and remove expired ones
			connections = Array.from(connectionMap.values()).filter((conn) => {
				const age = currentTime - conn.createdAt;
				return age < connectionLifetime;
			});

			// Draw connections with fade based on age and distance
			connections.forEach((conn) => {
				const fromParticle = particles[conn.fromIndex];
				const toParticle = particles[conn.toIndex];

				// Skip if particles are no longer valid (shouldn't happen, but safety check)
				if (!fromParticle || !toParticle) return;

				const age = currentTime - conn.createdAt;
				const ageFade = 1 - age / connectionLifetime; // Fade from 1 to 0 over lifetime
				const distanceFade = 1 - conn.distance / 150; // Fade based on distance
				const baseOpacity = dark ? 0.75 : 0.5;
				const opacity = Math.max(0, ageFade * distanceFade * baseOpacity);

				if (!ctx) return;
				// Terminal green: rgb(0, 255, 0) or darker green for subtlety
				const greenColor = dark ? '34, 197, 94' : '16, 185, 129'; // green-500 in dark, green-600 in light
				ctx.strokeStyle = `rgba(${greenColor}, ${opacity})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(fromParticle.x, fromParticle.y);
				ctx.lineTo(toParticle.x, toParticle.y);
				ctx.stroke();
			});

			// Draw particles
			particles.forEach((particle) => {
				if (!ctx) return;
				const opacity = dark ? 0.9 : 0.75;
				const greenColor = dark ? '34, 197, 94' : '16, 185, 129';
				ctx.fillStyle = `rgba(${greenColor}, ${opacity})`;
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
				ctx.fill();
			});

			animationFrame = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener('resize', resize);
			observer.disconnect();
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 -z-10 h-full w-full"
	aria-hidden="true"
></canvas>
