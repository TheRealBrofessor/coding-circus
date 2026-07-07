import { useRef } from 'react';
import type { DemoExample } from '../demo/liveDemoScript';

interface ToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  onNewProject: () => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  savedProjects: string[];
  onSave: () => void;
  onLoad: (name: string) => void;
  onExportPython: () => void;
  onExportProject: () => void;
  onImportProjectFile: (file: File) => void;
  onReplayIntro?: () => void;
  demoExamples: DemoExample[];
  selectedDemoId: string;
  onSelectedDemoChange: (id: string) => void;
  onAbout: () => void;
}

export function Toolbar({
  isRunning,
  onRun,
  onStop,
  onReset,
  onNewProject,
  projectName,
  onProjectNameChange,
  savedProjects,
  onSave,
  onLoad,
  onExportPython,
  onExportProject,
  onImportProjectFile,
  onReplayIntro,
  demoExamples,
  selectedDemoId,
  onSelectedDemoChange,
  onAbout,
}: ToolbarProps) {
  const importInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="toolbar">
      <div className="toolbar-brand">🎪 Coding Circus</div>

      <div className="toolbar-group">
        <button className="btn btn-run" onClick={onRun} disabled={isRunning}>
          ▶ Run
        </button>
        {onReplayIntro && (
          <>
            <button className="btn" onClick={onReplayIntro}>
              Demo
            </button>
            <select
              className="project-load-select demo-example-select"
              value={selectedDemoId}
              aria-label="Demo example"
              onChange={(e) => onSelectedDemoChange(e.target.value)}
            >
              {demoExamples.map((demo) => (
                <option key={demo.id} value={demo.id}>
                  {demo.name}
                </option>
              ))}
            </select>
          </>
        )}
        <button className="btn" onClick={onStop} disabled={!isRunning}>
          ■ Stop
        </button>
        <button className="btn" onClick={onReset}>
          ↺ Reset
        </button>
        <button className="btn" onClick={onNewProject}>
          ＋ New
        </button>
      </div>

      <div className="toolbar-group toolbar-project">
        <input
          className="project-name-input"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="project name"
        />
        <button className="btn" onClick={onSave}>
          Save
        </button>
        <select
          className="project-load-select"
          value=""
          onChange={(e) => {
            if (e.target.value) onLoad(e.target.value);
          }}
        >
          <option value="" disabled>
            Load…
          </option>
          {savedProjects.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button className="btn" onClick={onExportPython}>
          Export .py
        </button>
        <button className="btn" onClick={onExportProject}>
          Export project
        </button>
        <button className="btn" onClick={() => importInputRef.current?.click()}>
          Import project
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json"
          className="hidden-file-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportProjectFile(file);
            e.target.value = '';
          }}
        />
        <button className="btn btn-about" onClick={onAbout}>
          About
        </button>
      </div>
    </div>
  );
}
