# VEX

VEX is a fast, terminal-native study and knowledge system. It is universal by design: use it for NEET, university, everything, coding, language learning, or any topic-based study workflow.

## Installation

Vex is available on npm, so you can install it globally with a single command: `npm install -g vex-study`. Once installed, run `vex` from any directory in your terminal to launch the CLI. Vex automatically keeps your study data locally on your machine, so your notes, progress, and other data stay separate from the package itself.

## Install and run

```bash
cd vex
vex init
vex
```

Running `vex` in a normal terminal opens a dedicated full-screen terminal interface using the alternate terminal screen. VEX now isolates dashboard raw-key mode from text prompts, so letters typed into topic, subject, chapter, or note fields are not interpreted as dashboard commands.

### Dashboard keys

| Key | Action |
|---|---|
| `a` | Add a topic |
| `u` | Update a topic |
| `r` | Open the revision queue |
| `f` | Start a focus session |
| `s` | Open analytics |
| `i` | Open the inbox |
| `g` | Show Git status and sync commands |
| `h` | Show help |
| `q` | Quit and restore the previous terminal screen |

During a prompt, VEX temporarily pauses the dashboard key listener. After saving or canceling, it closes the prompt interface, restores raw mode, and redraws the dashboard. This prevents the prompt cancellation, line switching, and key leakage problems common in raw-mode terminal apps.

## Commands

```bash
vex add "Human Reproduction"
vex update "Human Reproduction"
vex review
vex stats
vex weak
vex search "reproduction"
vex focus "Human Reproduction"
vex inbox "Revise aldol condensation"
vex inbox
vex help
```

The current build also includes a dedicated reusable core module for data storage and Git operations, deterministic non-interactive prompt handling for scripts, serialized dashboard actions to prevent overlapping commands, and safer terminal cleanup when exiting.

## Connect VEX to GitHub

VEX stores everything as portable files in `.vex/data.json` and `.vex/notes/`. GitHub synchronization is therefore straightforward.

### 1. Create a GitHub repository

On GitHub, create a new repository such as `my-study-data`. For privacy, set it to **Private**. Do not add a README, `.gitignore`, or license if VEX will initialize the repository locally.

Copy either repository URL format:

```text
https://github.com/YOUR_USERNAME/my-study-data.git
git@github.com:YOUR_USERNAME/my-study-data.git
```

### 2. Initialize a local study-data folder

```bash
mkdir -p ~/study-data
cd ~/study-data
vex init
```

### 3. Connect the folder to GitHub

```bash
vex git setup https://github.com/YOUR_USERNAME/my-study-data.git
```

This initializes Git, configures `origin`, stages VEX files, and creates the initial commit.

### 4. Authenticate GitHub

For HTTPS, GitHub may ask for a username and a GitHub Personal Access Token instead of a password. Create a token from **GitHub → Settings → Developer settings → Personal access tokens**, grant only the repository permissions required, and never put the token in VEX files.

For SSH, add your SSH public key to GitHub first and use the SSH URL during setup.

### 5. Push study data

```bash
vex git push
```

This stages changes, creates a dated study commit, and pushes the `main` branch.

### 6. Pull on another computer

```bash
git clone https://github.com/YOUR_USERNAME/my-study-data.git ~/study-data
cd ~/study-data
vex git pull
```

### 7. Check status

```bash
vex git status
git status
git log --oneline
```

Pull before studying on a second device, and push after making changes. Avoid editing the same `.vex/data.json` on two computers at the same time.

## Data location

By default, VEX stores data in `.vex` in the current folder. To keep data in one dedicated location from anywhere:

```bash
export VEX_HOME="$HOME/study-data/.vex"
vex
```

Add that export to `~/.bashrc` or `~/.zshrc` to make it permanent.

##Thank you
