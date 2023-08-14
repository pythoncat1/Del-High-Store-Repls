import {
  EditorView,
  WidgetType,
  ViewUpdate,
  ViewPlugin,
  DecorationSet,
  Decoration,
} from "@codemirror/view";
import { Range, Extension } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

interface PickerState {
  from: number;
  to: number;
  alpha: string;
  colorType: ColorType;
}

const pickerState = new WeakMap<HTMLInputElement, PickerState>();

enum ColorType {
  rgb = "RGB",
  hex = "HEX",
  hsl = "HSL",
}

function colorPickersDecorations(view: EditorView) {
  const widgets: Array<Range<Decoration>> = [];

  for (const range of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from: range.from,
      to: range.to,
      enter: ({ type, from, to }) => {
        const callExp: string = view.state.doc.sliceString(from, to);

        if (callExp.startsWith('"#')) {
          let tHex = view.state.doc.sliceString(from, to).replaceAll('"', "");

          const [color, alpha] = toFullHex(tHex);

          const widget = Decoration.widget({
            widget: new ColorPickerWidget({
              colorType: ColorType.hex,
              color,
              from,
              to,
              alpha,
            }),
            side: 1,
          });

          widgets.push(widget.range(from));
        }
      },
    });
  }

  return Decoration.set(widgets);
}

function toFullHex(color: string): string[] {
  if (color.length === 4) {
    // 3-char hex
    return [
      `#${color[1].repeat(2)}${color[2].repeat(2)}${color[3].repeat(2)}`,
      "",
    ];
  }

  if (color.length === 5) {
    // 4-char hex (alpha)
    return [
      `#${color[1].repeat(2)}${color[2].repeat(2)}${color[3].repeat(2)}`,
      color[4].repeat(2),
    ];
  }

  if (color.length === 9) {
    // 8-char hex (alpha)
    return [`#${color.slice(1, -2)}`, color.slice(-2)];
  }

  return [color, ""];
}

// If you get a negative value you need to add 1 to it.
// If you get a value above 1 you need to subtract 1 from it.
function clamp(num: number): number {
  if (num < 0) {
    return num + 1;
  }
  if (num > 1) {
    return num - 1;
  }
  return num;
}

/**
 * Now we need to do up to 3 tests to select the correct formula for each color channel. Let’s start with Red.
 *
 * test 1 – If 6 x temporary_R is smaller then 1, Red = temporary_2 + (temporary_1 – temporary_2) x 6 x temporary_R
 * In the case the first test is larger then 1 check the following
 *
 * test 2 – If 2 x temporary_R is smaller then 1, Red = temporary_1
 * In the case the second test also is larger then 1 do the following
 *
 * test 3 – If 3 x temporary_R is smaller then 2, Red = temporary_2 + (temporary_1 – temporary_2) x (0.666 – temporary_R) x 6
 * In the case the third test also is larger then 2 you do the following
 *
 * Red = temporary_2
 */
function hueToRGB(temp1: number, temp2: number, tempHue: number): number {
  if (6 * tempHue < 1) {
    return temp2 + (temp1 - temp2) * 6 * tempHue;
  }
  if (2 * tempHue < 1) {
    return temp1;
  }
  if (3 * tempHue < 2) {
    return temp2 + (temp1 - temp2) * (0.666 - tempHue) * 6;
  }
  return temp2;
}

// https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
function rgbToHSL(r: number, g: number, b: number): number[] {
  const redPercent = r / 255;
  const greenPercent = g / 255;
  const bluePercent = b / 255;
  const min = Math.min(redPercent, greenPercent, bluePercent);
  const max = Math.max(redPercent, greenPercent, bluePercent);
  const luminance = (max + min) / 2;
  // If the min and max value are the same, it means that there is no saturation. ...
  // If there is no Saturation, we don’t need to calculate the Hue. So we set it to 0 degrees.
  if (max === min) {
    return [0, 0, luminance];
  }

  let saturation: number;
  // If Luminance is less or equal to 0.5, then Saturation = (max-min)/(max+min)
  if (luminance <= 0.5) {
    saturation = (max - min) / (max + min);
  } else {
    // If Luminance is bigger then 0.5. then Saturation = ( max-min)/(2.0-max-min)
    saturation = (max - min) / (2.0 - max - min);
  }

  let hue: number;
  // If Red is max, then Hue = (G-B)/(max-min)
  if (max === redPercent) {
    hue = (greenPercent - bluePercent) / (max - min);
  } else if (greenPercent === max) {
    // If Green is max, then Hue = 2.0 + (B-R)/(max-min)
    hue = 2.0 + (bluePercent - redPercent) / (max - min);
  } else {
    // If Blue is max, then Hue = 4.0 + (R-G)/(max-min)
    hue = 4.0 + (redPercent - greenPercent) / (max - min);
  }
  hue = Math.round(hue * 60); // convert to degrees
  // make hue positive angle/degrees
  while (hue < 0) {
    hue += 360;
  }
  return [hue, saturation, luminance];
}

export const wrapperClassName = "cm-css-color-picker-wrapper";

class ColorPickerWidget extends WidgetType {
  private readonly state: PickerState;
  private readonly color: string;

  constructor({
    color,
    ...state
  }: PickerState & {
    color: string;
  }) {
    super();
    this.state = state;
    this.color = color;
  }

  eq(other: ColorPickerWidget) {
    return (
      other.state.colorType === this.state.colorType &&
      other.color === this.color &&
      other.state.from === this.state.from &&
      other.state.to === this.state.to &&
      other.state.alpha === this.state.alpha
    );
  }

  toDOM() {
    const picker = document.createElement("input");
    pickerState.set(picker, this.state);
    picker.type = "color";
    picker.value = this.color;

    const wrapper = document.createElement("span");
    wrapper.appendChild(picker);
    wrapper.className = wrapperClassName;

    return wrapper;
  }

  ignoreEvent() {
    return false;
  }
}

const colorPickerTheme = EditorView.baseTheme({
  [`.${wrapperClassName}`]: {
    display: "inline-block",
    outline: "1px solid #eee",
    marginRight: "0.6ch",
    height: "1em",
    width: "1em",
    transform: "translateY(1px)",
  },
  [`.${wrapperClassName} input[type="color"]`]: {
    cursor: "pointer",
    height: "100%",
    width: "100%",
    padding: 0,
    border: "none",
    "&::-webkit-color-swatch-wrapper": {
      padding: 0,
    },
    "&::-webkit-color-swatch": {
      border: "none",
    },
    "&::-moz-color-swatch": {
      border: "none",
    },
  },
});

const colorPickerViewPlugin = ViewPlugin.fromClass(
  class ColorPickerViewPlugin {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = colorPickersDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = colorPickersDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
    eventHandlers: {
      change: (e, view) => {
        const target = e.target as HTMLInputElement;
        if (
          target.nodeName !== "INPUT" ||
          !target.parentElement ||
          !target.parentElement.classList.contains(wrapperClassName)
        ) {
          return false;
        }

        const data = pickerState.get(target)!;

        let converted = '"' + target.value + data.alpha + '"';

        view.dispatch({
          changes: {
            from: data.from,
            to: data.to,
            insert: converted,
          },
        });

        return true;
      },
    },
  }
);

export const colorPicker: Extension = [colorPickerViewPlugin, colorPickerTheme];
