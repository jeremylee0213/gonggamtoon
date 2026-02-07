import type { Story, Style } from '../types';

export function getCharacterForStory(style: Style, story: Story): string {
  const hash = story.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return style.chars[hash % style.chars.length];
}
