import { Painter, type State } from './Painter';

interface SnowFlake {
	x: number;
	y: number;
	radius: number;
	speed: number;
	wind: number;
}

interface PineTree {
	x: number;
	y: number;
	size: number;
	color: string;
}

export class ChristmasPainter extends Painter {
	flakes: SnowFlake[] = [];
	trees: PineTree[] = [];

	setup(ps: State) {
		// Create a forest of trees
		const treeCount = Math.floor(ps.width / 40);
		this.trees = Array.from({ length: treeCount }, (_, i) => ({
			x: i * 40 + Math.random() * 20,
			y: ps.height - Math.random() * 20,
			size: Math.random() * 30 + 40,
			color: `rgba(20, ${Math.random() * 40 + 40}, 20, 0.4)`
		}));

		this.flakes = Array.from({ length: 100 }, () => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			radius: Math.random() * 2 + 1,
			speed: Math.random() * 1 + 0.5,
			wind: Math.random() * 0.2 - 0.1
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);
		const isDark = ps.mode === 'dark';

		// Draw forest
		this.trees.forEach((t) => {
			this.drawPineTree(ctx, t.x, t.y, t.size, t.color);
		});

		// Snow
		ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : `rgba(${ps.particleColor}, 0.7)`;
		this.flakes.forEach((f) => {
			f.y += f.speed;
			f.x += f.wind;
			if (f.y > ps.height + 5) f.y = -5;
			if (f.x > ps.width + 5) f.x = -5;
			if (f.x < -5) f.x = ps.width + 5;

			ctx.beginPath();
			ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
			ctx.fill();
		});
	}

	private drawPineTree(
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		size: number,
		color: string
	) {
		ctx.fillStyle = color;
		ctx.beginPath();

		// 3 layers of triangles
		for (let i = 0; i < 3; i++) {
			const layerY = y - i * size * 0.3;
			const layerSize = size * (1 - i * 0.2);
			ctx.moveTo(x, layerY - layerSize);
			ctx.lineTo(x - layerSize / 2, layerY);
			ctx.lineTo(x + layerSize / 2, layerY);
		}

		// Trunk
		ctx.rect(x - size / 10, y, size / 5, size / 5);
		ctx.fill();
	}
}
