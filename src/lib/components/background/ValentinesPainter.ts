import { Painter, type State } from './Painter';

interface Heart {
	x: number;
	y: number;
	size: number;
	speed: number;
	amplitude: number;
	phase: number;
}

export class ValentinesPainter extends Painter {
	hearts: Heart[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 40000);
		this.hearts = Array.from({ length: count + 10 }, () => ({
			x: Math.random() * ps.width,
			y: ps.height + Math.random() * 200,
			size: Math.random() * 10 + 8,
			speed: Math.random() * 0.8 + 0.3,
			amplitude: Math.random() * 40 + 20,
			phase: Math.random() * Math.PI * 2
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);
		ctx.fillStyle = `rgba(${ps.particleColor}, 0.5)`;

		this.hearts.forEach((h) => {
			h.y -= h.speed;
			const offsetX = Math.sin(h.phase + h.y / 60) * h.amplitude;
			if (h.y + h.size < -50) h.y = ps.height + 50;

			this.drawHeart(ctx, h.x + offsetX, h.y, h.size);
		});
	}

	private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.bezierCurveTo(x - size, y - size, x - size * 1.5, y + size / 2, x, y + size * 1.2);
		ctx.bezierCurveTo(x + size * 1.5, y + size / 2, x + size, y - size, x, y);
		ctx.fill();
	}
}
