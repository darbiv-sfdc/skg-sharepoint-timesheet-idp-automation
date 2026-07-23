# Setup Cursor

Configure workspace for Cursor and install prerequisites.

## Execution

```bash
mkdir -p temp && \
([ -f ./install-r-genie.sh ] && ./install-r-genie.sh || [ -f ./temp/install-r-genie.sh ] && ./temp/install-r-genie.sh) && \
[ -d temp/.cursor ] && mv temp/.cursor . ; \
[ -f temp/.cursorignore ] && mv temp/.cursorignore . ; \
[ -d .windsurf ] && mv .windsurf temp/ ; \
[ -f .windsurfignore ] && mv .windsurfignore temp/ ; \
[ -f ./install-r-genie.sh ] && mv ./install-r-genie.sh temp/ ; \
echo "✅ Cursor setup complete!"
```

## What It Does
1. Runs R-GENIE installer (Node.js, DataWeave CLI, Maven)
2. Restores `.cursor/` and `.cursorignore` from `temp/` (if present)
3. Moves `.windsurf/` and `.windsurfignore` to `temp/`
4. Moves installer script to `temp/` (cleanup)

## Notes
- Run from repository root
- To switch to Windsurf, use `/setup-windsurf`
- Safe to run multiple times
