import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly/core';
import { toolbox } from '../blockly/toolbox';
import { generatePython } from '../blockly/setup';

interface BlockEditorProps {
  onCodeChange: (code: string) => void;
  onWorkspaceReady: (workspace: Blockly.WorkspaceSvg) => void;
}

export function BlockEditor({ onCodeChange, onWorkspaceReady }: BlockEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const workspace = Blockly.inject(containerRef.current, {
      toolbox,
      // BASE_URL-relative so the app works at a subpath (e.g. GitHub Pages).
      media: `${import.meta.env.BASE_URL}blockly-media/`,
      trashcan: true,
      zoom: { controls: true, wheel: true, startScale: 1 },
      grid: { spacing: 20, length: 3, colour: '#e5e5e5', snap: true },
    });
    onWorkspaceReady(workspace);

    const handleChange = (event: Blockly.Events.Abstract) => {
      if (event.isUiEvent) return;
      onCodeChange(generatePython(workspace));
    };
    workspace.addChangeListener(handleChange);
    onCodeChange(generatePython(workspace));

    const resizeObserver = new ResizeObserver(() => Blockly.svgResize(workspace));
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      workspace.removeChangeListener(handleChange);
      workspace.dispose();
    };
    // Blockly workspace is created exactly once per mount; callbacks are read fresh via closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="block-editor" />;
}
