import { Painter, type State } from './Painter';

interface ThanksgivingItem {
	x: number;
	y: number;
	type: 'pumpkin' | 'acorn' | 'leaf';
	size: number;
	vx: number;
	vy: number;
	rotation: number;
	vRot: number;
	color: string;
}

const LEAF_COLORS = [
	'rgba(217, 119, 6, 0.35)', // amber
	'rgba(180, 83, 9, 0.35)', // harvest orange
	'rgba(153, 27, 27, 0.3)', // cranberry
	'rgba(202, 138, 4, 0.35)' // goldenrod
];

export class ThanksgivingPainter extends Painter {
	items: ThanksgivingItem[] = [];

	setup(ps: State) {
		const count = Math.floor((ps.width * ps.height) / 65000);
		const types: ThanksgivingItem['type'][] = ['pumpkin', 'acorn', 'leaf'];
		this.items = Array.from({ length: count + 6 }, (_, i) => ({
			x: Math.random() * ps.width,
			y: Math.random() * ps.height,
			type: types[i % types.length],
			size: Math.random() * 12 + 16,
			vx: (Math.random() - 0.5) * 0.4,
			vy: Math.random() * 0.35 + 0.15,
			rotation: Math.random() * Math.PI * 2,
			vRot: (Math.random() - 0.5) * 0.015,
			color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
		}));
	}

	paint(ctx: CanvasRenderingContext2D, ps: State) {
		ctx.clearRect(0, 0, ps.width, ps.height);

		this.items.forEach((item) => {
			item.x += item.vx;
			item.y += item.vy;
			item.rotation += item.vRot;

			if (item.x < -30) item.x = ps.width + 30;
			if (item.x > ps.width + 30) item.x = -30;
			if (item.y > ps.height + 30) {
				item.y = -30;
				item.x = Math.random() * ps.width;
			}

			ctx.save();
			ctx.translate(item.x, item.y);
			ctx.rotate(item.rotation);

			if (item.type === 'pumpkin') {
				this.drawPumpkin(ctx, item.size);
			} else if (item.type === 'acorn') {
				this.drawAcorn(ctx, item.size);
			} else {
				this.drawLeaf(ctx, item.size, item.color);
			}

			ctx.restore();
		});
	}

	private drawPumpkin(ctx: CanvasRenderingContext2D, size: number) {
		// Warm harvest pumpkin body
		ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
		ctx.beginPath();
		ctx.ellipse(0, 0, size, size * 0.78, 0, 0, Math.PI * 2);
		ctx.fill();
		// Subtle center ridge
		ctx.fillStyle = 'rgba(180, 83, 9, 0.2)';
		ctx.beginPath();
		ctx.ellipse(0, 0, size * 0.45, size * 0.78, 0, 0, Math.PI * 2);
		ctx.fill();
		// Stem
		ctx.fillStyle = 'rgba(101, 163, 13, 0.4)';
		ctx.fillRect(-size * 0.1, -size * 0.95, size * 0.2, size * 0.3);
	}

	private drawAcorn(ctx: CanvasRenderingContext2D, size: number) {
		// Nut body
		ctx.fillStyle = 'rgba(180, 83, 9, 0.35)';
		ctx.beginPath();
		ctx.ellipse(0, size * 0.15, size * 0.55, size * 0.65, 0, 0, Math.PI * 2);
		ctx.fill();
		// Cap
		ctx.fillStyle = 'rgba(120, 53, 15, 0.45)';
		ctx.beginPath();
		ctx.ellipse(0, -size * 0.25, size * 0.68, size * 0.35, 0, Math.PI, 0);
		ctx.closePath();
		ctx.fill();
		// Stem
		ctx.fillRect(-size * 0.08, -size * 0.75, size * 0.16, size * 0.22);
	}

	private drawLeaf(ctx: CanvasRenderingContext2D, size: number, color: string) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(0, -size);
		ctx.quadraticCurveTo(size * 0.7, -size * 0.3, 0, size);
		ctx.quadraticCurveTo(-size * 0.7, -size * 0.3, 0, -size);
		ctx.fill();
	}
}
