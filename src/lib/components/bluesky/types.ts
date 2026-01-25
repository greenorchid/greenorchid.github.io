export interface BlueskySession {
	did: string;
	handle: string;
	email?: string;
	active: boolean;
	refreshJwt?: string;
	accessJwt?: string;
}

export interface BlueskyProfile {
	did: string;
	handle: string;
	displayName?: string;
	description?: string;
	avatar?: string;
	banner?: string;
	followersCount?: number;
	followsCount?: number;
	postsCount?: number;
	indexedAt?: string;
}

export interface BlueskyPost {
	uri: string;
	cid: string;
	author: {
		did: string;
		handle: string;
		displayName?: string;
		avatar?: string;
	};
	record: {
		text: string;
		createdAt: string;
		reply?: {
			parent?: {
				uri: string;
				cid: string;
			};
		};
	};
	replyCount: number;
	repostCount: number;
	likeCount: number;
	quoteCount: number;
	embed?: {
		$type: string;
		[key: string]: any;
	};
}

export interface BlueskyComment extends BlueskyPost {
	replies: BlueskyComment[];
}

export interface BlueskyError {
	error: string;
	message: string;
	status?: number;
}
