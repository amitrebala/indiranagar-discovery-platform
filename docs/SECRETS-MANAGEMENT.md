# Secrets Management

This project uses a simple, free secrets management approach using GitHub Secrets and Vercel Environment Variables.

## Overview

- **Local Development**: `.env.local` file
- **CI/CD**: GitHub Secrets
- **Production**: Vercel Environment Variables

## Required Secrets

1. `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
3. `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
4. `OPENWEATHERMAP_API_KEY` - OpenWeatherMap API key
5. `WEATHERAPI_KEY` - WeatherAPI key (optional backup)
6. `VERCEL_TOKEN` - Vercel deployment token
7. `SUPABASE_DB_PASSWORD` - Database password
8. `DATABASE_URL` - PostgreSQL connection string

## Adding New Secrets

1. Add to `.env.local` for local development
2. Run `./scripts/setup-github-secrets-from-env.sh` to update GitHub
3. Add to Vercel dashboard for production

## Security

- Pre-commit hooks prevent accidental secret commits
- All secrets are rotated every 90 days
- Different keys for dev/staging/production environments