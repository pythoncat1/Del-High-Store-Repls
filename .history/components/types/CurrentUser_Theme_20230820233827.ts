type EditorSyntaxHighlightingTag = {
  name: string;
  modifiers: string[];
  values: string[];
};

type EditorSyntaxHighlighting = {
  tags: EditorSyntaxHighlightingTag[];
};

type ThemeValues = {
  editor: {
    syntaxHighlighting: EditorSyntaxHighlighting;
  };
  global: {
    backgroundRoot: string;
    backgroundDefault: string;
    backgroundHigher: string;
    backgroundHighest: string;
    backgroundOverlay: string;
    foregroundDefault: string;
    foregroundDimmer: string;
    foregroundDimmest: string;
    outlineDimmest: string;
    outlineDimmer: string;
    outlineDefault: string;
    outlineStronger: string;
    outlineStrongest: string;
    accentPrimaryDimmest: string;
    accentPrimaryDimmer: string;
    accentPrimaryDefault: string;
    accentPrimaryStronger: string;
    accentPrimaryStrongest: string;
    accentPositiveDimmest: string;
    accentPositiveDimmer: string;
    accentPositiveDefault: string;
    accentPositiveStronger: string;
    accentPositiveStrongest: string;
    accentNegativeDimmest: string;
    accentNegativeDimmer: string;
    accentNegativeDefault: string;
    accentNegativeStronger: string;
    accentNegativeStrongest: string;
    redDimmest: string;
    redDimmer: string;
    redDefault: string;
    redStronger: string;
    redStrongest: string;
    orangeDimmest: string;
    orangeDimmer: string;
    orangeDefault: string;
    orangeStronger: string;
    orangeStrongest: string;
    yellowDimmest: string;
    yellowDimmer: string;
    yellowDefault: string;
    yellowStronger: string;
    yellowStrongest: string;
    limeDimmest: string;
    limeDimmer: string;
    limeDefault: string;
    limeStronger: string;
    limeStrongest: string;
    greenDimmest: string;
    greenDimmer: string;
    greenDefault: string;
    greenStronger: string;
    greenStrongest: string;
    tealDimmest: string;
    tealDimmer: string;
    tealDefault: string;
    tealStronger: string;
    tealStrongest: string;
    blueDimmest: string;
    blueDimmer: string;
    blueDefault: string;
    blueStronger: string;
    blueStrongest: string;
    blurpleDimmest: string;
    blurpleDimmer: string;
    blurpleDefault: string;
    blurpleStronger: string;
    blurpleStrongest: string;
    purpleDimmest: string;
    purpleDimmer: string;
    purpleDefault: string;
    purpleStronger: string;
    purpleStrongest: string;
    magentaDimmest: string;
    magentaDimmer: string;
    magentaDefault: string;
    magentaStronger: string;
    magentaStrongest: string;
    pinkDimmest: string;
    pinkDimmer: string;
    pinkDefault: string;
    pinkStronger: string;
    pinkStrongest: string;
    greyDimmest: string;
    greyDimmer: string;
    greyDefault: string;
    greyStronger: string;
    greyStrongest: string;
    brownDimmest: string;
    brownDimmer: string;
    brownDefault: string;
    brownStronger: string;
    brownStrongest: string;
    black: string;
    white: string;
  };
};

type CustomTheme = {
  colorScheme: string;
};

type ActiveThemeVersion = {
  customTheme: CustomTheme;
  values: ThemeValues;
};

type CurrentUserThemeQuery = {
  currentUser: {
    activeThemeVersion: ActiveThemeVersion;
  };
};

export default CurrentUserThemeQuery;