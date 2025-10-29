# Listmonk Deployment on Render

## Prerequisites
- Render account (https://render.com - sign up free)
- Supabase project with PostgreSQL database
- Your Supabase connection details

---

## Step 1: Get Supabase Connection Details

1. Go to your Supabase project dashboard
2. Click **Settings** → **Database**
3. Find the **Connection string** section
4. You'll need these values:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Port: 5432
   Database: postgres
   User: postgres
   Password: [Your password]
   ```

---

## Step 2: Deploy on Render

### A. Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing image from a registry"**
4. In **"Image URL"** enter:
   ```
   listmonk/listmonk:latest
   ```
5. Click **"Next"**

### B. Configure Service

**Name**: `behaviorschool-listmonk` (or your choice)

**Region**: Choose closest to you (e.g., Oregon USA)

**Instance Type**: **Free** (upgrade later if needed)

**Environment Variables**: Click "Add Environment Variable" for each:

```env
LISTMONK_app__address=0.0.0.0:10000

LISTMONK_db__host=db.xxxxxxxxxxxxx.supabase.co
LISTMONK_db__port=5432
LISTMONK_db__user=postgres
LISTMONK_db__password=YOUR_SUPABASE_PASSWORD
LISTMONK_db__database=postgres
LISTMONK_db__ssl_mode=require

LISTMONK_app__admin_username=admin
LISTMONK_app__admin_password=changeme123!

LISTMONK_app__log_file=
```

**Important Notes:**
- Replace `db.xxxxxxxxxxxxx.supabase.co` with your actual Supabase host
- Replace `YOUR_SUPABASE_PASSWORD` with your actual password
- **Change** `changeme123!` to a strong admin password
- Port **10000** is required by Render's free tier

### C. Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Render will show logs - wait for: `listmonk started`
4. Your Listmonk URL will be: `https://behaviorschool-listmonk.onrender.com`

---

## Step 3: Initial Setup

1. Open your Render URL: `https://your-service.onrender.com`
2. You'll see "installation pending" screen
3. Click **"Install"**
4. Wait for database tables to be created
5. Login with:
   - **Username**: `admin`
   - **Password**: (the one you set in environment variables)

---

## Step 4: Configure Listmonk

### First-Time Setup Wizard:

1. **General Settings**:
   - Site name: `Behavior School Newsletter`
   - From email: `newsletter@behaviorschool.com`
   - Root URL: Your Render URL

2. **SMTP Settings** (for sending emails):
   - You'll need to configure this later with:
     - **Mailgun** (recommended)
     - **SendGrid**
     - **Amazon SES**
     - Or any SMTP provider

3. **Save** and you're done!

---

## Step 5: Get Your Listmonk URL

After deployment completes, copy your Render URL:
```
https://behaviorschool-listmonk.onrender.com
```

You'll need this for the admin panel integration.

---

## Troubleshooting

### Database Connection Failed
- Check your Supabase password is correct
- Verify `ssl_mode=require` is set
- Make sure Supabase host format is correct

### 502 Bad Gateway
- Service is still starting (wait 2-3 minutes)
- Check Render logs for errors

### Can't Login
- Use the credentials from environment variables
- Default: `admin` / `changeme123!`

---

## Next Steps

Once deployed, I'll update your admin panel to integrate it via iframe.

**Your Listmonk URL**: ________________________________

(Fill in after deployment, then I'll update the admin panel)
