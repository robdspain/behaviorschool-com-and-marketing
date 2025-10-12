# 🚨 URGENT FIX: Google OAuth Invalid Client Error

## The Real Problem

You're getting **"Error 401: invalid_client"** from Google, which means:

❌ The Google OAuth Client ID in Supabase doesn't exist or has been deleted  
❌ Client ID: `72495015027-a0tb4i6ojqth8uv7g39u258jbormkcch.apps.googleusercontent.com`

## Quick Fix (10 minutes)

### Option A: Create New Google OAuth Credentials (Recommended)

#### Step 1: Go to Google Cloud Console
https://console.cloud.google.com/apis/credentials

#### Step 2: Create OAuth 2.0 Client ID

1. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

2. **Application type:** Web application

3. **Name:** Behavior School Admin (or any name)

4. **Authorized JavaScript origins:**
   ```
   https://behaviorschool.com
   https://dugolglucuzolzvuqxmi.supabase.co
   ```

5. **Authorized redirect URIs:**
   ```
   https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
   ```

6. Click **"CREATE"**

7. **Copy the Client ID and Client Secret** (you'll need these in the next step)

#### Step 3: Add Credentials to Supabase

1. Go to: https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/providers

2. Find **Google** provider

3. **Enable** the toggle

4. **Paste:**
   - Client ID (from Google Console)
   - Client Secret (from Google Console)

5. Click **"Save"**

#### Step 4: Test Again

1. Wait 2 minutes for changes to propagate
2. Clear browser cache
3. Try: https://behaviorschool.com/admin/login
4. Click "Continue with Google"
5. Should work now! ✅

### Option B: Find Existing OAuth Credentials

If you already have OAuth credentials but they're not working:

#### Step 1: Check Google Cloud Console
https://console.cloud.google.com/apis/credentials

Look for existing OAuth 2.0 Client IDs. If you see one:

1. Click on it
2. Verify **Authorized redirect URIs** includes:
   ```
   https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
   ```
3. If not, add it and save

#### Step 2: Update Supabase

1. Go to: https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/providers
2. Click on **Google** provider
3. Update Client ID and Client Secret with the correct values
4. Save

## What Happened?

The error message shows Supabase is trying to use this client ID:
```
72495015027-a0tb4i6ojqth8uv7g39u258jbormkcch.apps.googleusercontent.com
```

But Google says: **"The OAuth client was not found"**

This means either:
- The client ID was deleted from Google Cloud Console
- The client ID is from a different Google Cloud project
- The client ID was never created
- The project was deleted or disabled

## Complete Setup Checklist

### Google Cloud Console:
- [ ] OAuth 2.0 Client ID created
- [ ] Application type: Web application
- [ ] JavaScript origins include Supabase URL
- [ ] Redirect URI: `https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied

### Supabase:
- [ ] Google provider enabled
- [ ] Client ID pasted from Google Console
- [ ] Client Secret pasted from Google Console
- [ ] Changes saved
- [ ] Redirect URLs configured (you already did this ✅)

### Testing:
- [ ] Wait 2 minutes after saving
- [ ] Clear browser cache
- [ ] Test in incognito mode
- [ ] Click "Continue with Google"
- [ ] Should see Google sign-in (not error)

## Detailed Steps with Screenshots Reference

### Creating OAuth Client in Google Cloud Console:

1. **Select or Create Project**
   - Go to https://console.cloud.google.com
   - Select existing project or create new one
   - Name it: "Behavior School" or similar

2. **Enable Google+ API** (if not already enabled)
   - Go to: APIs & Services → Library
   - Search for "Google+ API"
   - Click "Enable"

3. **Configure OAuth Consent Screen** (first time only)
   - Go to: APIs & Services → OAuth consent screen
   - User Type: **External**
   - App name: **Behavior School**
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - Scopes: Leave default, click "Save and Continue"
   - Test users: Add your email
   - Click "Save and Continue"

4. **Create OAuth Credentials**
   - Go to: APIs & Services → Credentials
   - Click "+ CREATE CREDENTIALS"
   - Select "OAuth client ID"
   - Application type: **Web application**
   - Name: **Behavior School Admin**
   - Authorized JavaScript origins:
     ```
     https://behaviorschool.com
     https://dugolglucuzolzvuqxmi.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback
     ```
   - Click **CREATE**

5. **Copy Credentials**
   - A popup shows your Client ID and Client Secret
   - **Copy both** - you'll need them for Supabase
   - You can also download the JSON file for backup

### Adding to Supabase:

1. **Go to Auth Providers**
   - https://app.supabase.com/project/dugolglucuzolzvuqxmi/auth/providers

2. **Find Google**
   - Scroll to "Google" in the providers list
   - Click to expand

3. **Enable and Configure**
   - Toggle **"Enable Sign in with Google"** to ON
   - Paste **Client ID** (from Google Console)
   - Paste **Client Secret** (from Google Console)
   - Leave other fields as default

4. **Save**
   - Click **"Save"** button at bottom
   - Green success message should appear

## Testing the Fix

After completing setup:

```bash
# Wait 2 minutes for propagation
sleep 120

# Clear browser cache (in browser)
# Then test:
```

1. Visit: https://behaviorschool.com/admin/login
2. Click "Continue with Google"
3. **Expected:** Google sign-in screen (not error!)
4. Sign in with your Google account
5. Should redirect to `/admin` dashboard

## Verification

After successful login, verify:

```javascript
// In browser console (F12) on /admin page:
console.log('User authenticated:', !!window.supabase)
```

You should see your session data.

## Common Issues After Fix

### Issue: "Access blocked: This app's request is invalid"
**Solution:** OAuth consent screen not configured in Google Cloud Console

### Issue: "Redirect URI mismatch"
**Solution:** Add exact Supabase callback URL to Google Console redirect URIs

### Issue: Still getting "invalid_client"
**Solution:** 
- Verify you copied the correct Client ID and Secret
- Make sure you're using the credentials from the correct Google Cloud project
- Check that the OAuth client wasn't deleted

## Security Notes

- ⚠️ Never commit Client Secret to git
- ⚠️ Keep credentials secure
- ✅ Store in Supabase dashboard only
- ✅ Supabase will not expose the secret

## Quick Reference

| Setting | Value |
|---------|-------|
| **Google Project** | Create or select existing |
| **OAuth Client Type** | Web application |
| **JavaScript Origins** | `https://behaviorschool.com`<br>`https://dugolglucuzolzvuqxmi.supabase.co` |
| **Redirect URI** | `https://dugolglucuzolzvuqxmi.supabase.co/auth/v1/callback` |
| **Supabase Project** | `dugolglucuzolzvuqxmi` |
| **Supabase Provider** | Google (must be enabled) |

## Next Steps After Fix

1. ✅ Create/update Google OAuth credentials
2. ✅ Add to Supabase
3. ✅ Test login flow
4. ⏭️ Add admin authorization check
5. ⏭️ Build admin dashboard features

---

**Status:** Awaiting Google OAuth configuration  
**Error:** `invalid_client` - OAuth credentials not found  
**Time to fix:** ~10 minutes

