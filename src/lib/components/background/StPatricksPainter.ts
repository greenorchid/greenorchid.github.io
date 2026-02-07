import { Painter, type State } from './Painter';

interface Clover {
	x: number;
	y: number;
	size: number;
	rotation: number;
	rv: number;
	vx: number;
	vy: number;
}

export class StPatricksPainter extends Painter {
	clovers: Clover[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 50000);
		this.clovers = Array.from({ length: count + 5 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			size: Math.random() * 15 + 10,
			rotation: Math.random() * Math.PI * 2,
			rv: (Math.random() - 0.5) * 0.02,
			vx: (Math.random() - 0.5) * 0.5,
			vy: Math.random() * 0.5 + 0.5
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);
		ctx.fillStyle = `rgba(${ps.particleColor}, 0.5)`;
		ctx.strokeStyle = `rgba(${ps.particleColor}, 0.7)`;

		this.clovers.forEach((c) => {
			c.x += c.vx;
			c.y += c.vy;
			c.rotation += c.rv;

			if (c.y > ps.height + 50) c.y = -50;
			if (c.x > ps.width + 50) c.x = -50;
			if (c.x < -50) c.x = ps.width + 50;

			ctx.save();
			ctx.translate(c.x, c.y);
			ctx.rotate(c.rotation);
			this.drawShamrock(ctx, c.size);
			ctx.restore();
		});
	}

	private drawShamrock(ctx: CanvasRenderingContext2D, size: number) {
		const leafSize = size * 0.6;
		ctx.beginPath();

		// Draw 3 heart-shaped leaves
		for (let i = 0; i < 3; i++) {
			ctx.save();
			ctx.rotate((i * 120 * Math.PI) / 180);

			// Heart shape (leaf)
			const x = 0,
				y = -leafSize * 0.8;
			const s = leafSize * 0.5;
			ctx.moveTo(x, y);
			ctx.bezierCurveTo(x - s, y - s, x - s * 1.5, y + s / 2, x, y + s * 1.5);
			ctx.bezierCurveTo(x + s * 1.5, y + s / 2, x + s, y - s, x, y);

			ctx.restore();
		}

		// Stem
		ctx.moveTo(0, leafSize * 0.2);
		ctx.quadraticCurveTo(size * 0.4, size * 0.6, 0, size * 1.1);

		ctx.fill();
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}
}
