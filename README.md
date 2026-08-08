# A simple and customizable library to display hyperlinks in React Native

### Features ✨

- 🛑 Automatic detection for links, mentions and hashtags
- 🔤 Full unicode support
- 🌐 International domains support
- 💅 Custom hyperlink style
- ⚙️ Custom linkify-it instance
- 📦 Tiny
- 🚀 Created with Typescript

<img alt="Without this library vs with this library" src="assets/screenshot.jpg" width="500"/>

### About 🗞️

Uses [linkify-it](https://github.com/markdown-it/linkify-it) under the hood. Created for my social network app, [Rybun](https://rybun.com)

### Installation ⚙️

```bash
yarn add react-native-hyperlinks linkify-it
```

### Usage 🔨

```tsx
import React from "react";
import { Linking } from "react-native";
import Hyperlinks from "react-native-hyperlinks";

export default function App() {
  function handleOnLinkPress(link: string) {
    console.log(link)
  }

  function handleOnMentionPress (username: string) {
    console.log(username)
  }

  function handleOnHashtagPress (tag: string) {
    console.log(tag)
  }

  return (
    <Hyperlinks
      text="Hello!! @andresribeiro #hi https://duck.com aaaaa"
      style={{ fontSize: 18 }}
      hyperlinkStyle={{ color: 'purple' }}
      onLinkPress={handleOnLinkPress}
      onMentionPress={handleOnMentionPress}
      onHashtagPress={handleOnHashtagPress}
    />
  );
}
```

### Props ✍️

| Property | Default | Type | Required
| ---- | ---- | ---- | ----
| `text` | `undefined` | `string` | `true`
| `hyperlinkStyle` | `undefined` | `StyleProp<TextStyle>` | `false`
| `autoDetectMentions` | `true` | `boolean` | `false`
| `autoDetectHashtags` | `true` | `boolean` | `false`
| `customHyperlinks` | `undefined` | `CustomHyperlink[]` | `false`
| `onLinkPress` | `undefined` | `(link: string) => unknown` | `false`
| `onMentionPress` | `undefined` | `(username: string) => unknown` | `false`
| `onHashtagPress` | `undefined` | `(tag: string) => unknown` | `false`
| `onCustomHyperlinkPress` | `undefined` | `(hyperlink: CustomHyperlink) => unknown` | `false`
| `linkify` | `linkifyIt()` | `linkifyIt.LinkifyIt` | `false`
