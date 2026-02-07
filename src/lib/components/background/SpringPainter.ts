import { Painter, type State } from './Painter';

interface Petal {
	x: number;
	y: number;
	size: number;
	speed: number;
	wind: number;
	rotation: number;
	rv: number;
}

export class SpringPainter extends Painter {
	petals: Petal[] = [];

	setup(ps: State) {
		this.petals = Array.from({ length: 50 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			size: Math.random() * 5 + 5,
			speed: Math.random() * 0.4 + 0.2,
			wind: Math.random() * 0.3,
			rotation: Math.random() * Math.PI * 2,
			rv: (Math.random() - 0.5) * 0.02
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);
		ctx.fillStyle = 'rgba(255, 183, 197, 0.5)'; // Sakura pink

		this.petals.forEach((p) => {
			p.y += p.speed;
			p.x += Math.sin(p.y / 50) * p.wind;
			p.rotation += p.rv;

			if (p.y > ps.height + 10) p.y = -10;
			if (p.x > ps.width + 10) p.x = -10;

			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rotation);
			this.drawPetal(ctx, 0, 0, p.size);
			ctx.restore();
		});
	}

	private drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.beginPath();
		ctx.ellipse(x, y, size, size / 1.5, 0, 0, Math.PI * 2);
		ctx.fill();
	}
}
