export interface DemoStatementStep {
  /** Blockly block type for the statement itself, e.g. "python_print". */
  type: string;
  /** Name of the statement's single value input, e.g. "VALUE" or "SECONDS". */
  valueInputName: string;
  /** The default shadow value block plugged into that input. */
  shadow: {
    type: string;
    field: string;
    value: string | number;
  };
}

export interface DemoScript {
  /** The outer container block (a repeat loop) everything gets built inside. */
  container: {
    type: string;
    valueInputName: string;
    shadow: { type: string; field: string; value: string | number };
    statementInputName: string;
  };
  steps: DemoStatementStep[];
}

const WAIT_SHORT = 0.15;

function typewriterStep(text: string): DemoStatementStep[] {
  return [
    { type: 'python_print', valueInputName: 'VALUE', shadow: { type: 'python_string', field: 'TEXT', value: text } },
    { type: 'python_wait', valueInputName: 'SECONDS', shadow: { type: 'python_number', field: 'NUM', value: WAIT_SHORT } },
  ];
}

/** Builds "Coding Circus" up on screen a few letters at a time, then a credit line, inside a loop. */
export const LIVE_DEMO_SCRIPT: DemoScript = {
  container: {
    type: 'python_repeat',
    valueInputName: 'TIMES',
    shadow: { type: 'python_number', field: 'NUM', value: 2 },
    statementInputName: 'DO',
  },
  steps: [
    ...typewriterStep('C'),
    ...typewriterStep('Codi'),
    ...typewriterStep('Coding'),
    ...typewriterStep('Coding Circus'),
    {
      type: 'python_print',
      valueInputName: 'VALUE',
      shadow: { type: 'python_string', field: 'TEXT', value: 'from the creative mind of BrofessorX' },
    },
    { type: 'python_wait', valueInputName: 'SECONDS', shadow: { type: 'python_number', field: 'NUM', value: 1.2 } },
  ],
};
