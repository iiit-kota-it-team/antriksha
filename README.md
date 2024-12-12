# Anantriksha

### PNPM workspaces

#### Command To Build All Packages

```bash
    pnpm build
```

#### Command To Build a Specific Package

```bash
    pnpm --filter <package_name> build
```

#### Command To Start Every Package

```bash
    pnpm start
```

#### Command To Start a Specific Package

```bash
    pnpm --filter <package_name> start
```

### Linting and Formatting

**Husky is being used for pre-commit validation so your code will lint and format before every commit**

#### Command To Manually Lint Whole Codebase

```bash
    pnpm lint
```

#### Command To Manually format the Whole Codebase

```bash
    pnpm format
```

#### Commit Message Format

```
    topic(package): subject

    example

    feat(api): added a new route
```

** You won't be able to commit if you don't use this format **

### Permissions To Push To Repo

**You can't directly push into the main branch first you will have to create a sepearte branch in the repo and then push to that branch. Then Create a pull request to merge the changes in that branch to the main branch. Some body will have to approve the pull request before merging it.**
