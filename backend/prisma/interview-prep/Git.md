<!--LANG:roman-->

# Git Interview Questions

## 1. What is the difference between Git and GitHub?

**Asaan Urdu mein:**  
Git ek **distributed version control system** hai jo aapke local machine par chalti hai aur file changes ko track karti hai. GitHub ek **cloud‑based hosting service** hai jo Git repositories ko remote server par store karti hai aur pull requests, issue tracking, CI/CD jaisi extra facilities deti hai.  
```bash
# Git runs locally -- no internet required
git init my-project
git add .
git commit -m "Initial commit"

# GitHub stores a remote copy and adds collaboration features
git remote add origin https://github.com/user/my-project.git
git push -u origin main
```

---

## 2. What is the difference between git merge and git rebase?

**Asaan Urdu mein:**  
`git merge` do branch histories ko **naya merge commit** ke through jodta hai, isse original commit order barqarar rehta hai. `git rebase` ek branch ke commits ko doosri branch ke tip par **dobara likhta** hai, jis se linear history milti hai. Merge shared branches ke liye safe hai, rebase feature branches ko clean banata hai.  
```bash
# Merge -- preserves history with a merge commit
git checkout main
git merge feature-branch

# Rebase -- rewrites history to appear linear
git checkout feature-branch
git rebase main
```

---

## 3. What is a merge conflict and how do you resolve it?

**Asaan Urdu mein:**  
Merge conflict tab hota hai jab Git do alag branches se same file ke same hisson ko merge karne ki koshish karta hai aur automatically decide nahi kar pata. Git conflicted area ko `<<<<<<<`, `=======`, aur `>>>>>>>` markers se highlight karta hai. Aapko manually file edit karni hoti hai, markers hata kar sahi changes rakhne hote hain, phir stage aur commit karna hota hai.  
```bash
# After a merge fails with conflicts:
# Edit the conflicted file
cat index.html
# <<<<<<< HEAD
# <h1>Welcome</h1>
# =======
# <h1>Hello World</h1>
# >>>>>>> feature-branch

# Fix manually, then:
git add index.html
git commit -m "Resolve merge conflict in index.html"
```

---

## 4. What is the difference between git fetch and git pull?

**Asaan Urdu mein:**  
`git fetch` remote se naya data download karta hai lekin aapke working directory ko update nahi karta—sirf remote‑tracking branches ko refresh karta hai. `git pull` pehle `fetch` karta hai phir **merge** (ya rebase) karke current branch ko remote changes ke saath sync karta hai. Fetch use kar ke pehle changes dekh sakte hain.  
```bash
# Fetch -- downloads remote data, does NOT change working directory
git fetch origin
git log origin/main..main

# Pull -- fetches AND merges into current branch
git pull origin main
# Equivalent to: git fetch origin && git merge origin/main
```

---

## 5. What is the difference between git reset, git revert, and git checkout?

**Asaan Urdu mein:**  
`git reset` branch pointer ko peeche le jata hai aur staging/working area ko optionally modify karta hai—history rewrite hoti hai. `git revert` ek **naya commit** banata hai jo pehle ke commit ke changes ko undo karta hai, isse history safe rehti hai. `git checkout` branches switch karta hai ya files restore karta hai bina branch pointer ko badle.  
```bash
# Reset -- moves branch pointer, rewrites history (local use only)
git reset --hard HEAD~1

# Revert -- creates an anti-commit, safe for public branches
git revert abc1234

# Checkout -- switch branches or restore files
git checkout main
git checkout -- index.html  # discard working dir changes
```

---

## 6. What is the difference between --soft, --mixed, and --hard reset?

**Asaan Urdu mein:**  
`--soft` sirf HEAD ko move karta hai, saare changes **staged** rehte hain. `--mixed` (default) HEAD move karta hai, changes **unstaged** ho jate hain lekin working directory mein rehte hain. `--hard` HEAD move karta hai aur **staging + working directory** dono ko wipe out kar deta hai—changes permanently lost.  
```bash
# --soft: HEAD moves, index (staging) is untouched
git reset --soft HEAD~1
git status  # changes still staged

# --mixed: HEAD moves, index is reset, working dir untouched
git reset --mixed HEAD~1
git status  # changes unstaged but present

# --hard: HEAD moves, index and working dir are wiped
git reset --hard HEAD~1
```

---

## 7. What is a Git branch and how does it branch internally?

**Asaan Urdu mein:**  
Branch ek **lightweight movable pointer** hota hai jo kisi specific commit ko point karta hai. Internally, har branch ek 41‑byte file hoti hai (`.git/refs/heads/branch-name`) jisme commit SHA store hota hai. Naya branch banane se ek nayi ref file likhi jati hai, aur branch switch karne se `HEAD` us file ki target commit ki taraf point karta hai.  
```bash
# Create a branch -- just writes a ref file
git branch feature-auth

# Internally, this creates: .git/refs/heads/feature-auth
# containing the current commit hash

# Switch to it
git checkout feature-auth

# See all branch refs as files
ls .git/refs/heads/
```

---

## 8. What is the purpose of git stash?

**Asaan Urdu mein:**  
`git stash` aapke current **tracked changes** aur staged changes ko ek stack mein temporarily store karta hai, taake aap clean working directory le kar kisi aur kaam par switch kar saken. Baad mein `git stash pop` ya `apply` se changes wapas la sakte hain. Ye half‑done work ko commit kiye baghair safe rakhne ke liye useful hai.  
```bash
# Save current work to a stack
git stash
git stash push -m "WIP: auth form"

# Do something else
git checkout main
git pull

# Come back and restore
git checkout feature-branch
git stash pop

# List all stashes
git stash list
```

---

## 9. What is the difference between a fast-forward merge and a three-way merge?

**Asaan Urdu mein:**  
Fast‑forward merge tab hota hai jab target branch ne diverge nahi kiya hota; Git sirf pointer ko linear tarike se aage le jata hai. Three‑way merge tab hota hai jab branches diverge kar chuki hoti hain; Git ek **naya merge commit** banata hai jo dono branch tips aur unke common ancestor ko combine karta hai. Fast‑forward history ko linear rakhta hai, three‑way divergent history ko preserve karta hai.  
```bash
# Fast-forward merge (no divergence)
git checkout main
git merge feature-branch
# Just moves main pointer to feature-branch's tip

# Three-way merge (diverged history)
git checkout main
git merge --no-ff feature-branch
# Forces a merge commit even if fast-forward is possible
```

---

## 10. What is a detached HEAD state in Git?

**Asaan Urdu mein:**  
Detached HEAD tab hota hai jab aap koi specific commit, tag, ya remote branch checkout karte hain instead of a local branch; HEAD directly us commit ko point karta hai. Is state mein kiye gaye commits kisi branch se attached nahi hote, isliye wo **orphan** ho jate hain jab tak aap unko ek nayi branch mein save na kar lein. Recovery ke liye turant `git branch <new‑name>` chalayein.  
```bash
# Enter detached HEAD
git checkout abc1234
# or
git checkout v1.0.0

# Make a commit -- it's not attached to any branch
git add -A
git commit -m "Hotfix"

# Save it before switching away
git branch hotfix-branch

# Now switch safely
git checkout main
```

---

## 11. What is cherry-picking in Git?

**Asaan Urdu mein:**  
Cherry‑picking ek specific commit (ya commits) ke changes ko current branch par **naye commit** ke roop mein apply karta hai, bina poori source branch ko merge kiye. Ye useful hai jab aap sirf bug‑fixes ya selective features ko ek release branch se doosri branch mein le jana chahte hain.  
```bash
# Apply a single commit to current branch
git checkout release-v2
git cherry-pick abc1234

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678

# Cherry-pick with no automatic commit (edit first)
git cherry-pick -n abc1234
```

---

## 12. What is the difference between origin and upstream in Git?

**Asaan Urdu mein:**  
`origin` aapke **forked copy** ka default remote name hota hai (jaise GitHub par aapka personal repo). `upstream` wo remote name hota hai jo original repository ko refer karta hai jisse aapne fork kiya tha. Open‑source contribution mein aap changes `origin` par push karte hain aur pull request `upstream` ke liye banate hain.  
```bash
# Clone your fork (origin)
git clone https://github.com/yourname/project.git

# Add the original repo as upstream
git remote add upstream https://github.com/original/project.git

# Sync: fetch upstream, merge into your local main
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 13. How do you undo the last commit without losing changes?

**Asaan Urdu mein:**  
`git reset --soft HEAD~1` se aap latest commit ko hata dete hain lekin uske **changes staged** rehte hain. Isse aap file modifications ko edit kar ke phir se proper commit message ke saath commit kar sakte hain.  
```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Verify changes are still there (staged)
git status

# Option to amend or recommit
git commit -m "Corrected commit message"
```

---

## 14. What is the .gitignore file used for?

**Asaan Urdu mein:**  
`.gitignore` Git ko batata hai ke kaunse files ya directories ko **ignore** karna hai, yani track nahi karna. Common entries hain `node_modules/`, `dist/`, `.env`, log files, IDE configs, etc. Isse accidental sensitive ya bulky files ko repository mein commit karne se roka jata hai.  
```bash
# Example .gitignore
node_modules/
dist/
.env
*.log
.DS_Store
coverage/
.idea/
*.swp

# Verify what would be tracked
git status
git add .  # skips all ignored files
```

---

## 15. What is a Git tag and how does it differ from a branch?

**Asaan Urdu mein:**  
Tag ek **static reference** hota hai jo kisi specific commit ko point karta hai, aam tor par release points (v1.0.0) ke liye use hota hai. Branch ki tarah tag move nahi karta; wo hamesha usi commit par rehta hai. Lightweight tags sirf pointer hote hain, jabke annotated tags additional metadata (author, date, message) store karte hain.  
```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag (recommended for releases)
git tag -a v2.0.0 -m "Release version 2.0.0"

# Push tags to remote
git push origin v2.0.0
git push origin --tags

# Tags don't move with new commits
git checkout v1.0.0  # detached HEAD
```

---

## 16. What is the difference between git clone and git init?

**Asaan Urdu mein:**  
`git init` ek **naya empty repository** banata hai local directory mein, `.git` folder create karta hai. `git clone` existing remote repository ko copy karta hai, saari history, branches, aur remote tracking configuration ke saath. `init` fresh project start karne ke liye, `clone` existing project par kaam karne ke liye use hota hai.  
```bash
# git init -- start a new repository from scratch
mkdir new-project && cd new-project
git init

# git clone -- copy an existing remote repo
git clone https://github.com/user/existing-project.git
cd existing-project
git remote -v  # already configured
```

---

## 17. What is a pull request and how does the code review workflow typically work?

**Asaan Urdu mein:**  
Pull request (PR) ek GitHub/GitLab feature hai jo maintainer ko request karta hai ke aapke branch ke changes ko target branch (usually `main`) mein merge kiya jaye. Typical workflow: feature branch banaye, commit kare, remote par push kare, PR open kare, reviewers comments/changes suggest karte hain, CI checks run hote hain, aur finally merge hota hai. PRs collaborative code review ke liye essential hain.  
```bash
# Typical PR workflow
git checkout -b fix-login-bug
git add .
git commit -m "Fix login validation for empty email"
git push -u origin fix-login-bug

# On GitHub: create PR from fix-login-bug -> main
# Reviewer leaves comments, you push fix commits
git commit -m "Address review feedback"
git push

# After approval, merge via GitHub UI
```

---

## 18. What is git bisect used for?

**Asaan Urdu mein:**  
`git bisect` binary search algorithm use karke **bug introduce hone wale commit** ko pinpoint karta hai. Aap ek known good commit aur ek known bad commit mark karte hain, phir Git midpoint checkout karta hai; aap test karte hain aur usko good ya bad mark karte hain. Yeh process repeat hota hai jab tak pehla bad commit na mil jaye.  
```bash
# Start bisect
git bisect start
git bisect bad          # current commit is bad
git bisect good v1.0    # v1.0 is known good

# Git checks out midpoint -- test and mark
# Run tests, then:
git bisect good         # if bug not present
# or
git bisect bad          # if bug present

# After repeated bisecting, Git shows the first bad commit
git bisect reset        # end bisect session
```

---

## 19. What is the difference between squash merging and regular merging?

**Asaan Urdu mein:**  
Regular merge har individual commit ko target branch mein preserve karta hai, isse detailed history milti hai. Squash merge sabhi feature branch ke commits ko **ek single commit** mein combine karta hai, jo clean linear history deta hai lekin granular commit details ko lose karta hai. Squash usually unpolished WIP commits ke liye use hota hai.  
```bash
# Regular merge -- preserves commit history
git checkout main
git merge feature-branch
# All 15 WIP commits appear in main's history

# Squash merge -- single commit
git checkout main
git merge --squash feature-branch
git commit -m "Add authentication feature"
# All changes combined into one commit
```

---

## 20. How do you resolve a situation where you've committed sensitive data to Git history?

**Asaan Urdu mein:**  
Sensitive file ko history se **permanently remove** karne ke liye `git filter-repo` (ya older `git filter-branch`) use karte hain, phir remote ko **force‑push** karte hain. Uske baad turant leaked credentials ko rotate ya revoke karna zaroori hai. GitHub par token ya key ko revoke karna na bhoolen.  
```bash
# Using git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --path .env --invert-paths

# Using git filter-branch (older method)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push the cleaned history
git push origin --force --all
```

---

## 21. What is a Git submodule?

**Asaan Urdu mein:**  
Submodule ek **reference** hota hai doosre Git repository ka jo aapke repository ke andar specific commit par embed hota hai. Ye external project ko dependency ke roop mein include karta hai, lekin aapko manually `git submodule update` ya `--remote` commands se uski state manage karni padti hai.  
```bash
# Add a submodule
git submodule add https://github.com/user/shared-lib.git libs/shared

# Clone a repo WITH submodules
git clone --recurse-submodules https://github.com/user/main-project.git

# Update submodule to its latest commit
git submodule update --remote

# After cloning without --recurse-submodules
git submodule init
git submodule update
```

---

## 22. What is the difference between rebasing and merging in terms of commit history?

**Asaan Urdu mein:**  
Merging **exact commit topology** ko preserve karta hai—branch points aur merge commits dikhte hain, isse "what happened" realistic view milti hai. Rebasing commits ko **replay** karta hai, history ko linear banata hai, isse "how the code evolved" clean dikhta hai, lekin original branch structure hide ho jata hai.  
```bash
# Before rebase: feature-branch forked from main
#   A---B---C main
#        \
#         D---E feature

# After merge:
#   A---B---C---F main (F = merge commit)
#        \       /
#         D-----E

# After rebase:
#   A---B---C---D'---E' main (linear, no branch visible)
```

---

## 23. How do you recover a deleted branch in Git?

**Asaan Urdu mein:**  
`git reflog` aapko recent HEAD movements dikhata hai, jisme deleted branch ka last commit SHA bhi hota hai. Us SHA ko use kar ke `git branch <branch-name> <sha>` chalane se branch wapas create ho jati hai. Reflog default 90 din tak entries rakhta hai.  
```bash
# Accidentally deleted a branch
git branch -D important-feature

# Find the commit hash from reflog
git reflog
# Output: abc1234 HEAD@{2}: commit: Add important feature

# Recreate the branch
git branch important-feature abc1234

# Verify
git branch  # branch is back
```

---

## 24. What is the reflog in Git and how is it useful?

**Asaan Urdu mein:**  
Reflog (**reference log**) har baar jab HEAD ya koi branch reference change hoti hai, uska record rakhta hai—commits, checkouts, resets, merges, rebases. Ye aapko **lost commits** ya deleted branches recover karne, ya accidental destructive commands ko undo karne mein help karta hai. Sirf local activity record hoti hai aur 90 din baad expire ho jati hai.  
```bash
# View the reflog
git reflog

# Recover after a bad reset
git reset --hard HEAD~3  # oops, lost 3 commits
git reflog
# Find the lost commit: def7890 HEAD@{1}: commit: Important feature
git reset --hard def7890

# View reflog for a specific branch
git reflog show main
```

---

## 25. What is a Git tag and how does it differ from a branch?

**Asaan Urdu mein:**  
(Repeated question – answer same as Q15)  
Tag ek **static pointer** hota hai jo kisi commit ko mark karta hai, usually release ke liye. Branch ek **movable pointer** hota hai jo naye commits ke sath update hota rehta hai. Tag immutable hota hai, branch mutable.  
```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v2.0.0 -m "Release version 2.0.0"

# Push tags
git push origin v2.0.0
git push origin --tags
```

---

<!--LANG:english-->

# Git Interview Questions

## 1. What is the difference between **Git** and **GitHub**?

| Aspect | **Git** | **GitHub** |
|--------|---------|------------|
|  |  |  |

---

## 2. What is the difference between **git merge** and **git rebase**?

| Aspect | **git merge** | **git rebase** |
|--------|---------------|----------------|
|  |  |  |

---

## 3. What is a **merge conflict** and how do you resolve it?

💡 **Tip:**  
-  

---

## 4. What is the difference between **git fetch** and **git pull**?

| Aspect | **git fetch** | **git pull** |
|--------|---------------|--------------|
|  |  |  |

---

## 5. What is the difference between **git reset**, **git revert**, and **git checkout**?

| Command | Primary Use | Effect on History |
|---------|-------------|--------------------|
| **git reset** |  |  |
| **git revert** |  |  |
| **git checkout** |  |  |

---

## 6. What is the difference between **--soft**, **--mixed**, and **--hard** reset?

| Mode | What It Resets | Working Tree Impact |
|------|----------------|--------------------|
| **--soft** |  |  |
| **--mixed** |  |  |
| **--hard** |  |  |

---

## 7. What is a **Git branch** and how does it branch internally?

💡 **Tip:**  
-  

---

## 8. What is the purpose of **git stash**?

💡 **Tip:**  
-  

---

## 9. What is the difference between a **fast‑forward merge** and a **three‑way merge**?

| Merge Type | Characteristics |
|------------|-------------------|
| **Fast‑forward** |  |
| **Three‑way** |  |

---

## 10. What is a **detached HEAD** state in Git?

💡 **Tip:**  
-  

---

## 11. What is **cherry‑picking** in Git?

💡 **Tip:**  
-  

---

## 12. What is the difference between **origin** and **upstream** in Git?

| Remote | Typical Meaning |
|--------|-----------------|
| **origin** |  |
| **upstream** |  |

---

## 13. How do you undo the last commit without losing changes?

💡 **Tip:**  
-  

---

## 14. What is the **.gitignore** file used for?

💡 **Tip:**  
-  

---

## 15. What is a **Git tag** and how does it differ from a branch?

| Aspect | **Tag** | **Branch** |
|--------|---------|------------|
|  |  |  |

---

## 16. What is the difference between **git clone** and **git init**?

| Command | Purpose |
|---------|---------|
| **git clone** |  |
| **git init** |  |

---

## 17. What is a **pull request** and how does the code review workflow typically work?

💡 **Tip:**  
-  

---

## 18. What is **git bisect** used for?

💡 **Tip:**  
-  

---

## 19. What is the difference between **squash merging** and **regular merging**?

| Merge Type | Resulting History |
|------------|-------------------|
| **Squash** |  |
| **Regular** |  |

---

## 20. How do you resolve a situation where you've committed sensitive data to Git history?

💡 **Tip:**  
-  

---

## 21. What is a **Git submodule**?

💡 **Tip:**  
-  

---

## 22. What is the difference between **rebasing** and **merging** in terms of commit history?

**Illustration (plain text):**

```
---B---C main
#        \
#         D---E feature

# After merge:
#   A---B---C---F main (F = merge commit)
#        \       /
#         D-----E

# After rebase:
#   A---B---C---D'---E' main (linear, no branch visible)
```

| Approach | Commit History Shape |
|----------|-----------------------|
| **Merging** |  |
| **Rebasing** |  |

---

## 23. How do you recover a deleted branch in Git?

💡 **Tip:**  
-  

---

## 24. What is the **reflog** in Git and how is it useful?

💡 **Tip:**  
-  

---

## 25. What is a **Git tag** and how does it differ from a branch?

*(Duplicate of #15 – retained for completeness)*

| Aspect | **Tag** | **Branch** |
|--------|---------|------------|
|  |  |  |

---

## 💻 Coding Challenges

*(No coding‑implementation questions were present in the original set.)*
