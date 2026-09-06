# Korvai Compass

A repertoire-based practice app for Carnatic music students learning kalpana swaram and korvai eDam.

## Run locally

Use a current Node.js release, then run:

```bash
npm install
npm run dev
```

The production site deploys to GitHub Pages when changes are pushed to `main`.

## Repertoire refresh

The app displays only the selected student's learned krithis. To keep the list current automatically, add the private `GOOGLE_SERVICE_ACCOUNT_JSON` repository secret for a service account that has Viewer access to the Music Classes workbook. The weekly GitHub Action reads only the `Ashwin Songs Taught` tab's Krithis section and publishes a refreshed repertoire list.
