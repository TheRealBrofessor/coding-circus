interface CodePanelProps {
  code: string;
}

export function CodePanel({ code }: CodePanelProps) {
  return (
    <div className="panel code-panel">
      <div className="panel-header">Generated Python</div>
      <pre className="code-panel-body">
        <code>{code}</code>
      </pre>
    </div>
  );
}
