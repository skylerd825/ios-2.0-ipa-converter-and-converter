# IPA Converter 2.0

[![Deploy to GitHub Pages](https://github.com/OWNER/REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/deploy.yml)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true)

A GitHub Pages + GitHub Codespaces-ready example of a browser-side **IPA inspector, ZIP repacker, and downloader**.

## Features

- Drag-and-drop `.ipa` selection.
- Runs conversion/repacking in the browser.
- Detects the standard `Payload/*.app` structure.
- Displays archive metadata and file entries.
- Downloads a `*-converted.ipa` copy.
- No backend or upload API required.
- GitHub Pages deployment through Actions.
- Dev Container configuration for Codespaces.
- Responsive dark UI.

## Important limitation

An IPA is a ZIP-compatible application bundle, but installation also depends on Apple's code-signing and provisioning requirements. This example **does not decrypt, crack, resign, patch, or bypass those protections**. The "conversion" step is a browser-side archive repack.

For a production workflow that needs legitimate signing, use Apple's supported signing/provisioning workflow on a Mac or a properly authorized CI environment.

## Repository layout

```text
.
├── .devcontainer/
│   └── devcontainer.json
├── .github/
│   └── workflows/
│       └── deploy.yml
├── conversion/
│   ├── images/
│   │   ├── favicon.ico
│   │   └── logo.png
│   └── modules/
│       ├── converter.js
│       └── ui.js
├── deployment/
│   └── assets/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── app.js
├── index.html
├── LICENSE
└── README.md
```

## Run locally

Because ES modules are used, serve the repository over HTTP rather than opening `index.html` directly.

With Python:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

1. Push the repository to GitHub.
2. Use the `main` branch.
3. In **Settings → Pages**, set the source to **GitHub Actions**.
4. Push a change to `main`, or manually run the workflow.
5. The workflow publishes the repository root as the Pages artifact.

If your repository is not named `OWNER/REPO`, update the two badge URLs at the top of this README.

## GitHub Codespaces

Open the repository in Codespaces. The included Dev Container uses Node.js and VS Code extensions suitable for editing this static JavaScript project.

## License

MIT. See `LICENSE`.
