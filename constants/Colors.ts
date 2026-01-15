const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const white = '#fcfcfc';
const grey100 = '#f2f2f2';
const grey200 = '#e1e0db';
const grey300 = '#5b5448';
const grey400 = '#312d29';
const black = '#1c1717';
const primary = '#f0a095';
const primary50translucent = 'rgba(240, 160, 149, 0.5)';
const secondary = '#f6cec8';
const blue = '#0a7ea4';
const green = '#0a9a84';
const red = '#ef4444';
const yellow = '#facc15';

export const Colors = {
  light: {
    text: black,
    background: white,
    tint: tintColorLight,
    tabIconDefault: grey300,
    tabIconSelected: primary,
    primary: primary,
    primary50t: primary50translucent,
    secondary: secondary,
    blue: blue,
    green: green,
    red: red,
    yellow: yellow,
    border: grey400,
    backgroundSubtle: grey200,
    black: black,
    white: white,
  },
  dark: {
    text: white,
    background: black,
    tint: tintColorDark,
    tabIconDefault: grey200,
    tabIconSelected: primary,
    primary: primary,
    primary50t: primary50translucent,
    secondary: secondary,
    blue: blue,
    green: green,
    red: red,
    yellow: yellow,
    border: grey100,
    backgroundSubtle: grey300,
    black: black,
    white: white,
  },
};
