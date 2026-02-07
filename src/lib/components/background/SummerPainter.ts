import { Painter, type State } from './Painter';

interface SummerItem {
	x: number;
	y: number;
	type: 'castle' | 'beachball';
	size: number;
	color: string;
	rotation: number;
	rv: number;
}

export class SummerPainter extends Painter {
	items: SummerItem[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 80000);
		const summerColors = [
			'rgba(255, 230, 100, 0.6)', // Sunny Yellow
			'rgba(100, 200, 255, 0.6)', // Sky Blue
			'rgba(255, 150, 150, 0.6)', // Coral
			'rgba(150, 255, 150, 0.6)', // Seafoam
			'rgba(255, 200, 150, 0.6)' // Sand
		];
		this.items = Array.from({ length: count + 3 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			type: Math.random() > 0.7 ? 'castle' : 'beachball',
			size: Math.random() * 15 + 20,
			color: summerColors[Math.floor(Math.random() * summerColors.length)],
			rotation: Math.random() * Math.PI * 2,
			rv: (Math.random() - 0.5) * 0.01
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);

		// Draw a big spectacular sun in corner
		const sunX = ps.width - 80;
		const sunY = 80;
		const sunSize = 100;
		const time = Date.now() / 1000;

		// Rays
		ctx.strokeStyle = 'rgba(255, 200, 0, 0.15)';
		ctx.lineWidth = 4;
		for (let i = 0; i < 12; i++) {
			const angle = (i / 12) * Math.PI * 2 + time * 0.1;
			const rayLen = 150 + Math.sin(time * 2 + i) * 20;
			ctx.beginPath();
			ctx.moveTo(sunX, sunY);
			ctx.lineTo(sunX + Math.cos(angle) * rayLen, sunY + Math.sin(angle) * rayLen);
			ctx.stroke();
		}

		ctx.fillStyle = 'rgba(255, 230, 0, 0.3)';
		ctx.beginPath();
		ctx.arc(sunX, sunY, sunSize, 0, Math.PI * 2);
		ctx.fill();

		this.items.forEach((item) => {
			item.rotation += item.rv;
			ctx.save();
			ctx.translate(item.x, item.y);
			ctx.rotate(item.rotation);
			ctx.fillStyle = item.color;

			if (item.type === 'castle') {
				this.drawCastle(ctx, 0, 0, item.size);
			} else {
				this.drawBall(ctx, 0, 0, item.size);
			}
			ctx.restore();

			// Movement
			item.x += Math.sin(time + item.x) * 0.2;
			item.y += Math.cos(time + item.y) * 0.2;
		});
	}

	private drawCastle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		// Sand castle with turrets and flags
		ctx.beginPath();
		// Main base
		ctx.rect(x - size, y - size * 0.4, size * 2, size * 0.8);

		// Left Turret
		ctx.rect(x - size, y - size, size * 0.5, size * 0.6);
		// Right Turret
		ctx.rect(x + size * 0.5, y - size, size * 0.5, size * 0.6);

		// Center Tower
		ctx.rect(x - size * 0.2, y - size * 1.5, size * 0.4, size * 1.5);

		ctx.fill();

		// Turret tops (triangles)
		ctx.fillStyle = 'rgba(255, 100, 100, 0.6)'; // Flag/Roof color

		// Tower roof
		ctx.beginPath();
		ctx.moveTo(x - size * 0.25, y - size * 1.5);
		ctx.lineTo(x + size * 0.25, y - size * 1.5);
		ctx.lineTo(x, y - size * 2);
		ctx.closePath();
		ctx.fill();

		// Small Flags
		ctx.fillRect(x + size * 0.1, y - size * 1.9, size * 0.3, size * 0.2);
	}

	private drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
		ctx.beginPath();
		ctx.arc(x, y, size / 2, 0, Math.PI * 2);
		ctx.fill();
		// Stripes
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(x - size / 2, y);
		ctx.lineTo(x + size / 2, y);
		ctx.stroke();
	}
}
