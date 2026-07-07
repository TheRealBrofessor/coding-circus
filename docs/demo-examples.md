# Demo examples

Demo examples are registered in:

```text
src/demo/liveDemoScript.ts
```

To add another demo, add a new object to `DEMO_EXAMPLES`:

```ts
{
  id: 'my-new-demo',
  name: 'My new demo',
  script: {
    container: {
      type: 'python_repeat',
      valueInputName: 'TIMES',
      shadow: { type: 'python_number', field: 'NUM', value: 1 },
      statementInputName: 'DO',
    },
    steps: [
      {
        type: 'python_print',
        valueInputName: 'VALUE',
        shadow: { type: 'python_string', field: 'TEXT', value: 'Hello from a new demo' },
      },
    ],
  },
}
```

The toolbar automatically shows every demo in `DEMO_EXAMPLES` in the demo selector next to the Demo button.

Current demo step format supports statement blocks with one value input, such as:

```text
python_print
python_wait
```

For richer demos that build variables, lists, conditionals, or functions, extend `DemoStatementStep` and `DemoPlayer.ts` so steps can define full Blockly input trees instead of only one shadow value.
