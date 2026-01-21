export function isActive(href: string, currentPage: string): boolean {
	return currentPage === href || (href !== '/' && currentPage.startsWith(href));
}
