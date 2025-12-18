# 🚀 Production Deployment Guide

## Overview
Complete guide to deploy Sistema Lagrange to production on Vercel with Supabase backend, continuous integration, and monitoring.

---

## Step 1: Prepare Production Environment

### 1.1 Create Production Supabase Project
1. Go to https://supabase.com
2. Create new project (separate from dev)
3. Name: `constellation-chronicle-prod`
4. Region: Select closest to your users
5. Copy **Project URL** and **Service Role Key**

### 1.2 Deploy Production Database
1. Copy migrations from dev to prod:
   ```bash
   # Via Supabase CLI
   supabase link --project-ref PROD_PROJECT_REF
   supabase db push
   
   # Or manually: Copy-paste SQL in prod Supabase dashboard
   ```
2. Verify all tables exist
3. Run seed migration (sample data)

### 1.3 Enable Production Auth Settings
1. Supabase Dashboard → Authentication → Providers
2. Email provider: Enabled ✅
3. SMTP Configuration (optional, for custom emails):
   - Go to Email Templates
   - Configure SMTP server (Sendgrid, AWS SES, etc.)
4. Set Auth redirect URL:
   - Settings → URL Configuration
   - Site URL: `https://constellation-chronicle.com` (your domain)
   - Redirect URLs: `https://constellation-chronicle.com/auth`

### 1.4 Configure Supabase Storage
1. Storage → Buckets
2. Create `episodes` bucket (if not exists)
3. Set to **Public** for audio playback
4. Create RLS policy:
   ```sql
   CREATE POLICY "Anyone can read episode audio"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'episodes');
   ```

---

## Step 2: Prepare GitHub Repository

### 2.1 Create GitHub Repository
```bash
# If not already a repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub
# Then:
git remote add origin https://github.com/YOUR_USERNAME/constellation-chronicle.git
git push -u origin main
```

### 2.2 Add Production Secrets
1. Go to GitHub repo → Settings → Secrets and Variables → Actions
2. Add secrets:
   - `VITE_SUPABASE_URL_PROD` = Production Supabase URL
   - `VITE_SUPABASE_ANON_KEY_PROD` = Production Anon Key
   - `VERCEL_TOKEN` = Your Vercel token (from vercel.com/account/tokens)

### 2.3 Create .env.production
```bash
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

⚠️ **Never commit .env.production** - Use GitHub Actions secrets instead

---

## Step 3: Configure CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL_PROD }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY_PROD }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm run lint
      
      - name: Run unit tests
        run: pnpm test --run
      
      - name: Build project
        run: pnpm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
      
      - name: Notify deployment success
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🚀 Sistema Lagrange deployed to production",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "✅ Production deployment successful\n${{ github.server_url }}/${{ github.repository }}/commit/${{ github.sha }}"
                  }
                }
              ]
            }

  e2e-tests:
    needs: deploy
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E tests on production
        run: pnpm test:e2e
        env:
          PLAYWRIGHT_TEST_BASE_URL: https://constellation-chronicle.com
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-results
          path: playwright-report/
```

---

## Step 4: Deploy to Vercel

### 4.1 Connect GitHub Repository
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select framework: Vite
5. Build command: `npm run build`
6. Output directory: `dist`

### 4.2 Add Environment Variables
1. Project Settings → Environment Variables
2. Add for all environments:
   ```
   VITE_SUPABASE_URL = <prod-url>
   VITE_SUPABASE_ANON_KEY = <prod-anon-key>
   ```

### 4.3 Configure Domain
1. Settings → Domains
2. Add your custom domain (constellation-chronicle.com)
3. Add DNS records (Vercel will provide)
4. Enable HTTPS (automatic with Vercel)

### 4.4 Deploy
```bash
# Manual deploy via CLI
npm i -g vercel
vercel --prod
```

Or push to main branch - Vercel auto-deploys!

---

## Step 5: Configure Custom Domain & SSL

### 5.1 Domain Registration
- Register domain at GoDaddy, Namecheap, or similar
- Point nameservers to Vercel (instructions in Vercel Dashboard)

### 5.2 SSL/TLS Certificate
- Vercel provides free SSL (automatic)
- Enforce HTTPS:
  1. Vercel Dashboard → Settings → Git
  2. Enable "Production Branch HTTPS Redirect"

### 5.3 Email Configuration (Optional)
If using custom email domain:
1. Add MX records for email provider
2. Configure authentication (SPF, DKIM, DMARC)

---

## Step 6: Set Up Monitoring & Analytics

### 6.1 Vercel Analytics
1. Dashboard → Settings → Analytics
2. Enable Web Analytics (free tier available)
3. Monitor performance metrics

### 6.2 Error Tracking
Option A: Sentry
```bash
npm install @sentry/react @sentry/tracing
```

Then in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

Option B: Supabase Logs
- Monitor in Supabase Dashboard → Logs
- Check API usage and errors

### 6.3 Uptime Monitoring
- Use Uptime Robot, Pingdom, or similar
- Set alerts for site down
- Monitor critical pages:
  - `/` (home)
  - `/podcast` (episode list)
  - `/auth` (authentication)

---

## Step 7: Security Hardening

### 7.1 Environment Variables
✅ Never commit:
- `.env.production`
- Database passwords
- API keys
- Service role keys

✅ Always use GitHub Actions secrets

### 7.2 CORS Configuration
Add to `vite.config.ts`:
```typescript
server: {
  cors: {
    origin: ['https://constellation-chronicle.com'],
    credentials: true
  }
}
```

### 7.3 CSP (Content Security Policy)
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https:; script-src 'self' 'unsafe-inline'"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 7.4 Rate Limiting
Configure in Supabase:
1. Auth → Rate Limiting
2. Set limits for signup/login attempts
3. Database: Add rate limiting middleware (optional)

---

## Step 8: Performance Optimization

### 8.1 Bundle Analysis
```bash
npm install --save-dev rollup-plugin-bundle-size
npm run build
# Check dist/ folder size
```

### 8.2 Image Optimization
- Use WebP format where possible
- Lazy load below-fold images
- Compress before uploading

### 8.3 Database Optimization
- Add indexes to frequently queried columns:
  ```sql
  CREATE INDEX idx_episodes_slug ON episodes(slug);
  CREATE INDEX idx_chapters_episode_id ON chapters(episode_id);
  ```
- Archive old logs regularly

---

## Step 9: Backup & Disaster Recovery

### 9.1 Database Backups
- Supabase: Automatic daily backups (Pro plan)
- Manual backup:
  ```bash
  pg_dump postgresql://user:pass@db.supabase.co:5432/postgres > backup.sql
  ```

### 9.2 Disaster Recovery Plan
1. **Database loss:** Restore from Supabase backup
2. **Code loss:** GitHub is your backup
3. **Storage loss:** Supabase storage has redundancy
4. **Full outage:** Switch to backup Vercel project

---

## Step 10: Production Checklist

Before going live:

- [ ] SQL migrations deployed to production
- [ ] Supabase Auth configured (SMTP for email)
- [ ] Storage bucket created and public
- [ ] Environment variables set in Vercel
- [ ] HTTPS/SSL enabled
- [ ] Custom domain configured
- [ ] Error tracking (Sentry/Logs) enabled
- [ ] Analytics enabled
- [ ] Uptime monitoring configured
- [ ] Backups scheduled
- [ ] CI/CD pipeline working
- [ ] All tests passing
- [ ] Security hardening complete
- [ ] Performance acceptable (< 3s load time)

---

## Post-Deployment Monitoring

### Daily
- Check uptime monitoring alerts
- Review error logs
- Monitor performance metrics

### Weekly
- Review analytics
- Check database size
- Verify backups completed

### Monthly
- Performance review
- Cost analysis
- Security audit
- Update dependencies

---

## Troubleshooting Production Issues

### ❌ "Cannot find module" in production
**Cause:** Environment variables not set in Vercel
**Solution:** Add to Vercel Settings → Environment Variables

### ❌ White blank page
**Cause:** Build errors or hydration mismatch
**Solution:**
1. Check Vercel logs: `vercel logs`
2. Run local build: `npm run build`
3. Test production build: `npm run preview`

### ❌ Supabase connection timeout
**Cause:** Connection string incorrect or IP blocked
**Solution:**
1. Verify URL in Vercel env vars
2. Check Supabase dashboard for errors
3. Whitelist IP addresses if needed

### ❌ Audio files not playing
**Cause:** Storage bucket not public or missing CORS
**Solution:**
1. Verify bucket is Public
2. Check Supabase Storage CORS settings
3. Test audio URL in browser directly

---

## Production Maintenance

### Weekly Tasks
```bash
# Check for dependency updates
npm outdated

# Run security audit
npm audit

# Update if safe
npm update
```

### Monthly Tasks
```bash
# Update major dependencies carefully
npm outdated -a

# Review Supabase logs
# Check analytics dashboard
# Monitor costs
```

---

## Timeline to Production

| Task | Time | Status |
|------|------|--------|
| SQL migrations deployed | 5 min | ⏳ Blocked (manual) |
| Frontend testing | 1 hour | ⏳ Setup guide ready |
| GitHub setup | 10 min | ⏳ Not started |
| Vercel deployment | 5 min | ⏳ Not started |
| Domain setup | 10 min | ⏳ Not started |
| Security hardening | 30 min | ⏳ Not started |
| Monitoring setup | 15 min | ⏳ Not started |
| **Total** | **2 hours** | |

---

Last Updated: 2024-12-18
Status: ✅ Guide Ready
Next: Execute steps 1-10 in order
