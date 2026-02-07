import { Painter, type State } from './Painter';

interface FireworkItem {
	x: number;
	y: number;
	vx: number;
	vy: number;
	type: 'rocket' | 'explosion';
	color: string;
	particles: FireworkParticle[];
}

interface FireworkParticle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	size?: number;
}

export class NewYearPainter extends Painter {
	items: FireworkItem[] = [];

	setup(_ps: State) {
		void _ps;
		this.items = [];
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		// Trail effect - use theme-aware clear color
		const clearColor =
			ps.style === 'new-year'
				? getComputedStyle(document.documentElement).getPropertyValue('--clear-color').trim() ||
					'0, 0, 5'
				: '0, 0, 5';
		ctx.fillStyle = `rgba(${clearColor}, 0.15)`;
		ctx.fillRect(0, 0, ps.width, ps.height);

		// Launch new rockets
		if (Math.random() < 0.04) {
			this.items.push({
				x: Math.random() * ps.width,
				y: ps.height,
				vx: (Math.random() - 0.5) * 2,
				vy: -(Math.random() * 5 + 7),
				type: 'rocket',
				color: `hsla(${Math.random() * 360}, 80%, 60%, 1)`,
				particles: []
			});
		}

		this.items = this.items.filter((item) => {
			if (item.type === 'rocket') {
				item.x += item.vx;
				item.y += item.vy;
				item.vy += 0.15; // Gravity on rocket

				// Draw rocket head
				ctx.fillStyle = '#fff';
				ctx.beginPath();
				ctx.arc(item.x, item.y, 2, 0, Math.PI * 2);
				ctx.fill();

				// Spark trails
				if (Math.random() > 0.3) {
					item.particles.push({
						x: item.x,
						y: item.y,
						vx: (Math.random() - 0.5) * 1,
						vy: (Math.random() - 0.5) * 1,
						life: 20
					});
				}

				// Explode at peak or random
				if (item.vy >= 0 || Math.random() < 0.005) {
					this.explode(item);
				}

				// Keep rockets alive until they explode
				return true;
			} else {
				// Explosion phase
				item.particles = item.particles.filter((p) => {
					p.x += p.vx;
					p.y += p.vy;
					p.vy += 0.06; // Gravity
					p.vx *= 0.98;
					p.vy *= 0.98;
					p.life--;

					if (p.life > 0) {
						ctx.fillStyle = item.color;
						ctx.globalAlpha = p.life / 80;
						ctx.beginPath();
						ctx.arc(p.x, p.y, p.size || 1.5, 0, Math.PI * 2);
						ctx.fill();
						ctx.globalAlpha = 1;
						return true;
					}
					return false;
				});

				return item.particles.length > 0;
			}
		});

		// Rocket trail processing (separate pass for clarity)
		this.items.forEach((item) => {
			if (item.type === 'rocket') {
				item.particles = item.particles.filter((p) => {
					p.x += p.vx;
					p.y += p.vy;
					p.life--;
					if (p.life > 0) {
						ctx.fillStyle = 'rgba(255, 200, 100, 0.6)';
						ctx.beginPath();
						ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
						ctx.fill();
						return true;
					}
					return false;
				});
			}
		});
	}

	private explode(item: FireworkItem) {
		item.type = 'explosion';
		const count = 40 + Math.floor(Math.random() * 40);
		item.particles = Array.from({ length: count }, () => {
			const angle = Math.random() * Math.PI * 2;
			const force = Math.random() * 3 + 1;
			return {
				x: item.x,
				y: item.y,
				vx: Math.cos(angle) * force,
				vy: Math.sin(angle) * force,
				life: 40 + Math.random() * 40,
				size: Math.random() * 1.5 + 0.5
			};
		});
	}
}
