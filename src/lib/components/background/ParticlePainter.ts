import { Painter, type State } from './Painter';

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
}

export class ParticlePainter extends Painter {
	particles: Particle[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 15000);
		this.particles = Array.from({ length: count }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			vx: (Math.random() - 0.5) * 0.5,
			vy: (Math.random() - 0.5) * 0.5,
			radius: Math.random() * 2 + 1.5
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		const isDark = ps.mode === 'dark';

		// Clear with faint trail
		ctx.fillStyle = isDark ? 'rgba(17, 24, 39, 0.08)' : 'rgba(255, 255, 255, 0.08)';
		ctx.fillRect(0, 0, ps.width, ps.height);

		this.particles.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < 0 || p.x > ps.width) p.vx *= -1;
			if (p.y < 0 || p.y > ps.height) p.vy *= -1;
		});

		// Connections logic
		for (let i = 0; i < this.particles.length; i++) {
			for (let j = i + 1; j < this.particles.length; j++) {
				const dx = this.particles[i].x - this.particles[j].x;
				const dy = this.particles[i].y - this.particles[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 150) {
					const opacity = (1 - dist / 150) * (isDark ? 0.3 : 0.2);
					ctx.strokeStyle = `rgba(${ps.particleColor}, ${opacity})`;
					ctx.lineWidth = 0.8;
					ctx.beginPath();
					ctx.moveTo(this.particles[i].x, this.particles[i].y);
					ctx.lineTo(this.particles[j].x, this.particles[j].y);
					ctx.stroke();
				}
			}
		}

		// Particles
		this.particles.forEach((p) => {
			ctx.fillStyle = `rgba(${ps.particleColor}, ${isDark ? 0.8 : 0.6})`;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
			ctx.fill();
		});
	}
}
