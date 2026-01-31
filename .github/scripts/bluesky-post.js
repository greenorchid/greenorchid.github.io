#!/usr/bin/env node

import { BskyAgent } from '@atproto/api';
import matter from 'gray-matter';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE;
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const SITE_URL = process.env.SITE_URL || 'https://behan.dev';

if (!BLUESKY_HANDLE || !BLUESKY_APP_PASSWORD) {
	console.error('Error: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD must be set');
	process.exit(1);
}

async function getModifiedMarkdownFiles() {
	try {
		// Get the list of changed files in this commit
		const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' })
			.split('\n')
			.filter(Boolean);

		// Filter for new/modified markdown files in blog/recipes posts
		const postFiles = changedFiles.filter(
			(file) =>
				(file.includes('src/lib/blog/posts/') || file.includes('src/lib/recipes/posts/')) &&
				file.endsWith('.md')
		);

		return postFiles;
	} catch (error) {
		console.error('Error getting modified files:', error.message);
		return [];
	}
}

function parseMarkdownFile(filePath) {
	try {
		const content = readFileSync(filePath, 'utf-8');
		const { data: frontmatter, content: body } = matter(content);
		return { frontmatter, body, filePath };
	} catch (error) {
		console.error(`Error parsing ${filePath}:`, error.message);
		return null;
	}
}

function getPostUrl(filePath) {
	// Convert file path to URL
	// src/lib/blog/posts/my-post.md -> /blog/my-post
	// src/lib/recipes/posts/my-recipe.md -> /recipes/my-recipe

	const match = filePath.match(/src\/lib\/(blog|recipes)\/posts\/(.+)\.md$/);
	if (match) {
		const [, type, slug] = match;
		return `${SITE_URL}/${type}/${slug}`;
	}
	return SITE_URL;
}

async function postToBluesky(agent, title, excerpt, url) {
	try {
		// Create post text: title + excerpt + URL
		const postText = `${title}\n\n${excerpt}\n\n${url}`;

		// Truncate if too long (Bluesky has a 300 character limit)
		const maxLength = 300;
		const finalText =
			postText.length > maxLength ? postText.substring(0, maxLength - 3) + '...' : postText;

		const response = await agent.post({
			text: finalText,
			createdAt: new Date().toISOString()
		});

		return response.uri;
	} catch (error) {
		console.error('Error posting to Bluesky:', error.message);
		throw error;
	}
}

function updateMarkdownWithUri(filePath, blueskyUri) {
	try {
		const content = readFileSync(filePath, 'utf-8');
		let updatedContent;

		// Check if blueskyUri already exists (shouldn't happen given the filter, but good for safety)
		if (content.match(/^blueskyUri:.*$/m)) {
			updatedContent = content.replace(/^blueskyUri:.*$/m, `blueskyUri: '${blueskyUri}'`);
		} else {
			// Check for end of frontmatter (---)
			// We look for the second occurrence of ---
			const parts = content.split(/^---$/m);

			if (parts.length >= 3) {
				// parts[0] is usually empty (before first ---)
				// parts[1] is frontmatter
				// parts[2] is body
				// We append blueskyUri to parts[1]
				parts[1] += `blueskyUri: '${blueskyUri}'\n`;
				updatedContent = parts.join('---');
			} else {
				// Fallback if frontmatter structure isn't standard
				console.warn(
					`Warning: Could not strictly parse frontmatter in ${filePath}, appending to top.`
				);
				updatedContent = `---\nblueskyUri: '${blueskyUri}'\n---\n` + content;
			}
		}

		writeFileSync(filePath, updatedContent, 'utf-8');
		console.log(`✓ Updated ${filePath} with blueskyUri`);
		return true;
	} catch (error) {
		console.error(`Error updating ${filePath}:`, error.message);
		return false;
	}
}

async function main() {
	console.log('🔍 Checking for new posts to share on Bluesky...\n');

	// Get modified markdown files
	const modifiedFiles = await getModifiedMarkdownFiles();

	if (modifiedFiles.length === 0) {
		console.log('No new or modified posts found.');
		return;
	}

	console.log(`Found ${modifiedFiles.length} modified post(s):\n${modifiedFiles.join('\n')}\n`);

	// Parse files and filter those without blueskyUri
	const postsToShare = [];
	for (const filePath of modifiedFiles) {
		const parsed = parseMarkdownFile(filePath);
		if (parsed && !parsed.frontmatter.blueskyUri) {
			postsToShare.push(parsed);
			console.log(`📝 Queued for posting: ${parsed.frontmatter.title}`);
		} else if (parsed && parsed.frontmatter.blueskyUri) {
			console.log(`⏭️  Skipped (already posted): ${parsed.frontmatter.title}`);
		}
	}

	if (postsToShare.length === 0) {
		console.log('\nNo posts need to be shared (all have blueskyUri).');
		return;
	}

	// Authenticate with Bluesky
	console.log('\n🔐 Authenticating with Bluesky...');
	const agent = new BskyAgent({ service: 'https://bsky.social' });

	try {
		await agent.login({
			identifier: BLUESKY_HANDLE,
			password: BLUESKY_APP_PASSWORD
		});
		console.log('✓ Authenticated successfully\n');
	} catch (error) {
		console.error('Failed to authenticate with Bluesky:', error.message);
		process.exit(1);
	}

	// Post each article to Bluesky
	const updatedFiles = [];
	for (const post of postsToShare) {
		const { frontmatter, filePath } = post;
		const url = getPostUrl(filePath);

		console.log(`📤 Posting to Bluesky: ${frontmatter.title}`);

		try {
			const blueskyUri = await postToBluesky(
				agent,
				frontmatter.title,
				frontmatter.excerpt || '',
				url
			);

			console.log(`✓ Posted successfully: ${blueskyUri}`);

			// Update the markdown file with the URI
			if (updateMarkdownWithUri(filePath, blueskyUri)) {
				updatedFiles.push(filePath);
			}
		} catch (error) {
			console.error(`✗ Failed to post: ${frontmatter.title}. Error: ${error.message}`);
			// Continue with other posts
		}
	}

	// Commit the changes if any files were updated
	if (updatedFiles.length > 0) {
		console.log(`\n📝 Committing ${updatedFiles.length} updated file(s)...`);

		try {
			execSync('git config user.name "GitHub Actions Bot"');
			execSync('git config user.email "actions@github.com"');

			for (const file of updatedFiles) {
				execSync(`git add "${file}"`);
			}

			execSync('git commit -m "chore: add Bluesky URIs to new posts [skip ci]"');
			execSync('git push');

			console.log('✓ Changes committed and pushed successfully');
		} catch (error) {
			console.error('Error committing changes:', error.message);
			process.exit(1);
		}
	}

	console.log('\n✅ Bluesky auto-post completed successfully!');
}

main().catch(() => {
	console.error('Fatal error');
	process.exit(1);
});
