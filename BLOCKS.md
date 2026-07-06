# Block Inventory

Every custom block, its category, and the Python it generates. All blocks are
covered by the generator test suite (`npm test`); "Notes" flags runtime
caveats, not codegen problems.

| Block type | Category | Generated Python | Status | Notes |
| --- | --- | --- | --- | --- |
| `python_string` | Values | `'text'` | ✅ Stable | Escaped via Blockly's `quote_` |
| `python_number` | Values | `42`, `3.5` | ✅ Stable | NaN/Infinity guard → `0` |
| `python_boolean` | Values | `True` / `False` | ✅ Stable | |
| `python_var_set` | Variables | `name = value` | ✅ Stable | Blockly-safe variable naming |
| `python_var_get` | Variables | `name` | ✅ Stable | |
| `python_print` | Text | `print(value)` | ✅ Stable | |
| `python_join` | Text | `str(a) + str(b)` | ✅ Stable | |
| `python_comment` | Text / Debug | `# text` | ✅ Stable | Newline-injection sanitized |
| `python_math_op` | Math | `a + b`, `a // b`, … | ✅ Stable | Unknown operator falls back to `+` |
| `python_compare` | Math | `a == b`, `a > b`, … | ✅ Stable | Unknown operator falls back to `==` |
| `python_logic_op` | Logic | `a and b` / `a or b` | ✅ Stable | |
| `python_not` | Logic | `not a` | ✅ Stable | |
| `python_if` | Control | `if cond:` | ✅ Stable | Empty branch → `pass` |
| `python_if_else` | Control | `if cond: … else: …` | ✅ Stable | Empty branches → `pass` |
| `python_repeat` | Control | `for count in range(n):` | ✅ Stable | Loop var collision-safe |
| `python_while` | Control | `while cond:` | ✅ Stable | |
| `python_repeat_until` | Control | `while not cond:` | ✅ Stable | |
| `python_count_with` | Control | `for i in range(a, b + 1):` | ✅ Stable | Inclusive upper bound |
| `python_break` | Control | `break` | ✅ Stable | Only valid inside a loop |
| `python_continue` | Control | `continue` | ✅ Stable | Only valid inside a loop |
| `python_wait` | Control | `time.sleep(s)` | ✅ Stable | Hoists `import time` once |
| `python_ask_text` | Input | `input(q)` | ✅ Stable | ⚠️ No stdin in browser runner — export to run |
| `python_ask_number` | Input | `float(input(q))` | ✅ Stable | ⚠️ Same browser limitation |
| `python_ask_integer` | Input | `int(input(q))` | ✅ Stable | ⚠️ Same browser limitation |
| `python_list_create` | Lists | `[a, b, c]` | ✅ Stable | Up to 3 items; empty slots skipped |
| `python_list_append` | Lists | `lst.append(x)` | ✅ Stable | |
| `python_list_get` | Lists | `lst[i]` | ✅ Stable | Python 0-based indexing |
| `python_list_length` | Lists | `len(x)` | ✅ Stable | |
| `python_for_each` | Lists | `for item in lst:` | ✅ Stable | Empty body → `pass` |
| `python_random_int` | Random | `random.randint(a, b)` | ✅ Stable | Hoists `import random` once |
| `python_random_float` | Random | `random.random()` | ✅ Stable | |
| `python_random_choice` | Random | `random.choice(lst)` | ✅ Stable | |
| `python_def` | Functions | `def name():` | ✅ Stable | No parameters (see ARCHITECTURE.md); names legalized |
| `python_call` | Functions | `name()` | ✅ Stable | Name-matched to the definition |
| `python_call_value` | Functions | `name()` (as value) | ✅ Stable | |
| `python_return` | Functions | `return value` | ✅ Stable | Only valid inside a function |
| `python_print_var` | Debug | `print('x', '=', x)` | ✅ Stable | |
| `python_show_type` | Debug | `type(v).__name__` | ✅ Stable | |
| `python_assert` | Debug | `assert cond, 'msg'` | ✅ Stable | |
| `python_say` | Stage | `print(value)` | ✅ Stable | Stage mirrors printed lines |
| `python_clear_stage` | Stage | `print()` | ✅ Stable | Empty printed line clears the stage |
