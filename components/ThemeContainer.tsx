import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { colorPicker } from './colorPreview';
import * as React from "react";
import gql from './gql';


const ThemeContainer = ({ themeData, sid }: any) => {
  const [content, setContent] = React.useState(JSON.stringify(themeData, null, 2))

  return (
    <div className="w-full border border-[#3C445C] rounded-md p-2">
      <div className="flex gap-1">
        <div className="text-lg font-semibold">{themeData.theme.title}</div>
        <div className="text-sm">(ID: {themeData.theme.id})</div>
      </div>


      <details>
        <summary className="p-2 my-1 btn hover:bg-[#1C2333] list-none">View JSON Data:</summary>
        <div className="rounded-md border border-[#3C445C] p-1">
          <div className="flex justify-start mb-1 gap-1">
            <button className="p-1 px-2 border border-[#1060a2] hover:border-[#1581d9] bg-[#1060a2] hover:bg-[#1581d9] btn" onClick={() => {
              gql("mutateTheme", sid, {
                input: {
                  description: "",
                  themeId: themeData.theme.id,
                  values: JSON.parse(content).theme.currentUserInstalledThemeVersion.values
                }
              })
            }}>Save Theme</button>
            <button className="p-1 px-2 border border-[#1060a2] hover:border-[#1581d9] bg-[#1060a2] hover:bg-[#1581d9] btn" onClick={() => {
              gql("setActiveTheme", sid, {
                input: {
                  themeId: themeData.theme.id
                }
              })
            }}>Set Active Theme</button>
          </div>
          <CodeMirror
            value={content}
            height="400px"
            onChange={(value) => {
              setContent(value)
            }}
            className="w-full rounded-md"
            theme={tokyoNight}
            extensions={[json(), indentationMarkers(), colorPicker]}
          />
        </div>



      </details>

    </div>
  )
}

export default ThemeContainer