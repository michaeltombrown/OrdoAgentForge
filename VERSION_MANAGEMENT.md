# 🔢 Automatic Version Management

## ✅ Configured

Your app now automatically increments the version number on every build!

## 🚀 How It Works

### Automatic Patch Bumping

Every time you run `npm run build`, the patch version automatically increments:

- `1.0.0` → `1.0.1` → `1.0.2` → etc.

### Manual Version Bumping

**Patch Version** (bug fixes):

```bash
npm run build           # Automatically bumps patch (1.0.0 → 1.0.1)
npm run version:patch   # Manually bump patch only
```

**Minor Version** (new features):

```bash
npm run build:minor     # Bumps minor and builds (1.0.5 → 1.1.0)
npm run version:minor   # Manually bump minor only
```

**Major Version** (breaking changes):

```bash
npm run build:major     # Bumps major and builds (1.5.2 → 2.0.0)
npm run version:major   # Manually bump major only
```

## 📦 What Gets Updated

### 1. `package.json`

```json
{
  "version": "1.0.1" // ← Automatically updated
}
```

### 2. `src/version.ts`

```typescript
export const APP_VERSION = '1.0.1';
export const BUILD_DATE = '2026-02-06T22:45:00.000Z';
```

## 💻 Use Version in Your App

```tsx
import { APP_VERSION, BUILD_DATE } from './version';

function Footer() {
  return (
    <footer>
      <p>Version: {APP_VERSION}</p>
      <p>Built: {new Date(BUILD_DATE).toLocaleDateString()}</p>
    </footer>
  );
}
```

## 📝 Version Numbering (Semantic Versioning)

```
MAJOR.MINOR.PATCH
  |     |     |
  |     |     └─ Bug fixes (1.0.0 → 1.0.1)
  |     └─────── New features (1.0.5 → 1.1.0)
  └───────────── Breaking changes (1.5.0 → 2.0.0)
```

### When to Bump:

**PATCH** (automatic with every build):

- Bug fixes
- Performance improvements
- Internal refactoring
- Documentation updates

**MINOR** (manual):

- New features
- New API endpoints
- Non-breaking changes
- Deprecations

**MAJOR** (manual):

- Breaking API changes
- Removed features
- Architecture changes
- Incompatible updates

## 🔧 Configuration

The version bumping script is located at:

```
scripts/bump-version.js
```

It runs automatically before every build via the `prebuild` script in `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/bump-version.js patch",
    "build": "tsc && vite build"
  }
}
```

## 🎯 Build Process Flow

```
npm run build
    ↓
1. prebuild: bump-version.js runs
    ↓
2. Updates package.json version
    ↓
3. Creates/updates src/version.ts
    ↓
4. Runs TypeScript compilation (tsc)
    ↓
5. Runs Vite build
    ↓
6. Build complete with new version!
```

## 📊 Version Display Examples

### In Your App Header

```tsx
import { APP_VERSION } from './version';

function Header() {
  return (
    <header>
      <h1>OrdoAgentForge</h1>
      <span className="version">v{APP_VERSION}</span>
    </header>
  );
}
```

### In About Page

```tsx
import { APP_VERSION, BUILD_DATE } from './version';

function AboutPage() {
  return (
    <div>
      <h1>About OrdoAgentForge</h1>
      <dl>
        <dt>Version:</dt>
        <dd>{APP_VERSION}</dd>

        <dt>Build Date:</dt>
        <dd>{new Date(BUILD_DATE).toLocaleString()}</dd>

        <dt>Environment:</dt>
        <dd>{import.meta.env.MODE}</dd>
      </dl>
    </div>
  );
}
```

### In Console (for debugging)

```tsx
import { APP_VERSION, BUILD_DATE } from './version';

console.log(`🚀 OrdoAgentForge v${APP_VERSION}`);
console.log(`📅 Built: ${BUILD_DATE}`);
```

## 🔄 CI/CD Integration

For automated deployments (like Vercel), the version bumps automatically on each build.

### Vercel Deployment

```bash
# Production deploy (patch bump happens automatically)
npm run deploy:prod

# Or use major/minor for significant releases
npm run build:major
npm run deploy:prod
```

### Git Integration

Add version.ts to your commits to track version changes:

```bash
git add package.json src/version.ts
git commit -m "chore: bump version to 1.0.5"
```

## 🎨 Styling Version Badge

```css
.version-badge {
  background: #4f46e5;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
```

```tsx
function VersionBadge() {
  return <span className="version-badge">v{APP_VERSION}</span>;
}
```

## 🚨 Important Notes

1. **Automatic on Build**: Version bumps automatically with `npm run build`
2. **Git Tracking**: Commit both `package.json` and `src/version.ts` together
3. **CI/CD**: Works seamlessly with automated deployments
4. **No Manual Editing**: Don't edit `src/version.ts` manually (it's auto-generated)
5. **Semantic Versioning**: Follow semver principles for consistency

## 🧪 Testing

Test the version bumping:

```bash
# Check current version
cat package.json | grep version

# Run a build (should bump patch)
npm run build

# Verify version increased
cat package.json | grep version
cat src/version.ts
```

## 📋 Changelog Best Practices

Keep a `CHANGELOG.md` to track version changes:

```markdown
# Changelog

## [1.2.0] - 2026-02-06

### Added

- Clerk authentication integration
- Automatic version bumping

## [1.1.5] - 2026-02-05

### Fixed

- Supabase connection timeout

## [1.1.0] - 2026-02-04

### Added

- Supabase integration
- Airia API client
```

---

**Version management is now fully automated! 🎉**

Every build increments your version automatically, making it easy to track releases and deployments.
