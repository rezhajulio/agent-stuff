# rezha-agent-stuff

Custom [Pi](https://pi.dev) extensions and skills by **Rezha Julio**.

Enhance your AI coding agent experience with Tavily web search, fun working messages, git checkpoints, and questionnaire-based skill inputs.

## Installation

### Option 1: Direct Copy (Recommended)

Clone and copy files to Pi's directories:

```bash
# Clone the repo
git clone https://github.com/rezhapradana/agent-stuff.git
cd agent-stuff

# Copy extensions to Pi
cp pi-extensions/*.ts ~/.pi/agent/extensions/

# Copy skills to Pi
cp -r pi-skills/* ~/.agents/skills/

# Restart Pi or run /reload
```

### Option 2: Pi Package (via Git)

Install directly from GitHub:

```bash
pi install rezhapradana/agent-stuff
```

### Option 3: Symlink (For Development)

Symlink for live editing:

```bash
# Extensions
ln -sf /path/to/agent-stuff/pi-extensions/* ~/.pi/agent/extensions/

# Skills
ln -sf /path/to/agent-stuff/pi-skills/* ~/.agents/skills/
```

## Extensions

| Extension | Description |
|-----------|-------------|
| [web-search](pi-extensions/web-search.ts) | Tavily-powered `web_search`, `web_extract`, and `web_crawl` tools |
| [titlebar-spinner](pi-extensions/titlebar-spinner.ts) | Braille spinner animation in terminal title while agent works |
| [whimsical](pi-extensions/whimsical.ts) | Random fun phrases replacing "Working..." |
| [git-checkpoint](pi-extensions/git-checkpoint.ts) | Git stash checkpoints at each turn for fork restoration |
| [questionnaire](pi-extensions/questionnaire.ts) | Multi-question UI with tab navigation for structured input |

### RTK (Optional)

For token savings with pi-rtk-optimizer, install the RTK binary:

```bash
# macOS / Linux (Homebrew)
brew install rtk-ai/tap/rtk

# Or via Cargo
cargo install --git https://github.com/rtk-ai/rtk rtk

# Verify
rtk --version
rtk gain
```

### Web Search Setup

Add your Tavily API key to `~/.pi/agent/auth.json`:

```json
{
  "tavily": { "type": "api_key", "key": "tvly-YOUR_KEY_HERE" }
```

Or set the environment variable:

```bash
export TAVILY_API_KEY="tvly-YOUR_KEY_HERE"
```

## Skills

These skills are enhanced to use the `questionnaire` tool for structured user input:

| Skill | Description |
|-------|-------------|
| [brainstorming](pi-skills/brainstorming/) | Design exploration with questionnaire-based choices |
| [finishing-a-development-branch](pi-skills/finishing-a-development-branch/) | Branch completion with 4-option questionnaire |
| [using-git-worktrees](pi-skills/using-git-worktrees/) | Worktree setup with directory selection questionnaire |
| [writing-plans](pi-skills/writing-plans/) | Implementation planning with execution approach choice |
| [test-driven-development](pi-skills/test-driven-development/) | TDD workflow with skip confirmation questionnaire |

## Running Tests

```bash
npm install
npm test
```

## Included Dependencies

These are auto-installed when you install this package:

| Package | Description |
|---------|-------------|
| [pi-rtk-optimizer](https://www.npmjs.com/package/pi-rtk-optimizer) | RTK command rewriting & output compaction |
| [@samfp/pi-memory](https://www.npmjs.com/package/@samfp/pi-memory) | Persistent memory for corrections and preferences |

## Credits & Attribution

| File | Source | License |
|------|--------|---------|
| web-search.ts | [wayanjimmy/agent-stuff](https://github.com/wayanjimmy/agent-stuff) | MIT |
| titlebar-spinner.ts | [wayanjimmy/agent-stuff](https://github.com/wayanjimmy/agent-stuff) | MIT |
| whimsical.ts | [wayanjimmy/agent-stuff](https://github.com/wayanjimmy/agent-stuff) | MIT |
| git-checkpoint.ts | [earendil-works/pi/examples](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions) | MIT |
| questionnaire.ts | [earendil-works/pi/examples](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions) | MIT |

Skills based on Pi's built-in skill templates, modified to use questionnaire tool for structured input.

## License

MIT
