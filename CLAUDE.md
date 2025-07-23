# Development Style Configuration

## Core Development Principles

### TDD (Test-Driven Development)
Follow the strict TDD cycle: **Red → Green → Refactor**

**RED**: Write a failing test first
- Tests should be specific and test one behavior
- Use meaningful test names that describe behavior (Japanese acceptable)
- Make test failures clear and informative

**GREEN**: Write minimal code to make the test pass
- Implement only what's necessary to pass the test
- Fake implementations are acceptable initially
- Avoid over-engineering

**REFACTOR**: Improve the code while keeping tests green
- Follow DRY principle to eliminate duplication
- Use established refactoring patterns
- Make one refactoring change at a time

### Tidy First Approach

**Separate all changes into two distinct types:**
- **Structural Changes**: Rearrange code without changing behavior (renaming, extracting methods, moving code)
- **Behavioral Changes**: Actually adding or changing functionality

**Guidelines:**
- Never mix structural and behavioral changes in the same commit
- Always make structural changes first when both are needed
- Run tests before and after to verify structural changes don't alter behavior
- Create one test at a time, run it, then improve the structure

### TDD Workflow Example

When working on new features:
1. Write a simple failing test for a small part of the feature
2. Implement the minimum to make it pass
3. Run tests to confirm passing (Green)
4. Make any needed structural changes (Tidy First), running tests after each change
5. Commit structural changes separately
6. Add another test for the next small feature increment
7. Repeat until complete, committing behavioral changes separately from structural changes

**Always prioritize clean, well-tested code over rapid implementation.**

### Bug Fixes
- First write a failing test at the API level
- Then write the smallest possible test that reproduces the issue
- Make both tests pass

## Quality Standards

### Commit Discipline
Commit only when:
- [ ] Working on feature branch (never main)
- [ ] All tests pass
- [ ] All compiler/linter warnings are resolved
- [ ] Changes represent a single logical unit of work
- [ ] Commit message clearly states structural or behavioral changes
- [ ] Use small, frequent commits rather than large, infrequent ones
- [ ] Pull Request created and reviewed before merge to main

### Code Quality
- Eliminate duplication thoroughly
- Express intent clearly through naming and structure
- Make dependencies explicit
- Keep methods small and focused on single responsibility
- Minimize state and side effects
- Use the simplest solution possible

### Warning Resolution Policy
All warnings must be resolved, even if they don't seem to have immediate impact:
- Warnings often indicate potential issues that could become problems
- Clean builds improve code quality and maintainability
- Warnings can hide important issues

## Coding Standards

### Function Design
- Follow Single Responsibility Principle
- Distinguish pure functions from functions with side effects
- Reduce nesting with early returns
- Keep functions within 10 lines when possible
- Limit nesting to 3 levels


### Development Priorities
1. **Correctness**: It must work correctly first
2. **Readability**: Team members should understand easily
3. **Maintainability**: Future changes should be easy
4. **Performance**: Optimize only when necessary

## Testing

### Test Guidelines
- Define small increments of functionality
- Use meaningful test names (Japanese acceptable)
- Write the simplest failing test first
- Run all tests (except long-running tests) each time

## Error Handling

### Basic Policy
- Detect errors early and handle appropriately
- User-facing error messages should be helpful
- Developer-facing errors should be detailed

## Git Workflow

### CRITICAL: Main Branch Protection
**NEVER commit directly to main branch. This is strictly forbidden.**

### Required Development Flow
All work must be done by creating branches without committing directly to the main branch

### Branch Naming Convention
- `feature/issue-123-add-calendar-view` - New features
- `bugfix/issue-456-fix-date-parsing` - Bug fixes
- `docs/update-api-documentation` - Documentation updates
- `refactor/improve-event-handling` - Code refactoring
- `chore/update-dependencies` - Maintenance tasks

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Refactoring (structural changes)
- `test`: Adding/changing tests
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `chore`: Build process or tool changes

### Example
```
feat: add user authentication

Implement JWT-based authentication:
- Login/logout API endpoints
- Token refresh functionality
- Authentication middleware

Closes #123
```

## Code Review Checklist

### Must Check
- [ ] Are tests written?
- [ ] Do tests clearly express intent?
- [ ] Is error handling appropriate?
- [ ] Are names appropriate and intent clear?
- [ ] Are structural and behavioral changes separated?

### Recommended
- [ ] Are functions within 10 lines?
- [ ] Is nesting within 3 levels?
- [ ] Is there no duplicated code?
- [ ] All warnings resolved?

## Instructions for Claude Code

### Language Usage
- Write comments in Japanese
- Write test case descriptions in Japanese
- Use English for code itself

### Development Process
- **MANDATORY**: Always create feature branch before any work (see Required Development Flow section)
- **MANDATORY**: All changes must go through Pull Request process (steps 1-6 in Required Development Flow)
- Always practice TDD: Write tests first
- Confirm tests are RED before implementation
- Make incremental improvements
- Verify approach before large changes
- Follow existing code style
- Separate structural from behavioral changes
- Never commit directly to main branch under any circumstances

### Development Server Management
- **MANDATORY**: Always stop development server after work completion
- When starting development server with `npm start`, always stop it with kill command after verification
- This prevents port conflicts and resource issues
- Use `lsof -ti:3000 | xargs kill -9` to force stop if needed
