# Due Dash

A student deadline planner built with Expo, React Native and TypeScript. The UI is a 1:1
recreation of the **TEAM SOKSULA Due Dash** Figma design (402 × 874 frames).

## Screens

| Route | Screen |
| --- | --- |
| `/` | Session check / redirect |
| `/welcome` | Marketing welcome with planner preview |
| `/login` | Sign-in form |
| `/home` | Planner home: greeting, deadline summary, due today, up next |
| `/calendar` | Month calendar with day detail, reminder preview and “looking ahead” |
| `/assignments` | Searchable, filterable assignment list with completed section |
| `/assignment/[id]` | Assignment detail: properties, brief, checklist, attachment |
| `/assignment/new` | Add assignment form with course/date/time pickers and checklist editor |
| `/assignment/[id]/edit` | Edit assignment with status, reminder and checklist |
| `/courses` | Course workload cards |
| `/reminders` | Reminder preference, notifications and scheduled reminders |
| `/progress` | Semester completion hero, weekly goals, recently completed |

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS). No custom development build is required.

## Verify

```bash
npm run typecheck
npm run lint
npx expo-doctor
```

## How it works

- **Expo Router** file-based routing under `src/app/`. Layout/navigation live in
  `src/app/_layout.tsx`.
- **State** is a single `AppDataProvider` (`src/hooks/use-app-data.tsx`) seeded from
  `src/lib/seed.ts` and persisted to **AsyncStorage** (`due-dash:data:v1`). Session state is
  stored separately (`due-dash:session:v1`).
- **Design tokens** are in `src/constants/` (colors, Inter type styles, measurements).
- **Components** are grouped as `cards/`, `common/`, `forms/` and `layout/`.
- **Date helpers** in `src/lib/dates.ts` produce deterministic display strings
  (“Today · 5:00 PM”, “20 Oct”, etc.).
- Icons come from `lucide-react-native`; Inter is loaded per weight so only four TTFs are
  bundled.
- Everything works offline — there is no backend. Sign in with any email/password; the
  planner data, reminders, checklists and goals persist on the device.
