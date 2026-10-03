# Coding Circus — product truth

## Product

Coding Circus is a browser-based visual Python learning environment.

A learner builds a program with structured blocks, sees the real Python generated from those blocks, runs that Python in the browser, sees useful output/errors, and can export real Python code.

The product is not meant to hide Python. The blocks are scaffolding that should help a learner understand and eventually work directly with the language.

## Primary audiences

The intended audience includes:

- younger people learning programming;
- beginners learning Python;
- computer-science students who need a visual bridge into code;
- cybersecurity learners who need practical Python fundamentals.

Specific age ranges, classroom grade levels, and prerequisite knowledge are not yet defined and should not be invented in product copy until decided.

## Core promise

A learner should be able to move through this loop:

**build with blocks -> see Python -> run Python -> understand the result -> fix mistakes -> export real Python**

Success is not measured by how long someone stays inside Coding Circus. Success is a learner needing the blocks less over time.

## Product principles

### Real Python stays visible

Generated code is part of the learning experience, not an implementation detail.

### Visual does not mean childish

The interface can be approachable without looking like a toy. It should remain credible for teenagers, adults, CS students, instructors, and cybersecurity learners.

### Teach transfer, not dependency

Lessons and projects should help learners transfer concepts into normal `.py` files, editors, terminals, and development environments.

### Errors are teaching moments

Readable error explanations should help learners understand what failed while preserving access to the real traceback for learners who are ready for it.

### Fast path to doing

A first-time visitor should be able to make and run something without creating an account or configuring a development environment.

### Privacy-first classroom baseline

The initial learning experience should not require accounts, public profiles, direct messages, advertising, behavioral tracking, or unnecessary personal data collection.

## Current technical shape

- React + TypeScript + Vite.
- Blockly-based visual editor.
- Python execution in the browser through Pyodide/Web Worker infrastructure.
- Local project save/load.
- Import/export for project files.
- Export to real Python files.
- No backend is required for the core learning loop.

This section should describe what is actually shipped. Future capabilities belong in a roadmap, not here.

## Learning direction

The learning system should eventually support a progression such as:

1. output and simple expressions;
2. variables and data types;
3. conditions;
4. loops;
5. functions;
6. lists/collections;
7. debugging;
8. small complete projects;
9. transition exercises using exported/raw Python.

This is a direction, not a finalized curriculum.

## Cybersecurity direction

Cybersecurity material should use Python to teach defensive, analytical, and foundational skills rather than turning the learning product into an exploitation toolkit.

Good candidate project themes include:

- parsing synthetic log files;
- normalizing indicators from safe fixture data;
- hashing demonstrations;
- file metadata exercises;
- simple data transformations;
- network/protocol field concepts using static or simulated data.

## Design direction

The interface should feel like a serious creative workbench rather than a dashboard full of generic cards.

Design work should prioritize:

- obvious hierarchy;
- large, understandable work areas;
- strong connection between blocks and generated Python;
- readable output and errors;
- keyboard and accessibility support;
- clear progress from guided examples to independent work;
- a visual identity specific to Coding Circus rather than generic SaaS styling.

## Impeccable usage

Use Impeccable to critique and improve the interface after this product truth is understood.

Recommended order:

1. audit;
2. critique;
3. resolve comprehension/accessibility problems;
4. distill unnecessary visual complexity;
5. polish only after the learning flow is correct.

Impeccable should not invent the audience, curriculum, pedagogy, or product purpose.

## Open decisions

These require owner input before implementation or public claims:

- exact age/grade range, if any;
- whether teachers get a dedicated classroom mode;
- whether accounts/cloud sync will ever be required;
- whether progress tracking belongs in the product;
- whether the cybersecurity path is a first-class curriculum or a project pack;
- how much game/gamification structure, if any, is appropriate;
- where the canonical hosted version will live.
