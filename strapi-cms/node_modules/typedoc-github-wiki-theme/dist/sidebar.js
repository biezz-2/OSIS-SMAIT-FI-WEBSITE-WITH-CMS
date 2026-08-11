export function getSidebar(navigationItems) {
    const parseSidebarUrl = (url) => '../wiki/' + url.replace('.md', '');
    const md = [];
    navigationItems.forEach((navigationItem) => {
        const navItemMd = [];
        if (navigationItem.path) {
            navItemMd.push(`- [${navigationItem.title}](${parseSidebarUrl(navigationItem.path)})`);
        }
        else {
            md.push(`### ${navigationItem.title}\n`);
            if (navigationItem.children) {
                const childList = navigationItem.children
                    ?.map((child) => `- [${child.title}](${parseSidebarUrl(child.path || '')})`)
                    .join('\n');
                navItemMd.push(childList + '\n');
            }
        }
        md.push(navItemMd.join('\n'));
    });
    return md.join('\n');
}
