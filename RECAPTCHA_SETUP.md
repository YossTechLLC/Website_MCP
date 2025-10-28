# Google reCAPTCHA v3 Setup Guide

## Step 1: Access reCAPTCHA Admin Console

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account

## Step 2: Register a New Site

Fill in the registration form:

### Label
```
PayGate Prime MCP Test
```

### reCAPTCHA Type
- Select: **reCAPTCHA v3**

### Domains
Add these domains (you'll add more after deployment):
```
localhost
127.0.0.1
```

**Note:** After deployment, you'll need to add your Cloud Run URLs

### Owners
- Your Google account email will be added automatically
- You can add additional owners if needed

### Accept reCAPTCHA Terms of Service
- Check the box to accept

### Submit Alerts to Owners
- Optional: Check if you want to receive alerts

## Step 3: Get Your Keys

After registration, you'll see:

### Site Key (Public Key)
- Example: `6LexampleAAAAAAExampleSiteKeyxxxxxxxxxx`
- This is used in the frontend
- Can be public

### Secret Key (Private Key)
- Example: `6LexampleAAAAAAAAExampleSecretKeyxxxxxxxx`
- This is used in the backend
- MUST be kept secret

## Step 4: Copy Your Keys

Copy both keys and provide them when deploying.

## Step 5: Update Domains After Deployment

Once deployed to Cloud Run, you'll get URLs like:
```
https://mcp-test-paygate-web-xxxxx-uc.a.run.app
https://mcp-test-paygate-api-xxxxx-uc.a.run.app
```

Go back to the reCAPTCHA admin console and add these domains:
1. Click on your site
2. Click on "Settings"
3. Add the Cloud Run domains (without https://)
4. Click "Save"

## Testing reCAPTCHA

After deployment, you can test the integration:
1. Open browser console
2. Fill out the form
3. Check console for reCAPTCHA score (should be 0.0-1.0)
4. Scores below 0.5 will be rejected by the backend

## Troubleshooting

### "Invalid site key" error
- Check that the site key matches exactly
- Ensure the domain is added in admin console

### "reCAPTCHA not loaded" error
- Check internet connection
- Verify the site key is correct
- Check browser console for errors

### Low scores (< 0.5)
- Normal for testing/development
- Production traffic will have higher scores
- You can adjust threshold in backend environment variables

## Security Best Practices

1. **Never commit secret keys** to git
2. **Use Secret Manager** in production
3. **Monitor scores** in reCAPTCHA analytics
4. **Set up alerts** for suspicious activity
5. **Rotate keys** if compromised

## Cost

reCAPTCHA v3 is free for:
- Up to 1 million assessments/month
- Standard support

Enterprise version available for:
- Higher volume
- Priority support
- Advanced features

## Next Steps

Once you have your keys:
1. Provide them for deployment
2. We'll deploy to Google Cloud
3. Update reCAPTCHA domains with Cloud Run URLs
4. Test the registration form

---

**Created for PayGate Prime MCP Test Deployment**
