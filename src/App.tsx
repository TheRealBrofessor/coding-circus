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
import './components/NewProjectDialog.css';

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
  const [newProjectDialog, setNewProjectDialog] = useState<{ isOpen: boolean; projectName: string }>({
    isOpen: false,
    projectName: '',
  });
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

  const markIntroSeen = useCallback(() => {
    setShowIntro(false);
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Session storage may be unavailable (private browsing); the intro will just replay next load.
    }
  }, []);

  const saveCurrentProject = useCallback(
    (nameOverride?: string) => {
      const workspace = workspaceRef.current;
      const name = (nameOverride ?? projectName).trim();
      if (!workspace || !name) return false;
      saveProject(name, Blockly.serialization.workspaces.save(workspace));
      setProjectName(name);
      setSavedProjects(listProjects());
      return true;
    },
    [projectName],
  );

  const clearRuntimeOutput = useCallback(() => {
    setConsoleLines([]);
    setStageText('');
    setError(null);
    setShowRawTraceback(false);
    setIsRunning(false);
  }, []);

  const startFreshProject = useCallback(async () => {
    runnerRef.current!.stop();
    workspaceRef.current?.clear();
    setCode('');
    setProjectName(DEFAULT_PROJECT_NAME);
    clearRuntimeOutput();
    await runnerRef.current!.reset();
  }, [clearRuntimeOutput]);

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
    if (showIntro) {
      markIntroSeen();
      workspaceRef.current?.clear();
      setCode('');
      setProjectName(DEFAULT_PROJECT_NAME);
    }
    setNewProjectDialog({ isOpen: false, projectName: '' });
    clearRuntimeOutput();
    await runnerRef.current!.reset();
  }, [clearRuntimeOutput, markIntroSeen, showIntro]);

  const handleNewProject = useCallback(async () => {
    const workspace = workspaceRef.current;
    const hasBlocks = Boolean(workspace?.getTopBlocks(false).length);
    const hasCode = code.trim().length > 0;

    if (!hasBlocks && !hasCode) {
      await startFreshProject();
      return;
    }

    setNewProjectDialog({
      isOpen: true,
      projectName: projectName === DEFAULT_PROJECT_NAME ? '' : projectName,
    });
  }, [code, projectName, startFreshProject]);

  const handleSaveAndStartNew = useCallback(async () => {
    const name = newProjectDialog.projectName.trim();
    if (!name) return;
    saveCurrentProject(name);
    setNewProjectDialog({ isOpen: false, projectName: '' });
    await startFreshProject();
  }, [newProjectDialog.projectName, saveCurrentProject, startFreshProject]);

  const handleDiscardAndStartNew = useCallback(async () => {
    setNewProjectDialog({ isOpen: false, projectName: '' });
    await startFreshProject();
  }, [startFreshProject]);

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
    markIntroSeen();
  }, [markIntroSeen]);

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
      {newProjectDialog.isOpen && (
        <div className="new-project-dialog" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
          <div className="new-project-card">
            <h2 id="new-project-title">Save before starting new?</h2>
            <p>There is code or blocks in the current project. Save it before opening a fresh workspace?</p>
            <label className="new-project-label" htmlFor="new-project-name">
              Project name
            </label>
            <input
              id="new-project-name"
              className="new-project-input"
              value={newProjectDialog.projectName}
              onChange={(e) => setNewProjectDialog((prev) => ({ ...prev, projectName: e.target.value }))}
              placeholder="Name this project"
              autoFocus
            />
            <div className="new-project-actions">
              <button className="btn btn-run" onClick={handleSaveAndStartNew} disabled={!newProjectDialog.projectName.trim()}>
                Yes, save
              </button>
              <button className="btn" onClick={handleDiscardAndStartNew}>
                No, discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
