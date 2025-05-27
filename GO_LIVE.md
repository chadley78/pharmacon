# Pharmacon Go-Live Checklist

## Infrastructure & Environment Variables
- [ ] Set up production environment variables in Vercel:
  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [x] `STRIPE_SECRET_KEY`
  - [x] `STRIPE_WEBHOOK_SECRET`
  - [ ] `RESEND_API_KEY`
  - [ ] `UPSTASH_REDIS_REST_URL` (Optional - for rate limiting)
  - [ ] `UPSTASH_REDIS_REST_TOKEN` (Optional - for rate limiting)

## Email & Communication
- [ ] Authenticate domain with Resend for email delivery
  - [ ] Add DNS records (SPF, DKIM, DMARC)
  - [ ] Verify domain ownership
  - [ ] Test email delivery
- [ ] Set up email templates in Resend
  - [ ] Order confirmation
  - [ ] Order status updates
  - [ ] Password reset
  - [ ] Email verification

## Security & Compliance
- [ ] Review and update privacy policy
- [ ] Review and update terms of service
- [ ] Implement GDPR compliance measures
  - [ ] Cookie consent banner
  - [ ] Data retention policies
  - [ ] User data export/delete functionality
- [ ] Set up SSL certificate (handled by Vercel)
- [ ] Review and secure API endpoints
- [ ] Implement rate limiting (currently disabled, using Redis)

## Payment & Transactions
- [ ] Verify Stripe integration in production
  - [ ] Test successful payments
  - [ ] Test failed payments
  - [ ] Test refunds
  - [ ] Verify webhook handling
- [ ] Set up Stripe webhook endpoints in production
- [ ] Configure Stripe dashboard for production
- [ ] Test payment error handling

## Database & Data
- [ ] Set up database backups
- [ ] Verify database indexes and performance
- [ ] Migrate any existing data if needed
- [ ] Set up database monitoring

## Testing & Quality Assurance
- [ ] Perform end-to-end testing
  - [ ] User registration/login
  - [ ] Product browsing and search
  - [ ] Cart functionality
  - [ ] Checkout process
  - [ ] Order management
  - [ ] Email notifications
- [ ] Test responsive design on various devices
- [ ] Cross-browser testing
- [ ] Load testing
- [ ] Security testing

## Monitoring & Analytics
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure analytics (e.g., Google Analytics)
- [ ] Set up performance monitoring
- [ ] Configure logging
- [ ] Set up uptime monitoring

## Documentation
- [ ] Update API documentation
- [ ] Create user documentation
- [ ] Document deployment process
- [ ] Create maintenance procedures
- [ ] Document backup and recovery procedures

## Pre-Launch Tasks
- [ ] Final content review
- [ ] SEO optimization
- [ ] Social media accounts setup
- [ ] Create support email address
- [ ] Set up status page
- [ ] Create launch announcement

## Post-Launch Tasks
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Monitor user feedback
- [ ] Monitor payment success rates
- [ ] Monitor email delivery rates
- [ ] Review server logs
- [ ] Monitor database performance

## Future Improvements (Post-Launch)
- [ ] Implement Redis rate limiting
- [ ] Add caching layer
- [ ] Implement CDN for static assets
- [ ] Add more payment methods
- [ ] Implement advanced search features
- [ ] Add user reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add product recommendations

## Notes
- Redis rate limiting is currently disabled but can be enabled by adding Upstash Redis credentials
- Domain authentication for Resend is required for reliable email delivery
- Regular security audits should be scheduled post-launch
- Consider implementing a staging environment for future updates 