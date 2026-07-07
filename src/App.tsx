import { useCallback, useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import { AboutPage } from './components/AboutPage';
import { BlockEditor } from './components/BlockEditor';
import { CodePanel } from './components/CodePanel';
import { ConsolePanel, type ConsoleLine } from './components/ConsolePanel';
import { LiveDemo } from './components/LiveDemo';
import { StagePanel } from './components/StagePanel';
import { Toolbar } from './components/Toolbar';
import { BrowserPyodideRunner } from './runner/BrowserPyodideRunner';
import type { NormalizedError } from './runner/RunResult';
import { listProjects, loadProject, saveProject } from './project/ProjectStorage';
import { exportProjectJson, exportPython, readProjectJsonFile } from './project/ProjectExport';
import type { ProjectFile } from './project/types';
import './App.css';

const RUN_TIMEOUT_MS = 20_000;
const INTRO_SESSION_KEY = 'coding-circus:intro-seen';
const DEFAULT_PROJECT_NAME = 'my-first-program';

function loadWorkspaceState(workspace: Blockly.Workspace, state: unknown): void {
  workspace.clear();
  Blockly.serialization.workspaces.load(state as never, workspace);
}

export default function App() {
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [stageText, setStageText] = useState('');
  const [error, setError] = useState<NormalizedError | null>(null);
  const [showRawTraceback, setShowRawTraceback] = useState(false);
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const runnerRef = useRef<BrowserPyodideRunner | null>(null);
  if (!runnerRef.current) runnerRef.current = new BrowserPyodideRunner();

  useEffect(() => {
    setSavedProjects(listProjects());
    const runner = runnerRef.current!;
    runner.init().catch(() => {
      // Surfaced to the user on the first Run attempt instead of on load.
    });
    return () => runner.dispose();
  }, []);

  const appendConsole = useCallback((kind: ConsoleLine['kind'], text: string) => {
    setConsoleLines((prev) => [...prev, { kind, text }]);
  }, []);

  const saveCurrentProject = useCallback(() => {
    const workspace = workspaceRef.current;
    if (!workspace || !projectName.trim()) return false;
    saveProject(projectName.trim(), Blockly.serialization.workspaces.save(workspace));
    setSavedProjects(listProjects());
    return true;
  }, [projectName]);

  const clearRuntimeOutput = useCallback(() => {
    setConsoleLines([]);
    setStageText('');
    setError(null);
    setShowRawTraceback(false);
    setIsRunning(false);
  }, []);

  const handleRun = useCallback(async () => {
    setConsoleLines([]);
    setStageText('');
    setError(null);
    setIsRunning(true);

    const result = await runnerRef.current!.run(code, {
      timeoutMs: RUN_TIMEOUT_MS,
      onStdout: (chunk) => {
        appendConsole('stdout', chunk);
        const lastLine = chunk.split('\n').filter((l) => l.length > 0).pop();
        if (lastLine) setStageText(lastLine);
      },
      onStderr: (chunk) => appendConsole('stderr', chunk),
    });

    setIsRunning(false);
    if (result.timedOut) {
      appendConsole('system', `Stopped: program ran longer than ${RUN_TIMEOUT_MS / 1000}s (possible infinite loop).`);
    } else if (result.stopped) {
      appendConsole('system', 'Stopped by user.');
    } else if (!result.success && result.error) {
      setError(result.error);
    }
  }, [code, appendConsole]);

  const handleStop = useCallback(() => {
    runnerRef.current!.stop();
  }, []);

  const handleReset = useCallback(async () => {
    runnerRef.current!.stop();
    clearRuntimeOutput();
    await runnerRef.current!.reset();
  }, [clearRuntimeOutput]);

  const handleNewProject = useCallback(async () => {
    const workspace = workspaceRef.current;
    const hasBlocks = Boolean(workspace?.getTopBlocks(false).length);
    const hasCode = code.trim().length > 0;
    const hasUnsavedWork = hasBlocks || hasCode;

    if (hasUnsavedWork) {
      const shouldSave = window.confirm('Save this project before starting a new one?');
      if (shouldSave) {
        saveCurrentProject();
      } else {
        const shouldDiscard = window.confirm('Start a new project without saving this one?');
        if (!shouldDiscard) return;
      }
    }

    runnerRef.current!.stop();
    workspace?.clear();
    setCode('');
    setProjectName(DEFAULT_PROJECT_NAME);
    clearRuntimeOutput();
    await runnerRef.current!.reset();
  }, [clearRuntimeOutput, code, saveCurrentProject]);

  const handleSave = useCallback(() => {
    saveCurrentProject();
  }, [saveCurrentProject]);

  const handleLoad = useCallback((name: string) => {
    const workspace = workspaceRef.current;
    const project = loadProject(name);
    if (!workspace || !project) return;
    loadWorkspaceState(workspace, project.workspaceJson);
    setProjectName(project.name);
  }, []);

  const handleExportPython = useCallback(() => {
    exportPython(projectName, code);
  }, [projectName, code]);

  const handleExportProject = useCallback(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const project: ProjectFile = {
      formatVersion: 1,
      name: projectName || 'project',
      updatedAt: new Date().toISOString(),
      workspaceJson: Blockly.serialization.workspaces.save(workspace),
    };
    exportProjectJson(project);
  }, [projectName]);

  const handleSaveDemo = useCallback(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const demoName = 'coding-circus-demo';
    saveProject(demoName, Blockly.serialization.workspaces.save(workspace));
    setSavedProjects(listProjects());
    setProjectName(demoName);
  }, []);

  const dismissIntro = useCallback(() => {
    setShowIntro(false);
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Session storage may be unavailable (private browsing); the intro will just replay next load.
    }
  }, []);

  const replayIntro = useCallback(() => setShowIntro(true), []);

  const handleImportProjectFile = useCallback(
    async (file: File) => {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      try {
        const project = await readProjectJsonFile(file);
        loadWorkspaceState(workspace, project.workspaceJson);
        setProjectName(project.name);
      } catch (err) {
        appendConsole('system', err instanceof Error ? err.message : 'Could not import that file.');
      }
    },
    [appendConsole],
  );

  return (
    <div className="app">
      <Toolbar
        isRunning={isRunning}
        onRun={handleRun}
        onStop={handleStop}
        onReset={handleReset}
        onNewProject={handleNewProject}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        savedProjects={savedProjects}
        onSave={handleSave}
        onLoad={handleLoad}
        onExportPython={handleExportPython}
        onExportProject={handleExportProject}
        onImportProjectFile={handleImportProjectFile}
        onReplayIntro={replayIntro}
        onAbout={() => setShowAbout(true)}
      />
      <div className="app-body">
        <BlockEditor
          onCodeChange={setCode}
          onWorkspaceReady={(workspace) => {
            workspaceRef.current = workspace;
          }}
        />
        <div className="app-side">
          <CodePanel code={code} />
          <ConsolePanel
            lines={consoleLines}
            error={error}
            showRawTraceback={showRawTraceback}
            onToggleRawTraceback={() => setShowRawTraceback((v) => !v)}
          />
          <StagePanel text={stageText} isRunning={isRunning} />
        </div>
      </div>
      {showIntro && (
        <LiveDemo
          workspaceRef={workspaceRef}
          onReveal={dismissIntro}
          onRunDemo={handleRun}
          onSaveDemo={handleSaveDemo}
        />
      )}
      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
    </div>
  );
}
