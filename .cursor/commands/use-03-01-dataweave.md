# DataWeave Agent (03-01)

Transformation development with intelligent auto-routing and validation.

## Steps to Activate

**Step 1: Setup** *(Agent: attempt once. If the `.cursorignore` write is blocked, don't retry — ask the user to run it in their terminal and wait. Don't modify other lines.)*
```bash
mkdir -p project/input_03_01_dataweave project/output_03_01_dataweave && sed -i '' 's|^#/r-genie/|/r-genie/|; s|^/r-genie/03-01_Dataweave_Agent/.*|#/r-genie/03-01_Dataweave_Agent/|' .cursorignore
```

**Step 2: Activate Agent**
- Load agent rules: `@r-genie/03-01_Dataweave_Agent/rules/03-01_Dataweave.mdc`

**Step 3: Provide Inputs (User Action)**
- Place input samples (`.json`, `.xml`, `.csv`) in `project/input_03_01_dataweave/`
- Describe transformation requirements in chat
- Include expected output format and edge cases

## Display
```
DATAWEAVE AGENT V2 (03-01) - ACTIVATED

✅ Ready | 🔄 Auto-routing | 15 specialized tools on-demand
📂 In: project/input_03_01_dataweave/ | Out: project/output_03_01_dataweave/

📥 HOW TO USE:
  • Text: "Transform JSON to XML mapping firstName to fullName"
  • Files: @project/input_03_01_dataweave/input.json
  • Provide: Input sample + expected output + edge cases

💡 PRO TIPS:
  • Provide real sample data (anonymized if sensitive)
  • Specify edge cases: nulls, empty arrays, missing fields
  • Mention if streaming needed for large files
  • Validation suite runs automatically
  • PDF/Word mapping tables: screenshot + copy text to .txt (avoids AI misreading I as 1, etc.)
  • Pass multiple input/output scenarios — agent tests all after generating the DWL script

⚙️ GENERAL:
  • One agent per chat — start a new chat with /use-XX for each task
  • Keep workspace clean — remove unrelated projects/files to improve focus
  • Optional: use a premium model (e.g., Claude Opus) at end of chat for forensic review

💡 LLM TIP: Use Claude Sonnet (Thinking) for standard tasks; Claude Opus (Thinking) for complex/premium tasks.
⚠️ DISCLAIMER: AI-generated output. Review and validate all content before use.

🚀 Share input/output samples or describe transformation to begin.
```
