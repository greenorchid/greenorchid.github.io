import { Painter, type State } from './Painter';

interface Leaf {
	x: number;
	y: number;
	size: number;
	color: string;
	speed: number;
	wind: number;
	rotation: number;
	rv: number;
}

export class AutumnPainter extends Painter {
	leaves: Leaf[] = [];

	setup(ps: State) {
		this.leaves = Array.from({ length: 40 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			size: Math.random() * 10 + 10,
			color: `hsla(${Math.random() * 40 + 10}, 70%, 40%, 0.4)`, // Orange, Red, Yellow
			speed: Math.random() * 0.5 + 0.2,
			wind: Math.random() * 0.5,
			rotation: Math.random() * Math.PI * 2,
			rv: (Math.random() - 0.5) * 0.05
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);

		this.leaves.forEach((l) => {
			l.y += l.speed;
			l.x += Math.sin(l.y / 30) * l.wind;
			l.rotation += l.rv;

			if (l.y > ps.height + 20) l.y = -20;
			if (l.x > ps.width + 20) l.x = -20;

			ctx.save();
			ctx.translate(l.x, l.y);
			ctx.rotate(l.rotation);
			ctx.fillStyle = l.color;
			this.drawLeaf(ctx, 0, 0, l.size);
			ctx.restore();
		});
	}

	private drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.beginPath();
		ctx.ellipse(x, y, size, size / 2, 0, 0, Math.PI * 2);
		ctx.moveTo(x - size, y);
		ctx.lineTo(x + size, y); // Stem
		ctx.stroke();
		ctx.fill();
	}
}
