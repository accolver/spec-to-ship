# Settings Dashboard Notification Preferences — Draft Spec

## Goal
Add an admin settings dashboard for managing notification preferences with a polished, easy-to-use experience.

## Open questions
1. Which notification channels are in scope: email, SMS, push, in-app, webhooks, or all of them?
2. Are preferences global defaults, per-admin preferences, per-team settings, or per-customer settings?
3. Do we need audit history for changes?
4. Should changes take effect immediately or after a save/publish flow?

## Proposed scope
- Admin-only page under the settings area.
- Table or grouped cards for notification types.
- Controls for enabling/disabling channels and setting frequency.
- Save/cancel actions with validation and success/error states.
- Backend API for reading and updating preferences.

## UX requirements
- Clear grouping by notification category.
- Sensible empty and loading states.
- Inline validation for invalid combinations.
- Confirmation messaging after saving.
- Responsive layout for desktop and tablet.

## Acceptance criteria
- Admins can view current notification preferences.
- Admins can update notification preferences and see confirmation.
- Non-admin users cannot access the page or API.
- Invalid inputs are rejected with clear messages.
- Dashboard looks consistent with existing design system.

## Implementation notes
After the fields are decided, create the page, API routes, persistence model, and tests.
