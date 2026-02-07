import { Painter, type State } from './Painter';

interface EasterItem {
	x: number;
	y: number;
	type: 'bunny' | 'egg';
	size: number;
	color: string;
	vx: number;
	vy: number;
}

export class EasterPainter extends Painter {
	items: EasterItem[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 60000);
		const pastelColors = [
			'rgba(255, 200, 221, 0.7)', // Pink
			'rgba(255, 243, 176, 0.7)', // Yellow
			'rgba(184, 242, 230, 0.7)', // Mint
			'rgba(202, 224, 255, 0.7)', // Blue
			'rgba(235, 202, 255, 0.7)' // Lavender
		];
		this.items = Array.from({ length: count + 5 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			type: Math.random() > 0.5 ? 'bunny' : 'egg',
			size: Math.random() * 10 + 15,
			color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
			vx: (Math.random() - 0.5) * 0.3,
			vy: (Math.random() - 0.5) * 0.3
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);

		this.items.forEach((item) => {
			item.x += item.vx;
			item.y += item.vy;

			if (item.x < -20) item.x = ps.width + 20;
			if (item.x > ps.width + 20) item.x = -20;
			if (item.y < -20) item.y = ps.height + 20;
			if (item.y > ps.height + 20) item.y = -20;

			ctx.fillStyle = item.color;
			if (item.type === 'bunny') {
				this.drawBunny(ctx, item.x, item.y, item.size);
			} else {
				this.drawEgg(ctx, item.x, item.y, item.size);
			}
		});
	}

	private drawBunny(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.beginPath();
		// Body
		ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
		// Head
		ctx.arc(x, y - size * 0.5, size * 0.4, 0, Math.PI * 2);
		// Ears
		ctx.ellipse(x - size * 0.2, y - size * 1, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
		ctx.ellipse(x + size * 0.2, y - size * 1, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	private drawEgg(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.beginPath();
		ctx.ellipse(x, y, size * 0.6, size * 0.8, 0, 0, Math.PI * 2);
		ctx.fill();
	}
}
