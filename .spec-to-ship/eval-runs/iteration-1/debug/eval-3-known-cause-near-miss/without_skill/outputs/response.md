# Baseline response

Since the parser is known to reject lowercase IDs, I would implement the regression and fix directly.

Plan:

1. Add a regression test showing that a lowercase ID is currently rejected.
2. Update the parser normalization or validation logic so lowercase IDs are accepted according to the intended format.
3. Keep existing tests for uppercase IDs and invalid IDs to avoid weakening validation too far.
4. Run the parser test suite and any relevant type-check/lint commands.

Expected result: lowercase IDs parse successfully, existing valid uppercase IDs still parse successfully, and malformed IDs remain rejected.
