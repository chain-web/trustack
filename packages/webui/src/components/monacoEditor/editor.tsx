import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import './editor.css';
import './worker';

interface IProps {
  value?: string;
  onBlur?: (val: string) => void;
}

export const MonacoEditor = (props: IProps) => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value: props.value || '',
          language: 'javascript',
        });
      });
      editor?.onDidBlurEditorText(() => {
        props.onBlur && props.onBlur(editor?.getValue());
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return <div className="monaco-editor" ref={monacoEl}></div>;
};
