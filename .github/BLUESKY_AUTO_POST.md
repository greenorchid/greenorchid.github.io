# Bluesky Auto-Post Workflow

This GitHub Actions workflow automatically posts new blog posts and recipes to Bluesky when they don't have a `blueskyUri` defined in their frontmatter.

## Setup Instructions

### 1. Create Bluesky App Password

1. Go to your Bluesky account settings
2. Navigate to **Settings → App Passwords**
3. Click **Add App Password**
4. Give it a name (e.g., "GitHub Auto-Post")
5. **Copy the generated password immediately** (you won't be able to see it again)

### 2. Add GitHub Secrets

Go to your GitHub repository:

1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

#### `BLUESKY_HANDLE`

- **Value**: Your Bluesky handle (e.g., `yourhandle.bsky.social`)

#### `BLUESKY_APP_PASSWORD`

- **Value**: The app password you created in step 1
- **Important**: Use the app password, NOT your main Bluesky password

### 3. Update Site URL (Optional)

If your site URL is different from `https://behan.dev`, update it in:

- `.github/workflows/bluesky-auto-post.yml` (line with `SITE_URL`)

### 4. Main branch only

The workflow is currently configured to run on **main** branch.

## How It Works

1. **Trigger**: Runs when `.md` files in `src/lib/blog/posts/` or `src/lib/recipes/posts/` are modified
2. **Detection**: Compares the current commit with the previous one to find new/modified posts
3. **Check**: Parses frontmatter to see if `blueskyUri` exists
4. **Post**: If missing, creates a Bluesky post with format: `{title}\n\n{excerpt}\n\n{url}`
5. **Update**: Adds the returned `blueskyUri` to the post's frontmatter
6. **Commit**: Commits the updated file back to the repository with `[skip ci]` to avoid triggering another workflow

## Post Format

Posts are formatted as:

```
{title}

{excerpt}

{url}
```

If the combined text exceeds 300 characters (Bluesky's limit), it will be truncated with "...".

## Frontmatter Example

**Before posting:**

```yaml
---
title: 'My New Blog Post'
date: '2026-01-31'
excerpt: 'This is an exciting new post about...'
tags: ['AI', 'Platform Engineering']
---
```

**After posting:**

```yaml
---
title: 'My New Blog Post'
date: '2026-01-31'
excerpt: 'This is an exciting new post about...'
tags: ['AI', 'Platform Engineering']
blueskyUri: 'at://did:plc:abc123/app.bsky.feed.post/xyz789'
---
```

## Troubleshooting

### Workflow doesn't run

- Check that the file path matches `src/lib/blog/posts/*.md` or `src/lib/recipes/posts/*.md`
- Verify the workflow file is in `.github/workflows/`

### Authentication fails

- Verify `BLUESKY_HANDLE` is correct (should include `.bsky.social`)
- Ensure you're using an **app password**, not your main password
- Check that secrets are properly set in GitHub repository settings

### Posts aren't being updated

- Check the Actions logs for errors
- Verify the script has write permissions (`permissions: contents: write`)
- Ensure the frontmatter format is correct (YAML with `---` delimiters)

### Duplicate posts

- The script checks for existing `blueskyUri` fields to prevent duplicates
- If a post already has a `blueskyUri`, it will be skipped

## Files

- `.github/workflows/bluesky-auto-post.yml` - GitHub Actions workflow
- `.github/scripts/bluesky-post.js` - Node.js script that handles posting
- `.github/scripts/package.json` - Enables ES modules for the script
