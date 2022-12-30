import React from "react";
import { Linking, StyleProp, Text, TextProps, TextStyle } from "react-native";
import linkifyIt from "linkify-it";

export type HyperlinksProps = TextProps & {
	text: string;
	hyperlinkStyle?: StyleProp<TextStyle>;
	autoDetectMentions?: boolean;
	autoDetectHastags?: boolean;
	linkify?: linkifyIt.LinkifyIt;
	onLinkPress?: (link: string) => void;
	onMentionPress?: (username: string) => void;
	onHashtagPress?: (tag: string) => void;
};

type Mention = {
	username: string;
	start: number;
	end: number;
};

type Hashtag = {
	tag: string;
	start: number;
	end: number;
};

type Match = {
	start: number;
	end: number;
	onPress: () => void;
};

export default function Hyperlinks({
	text,
	hyperlinkStyle,
	autoDetectMentions = true,
	autoDetectHastags = true,
	linkify = linkifyIt(),
	onLinkPress,
	onMentionPress,
	onHashtagPress,
	style,
	...textProps
}: HyperlinksProps) {
	const matches = linkify.match(text) ?? [];

	const detectedMentions = autoDetectMentions ? getMentions(text) : [];

	const hashtags = autoDetectHastags ? getHashtags(text) : [];

	if (
		matches.length === 0 &&
		detectedMentions.length === 0 &&
		hashtags.length === 0
	) {
		return (
			<Text style={style} {...textProps}>
				{text}
			</Text>
		);
	}

	const allMatches: Array<Match> = [];

	function handleOnLinkPress(url: string) {
		try {
			if (onLinkPress) {
				onLinkPress(url);
			} else {
				Linking.openURL(url);
			}
		} catch {}
	}

	matches.forEach((match) => {
		allMatches.push({
			start: match.index,
			end: match.lastIndex,
			onPress: () =>
				match.raw.startsWith("@")
					? onMentionPress?.(match.raw.replace("@", ""))
					: handleOnLinkPress(match.url),
		});
	});

	detectedMentions.forEach((mention) => {
		allMatches.push({
			start: mention.start,
			end: mention.end,
			onPress: () => {
				onMentionPress?.(mention.username);
			},
		});
	});

	hashtags.forEach((hashtag) => {
		allMatches.push({
			start: hashtag.start,
			end: hashtag.end,
			onPress: () => {
				onHashtagPress?.(hashtag.tag);
			},
		});
	});

	const orderedMatches = allMatches.sort((a, b) => {
		return a.start - b.start;
	});

	const chunks: Array<{ label: string; onPress?: () => void }> = [];

	orderedMatches.forEach((match, index) => {
		const isFirst = index === 0;

		if (isFirst) {
			if (match.start !== 0) {
				chunks.push({
					label: text.substring(0, match.start),
				});
			}
		}

		chunks.push({
			label: text.substring(match.start, match.end),
			onPress: match.onPress,
		});

		const hasNext = orderedMatches.length !== index + 1;

		if (hasNext) {
			chunks.push({
				label: text.substring(match.end, orderedMatches[index + 1].start),
			});
		} else {
			const hasMoreText = text.length > match.end;

			if (hasMoreText) {
				chunks.push({
					label: text.substring(match.end, text.length),
				});
			}
		}
	});

	return (
		<Text style={style} {...textProps}>
			{chunks.map((chunk, index) => (
				<Text
					onPress={chunk.onPress}
					style={[style, chunk.onPress ? hyperlinkStyle : {}]}
					key={index}
				>
					{chunk.label}
				</Text>
			))}
		</Text>
	);
}

function getMentions(text: string) {
	const mentionedUsers: Mention[] = [];

	const regex = /\B@[a-zA-Z0-9_]+/gi;

	let match;

	while ((match = regex.exec(text)) != null) {
		mentionedUsers.push({
			username: match[0].replace("@", ""),
			start: match.index,
			end: match[0].length + match.index,
		});
	}

	return mentionedUsers;
}

function getHashtags(text: string) {
	const hashtags: Hashtag[] = [];

	const regex = /\B#[a-zA-Z0-9_]+/gi;

	let match;

	while ((match = regex.exec(text)) != null) {
		hashtags.push({
			tag: match[0].replace("#", ""),
			start: match.index,
			end: match[0].length + match.index,
		});
	}

	return hashtags;
}
