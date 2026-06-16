# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x     | ✅ Active  |
| 1.x     | ❌ End of life |

## Reporting a Vulnerability

**Do NOT open a public issue for security vulnerabilities.**

Email: **ktaki928@gmail.com**  
Subject: `[SECURITY] fullstack-ai-dashboard - Brief description`

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

**Response within 48 hours.**

## Security Notes for Self-Hosting

- Change `SECRET_KEY` in `backend/.env` before production
- Use HTTPS in production
- Set `CORS_ORIGINS` to your actual domain only
- Never commit `.env` files with real secrets
- Demo credentials (`admin/admin`) are for development only — change them in production
