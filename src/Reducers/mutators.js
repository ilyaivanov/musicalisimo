export const playNode = node => node.merge({ isPlaying: true });
export const unplayNode = node => node.merge({ isPlaying: false });

export const showNode = node => node.merge({ isHidden: false });
export const hideNode = node => node.merge({ isHidden: true });