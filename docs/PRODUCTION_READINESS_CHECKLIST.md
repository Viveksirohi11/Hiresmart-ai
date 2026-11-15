# HireSmart AI - Production Readiness Checklist

## 1. Authentication
- [ ] Validate registration input on the server.
- [ ] Hash passwords before storing them.
- [ ] Verify JWT expiration and signature.
- [ ] Protect private API routes.
- [ ] Apply rate limiting to authentication endpoints.

## 2. Resume Management
- [ ] Validate uploaded file types and sizes.
- [ ] Reject malformed resume documents.
- [ ] Prevent unauthorized resume access.
- [ ] Handle parsing failures gracefully.
- [ ] Avoid storing sensitive information in logs.

## 3. AI Integration
- [ ] Keep API credentials server-side.
- [ ] Validate AI request payloads.
- [ ] Handle provider timeouts.
- [ ] Provide meaningful fallback errors.
- [ ] Track token usage and request limits.

## 4. Database
- [ ] Validate MongoDB schemas.
- [ ] Add appropriate indexes.
- [ ] Enforce ownership checks.
- [ ] Handle database connection failures.
- [ ] Back up production data.

## 5. Frontend
- [ ] Handle loading and error states.
- [ ] Validate forms.
- [ ] Protect authenticated routes.
- [ ] Make dashboard responsive.
- [ ] Check accessibility.

## 6. Deployment
- [ ] Configure environment variables.
- [ ] Never commit secrets.
- [ ] Run production build.
- [ ] Run automated tests.
- [ ] Configure monitoring and logging.

## 7. Release verification
- [ ] Review Git diff.
- [ ] Verify CI checks.
- [ ] Review security audit findings.
- [ ] Confirm deployment health.
