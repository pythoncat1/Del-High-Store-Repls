import { ReactElement, JSXElementConstructor } from "react";
import showdown from "showdown";
import ReactHtmlParser from "react-html-parser";
import { Extension as CodeMirrorExtension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { json } from "@codemirror/lang-json";
import { rust } from "@codemirror/lang-rust";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { xml } from "@codemirror/lang-xml";
import { graphql } from "cm6-graphql";
import { brainfuck } from "codemirror-lang-brainfuck";
import { nix } from "@replit/codemirror-lang-nix";
import { solidity } from "@replit/codemirror-lang-solidity";
import { svelte } from "@replit/codemirror-lang-svelte";
import { csharp } from "@replit/codemirror-lang-csharp";
import { IconButton, icons } from "../rui";
import DOMPurify from "dompurify";

const mappedExtensions = {
  js: javascript(),
  javascript: javascript(),
  ts: javascript({ typescript: true }),
  jsx: javascript({ jsx: true }),
  tsx: javascript({ jsx: true, typescript: true }),
  markdown: markdown(),
  mdown: markdown(),
  mkdn: markdown(),
  mdwn: markdown(),
  md: markdown(),
  html: html(),
  xml: xml(),
  rss: xml(),
  py: python(),
  python: python(),
  css: css(),
  cpp: cpp(),
  c: cpp(),
  java: java(),
  json: json(),
  php: php(),
  rs: rust(),
  gql: graphql(),
  graphql: graphql(),
  bf: brainfuck(),
  brainfuck: brainfuck(),
  brainf: brainfuck(),
  nix: nix(),
  solidity: solidity,
  sol: solidity,
  svelte: svelte(),
  csharp: csharp(),
  cs: csharp()
};

export function codeMirror(
  value: string,
  editorTheme: CodeMirrorExtension | null,
  language?: keyof typeof mappedExtensions
) {
  return (
    <div>
      <CodeMirror
        value={value}
        readOnly={true}
        editable={false}
        extensions={
          language && mappedExtensions[language] ? [mappedExtensions[language]] : []
        }
        basicSetup={false}
        theme={editorTheme ?? "dark"}
      ></CodeMirror>
      <IconButton
        alt="Copy code to clipboard"
        type="button"
        size={24}
        onClick={() => navigator.clipboard.writeText(value)}
      >
        <icons.Copy></icons.Copy>
      </IconButton>
    </div>
  );
}

export const markdownConverter = new showdown.Converter({
  emoji: true,
  openLinksInNewWindow: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  underline: true,
  simplifiedAutoLink: true,
  omitExtraWLInCodeBlocks: true,
  ghCodeBlocks: true,
  smartIndentationFix: true,
  simpleLineBreaks: true,
  ellipsis: true,
  moreStyling: true
});

export function markdownToHtml(
  content: string,
  editorTheme?: CodeMirrorExtension | null
): ReactElement<any, string | JSXElementConstructor<any>>[] {
  const openCode = content ? (content.match?.(/```/g)?.length ?? 0) % 2 === 1 : false;
  if (openCode) content += "\n```";
  let htmlString = markdownConverter.makeHtml(content);
  const purifiedHtmlString = DOMPurify.sanitize(htmlString, {
    FORBID_TAGS: ["style"]
  });
  const children = ReactHtmlParser(purifiedHtmlString);
  for (let pre of children.filter((child: ReactElement) => child.type === "pre")) {
    const code = pre.props.children[0];
    const lang = code.props?.className?.split(" ")?.[0]?.toLowerCase?.();
    const value = code.props.children[0];
    const wrapper = codeMirror(value, editorTheme ?? null, lang);
    children[children.indexOf(pre)] = wrapper;
  }
  return children;
}