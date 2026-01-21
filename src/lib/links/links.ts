export interface Link {
	id: string;
	url: string;
	title: string;
	description: string;
	tags: string[];
	addedDate?: string;
}

// Load all JSON files from the links directory
const linkModules = import.meta.glob('./*.json', { eager: true }) as Record<
	string,
	{ default: Link | Link[] }
>;

export const links: Link[] = Object.values(linkModules)
	.map((module) => {
		const data = module.default;
		return Array.isArray(data) ? data : [data];
	})
	.flat()
	.filter(Boolean);

export function getAllLinks(): Link[] {
	// Sort by addedDate (newest first) if available, otherwise by title
	return [...links].sort((a, b) => {
		if (a.addedDate && b.addedDate) {
			return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
		}
		return a.title.localeCompare(b.title);
	});
}

export function getAllLinkTags(): string[] {
	const tagSet = new Set<string>();
	links.forEach((link) => {
		link.tags.forEach((tag) => tagSet.add(tag));
	});
	return Array.from(tagSet).sort();
}

export function getLinksByTag(tag: string): Link[] {
	return getAllLinks().filter((link) => link.tags.includes(tag));
}
