import { Painter, type State } from './Painter';

interface HalloweenItem {
	x: number;
	y: number;
	type: 'pumpkin' | 'ghost';
	size: number;
	vx: number;
	vy: number;
}

export class HalloweenPainter extends Painter {
	items: HalloweenItem[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 70000);
		this.items = Array.from({ length: count + 5 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			type: Math.random() > 0.5 ? 'pumpkin' : 'ghost',
			size: Math.random() * 15 + 20,
			vx: (Math.random() - 0.5) * 0.4,
			vy: (Math.random() - 0.5) * 0.4
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);

		this.items.forEach((item) => {
			item.x += item.vx;
			item.y += item.vy;

			if (item.x < -30) item.x = ps.width + 30;
			if (item.x > ps.width + 30) item.x = -30;
			if (item.y < -30) item.y = ps.height + 30;
			if (item.y > ps.height + 30) item.y = -30;

			if (item.type === 'pumpkin') {
				this.drawPumpkin(ctx, item.x, item.y, item.size);
			} else {
				this.drawGhost(ctx, item.x, item.y, item.size);
			}
		});
	}

	private drawPumpkin(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.fillStyle = 'rgba(255, 117, 24, 0.4)';
		ctx.beginPath();
		ctx.ellipse(x, y, size, size * 0.8, 0, 0, Math.PI * 2);
		ctx.fill();
		// Stem
		ctx.fillStyle = 'rgba(34, 139, 34, 0.4)';
		ctx.fillRect(x - size * 0.1, y - size * 0.9, size * 0.2, size * 0.3);
	}

	private drawGhost(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.beginPath();
		ctx.arc(x, y - size * 0.5, size * 0.6, Math.PI, 0);
		ctx.lineTo(x + size * 0.6, y + size * 0.5);
		// Wavy bottom
		for (let i = 0; i < 3; i++) {
			ctx.quadraticCurveTo(
				x + size * 0.4 - i * size * 0.4,
				y + size * 0.8,
				x + size * 0.2 - i * size * 0.4,
				y + size * 0.5
			);
		}
		ctx.lineTo(x - size * 0.6, y - size * 0.5);
		ctx.fill();
	}
}
