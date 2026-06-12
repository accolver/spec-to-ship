# Generic Dashboard UI Review

## Verdict

Changes requested.

## Findings

1. **Accessibility evidence is missing** — The PR does not provide evidence for keyboard navigation, focus states, semantic labels, color contrast, or screen-reader behavior. Dashboard UIs can look correct while still being unusable for assistive-technology users.

2. **Responsive behavior evidence is missing** — The PR does not show how the dashboard behaves across common viewport sizes. Please include mobile/tablet/desktop screenshots or a short test note covering wrapping, overflow, charts/tables, and navigation.

## Recommendation

Before merge, provide accessibility and responsive validation evidence and fix any issues found.
