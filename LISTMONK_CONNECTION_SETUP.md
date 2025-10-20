# Listmonk Connection Setup - 146.190.162.121

## Current Status

**Domain:** `https://listmonk.behaviorschool.com`  
**IP Address:** `146.190.162.121`  
**Current State:** ⚠️ Server responds but returns 404 errors

### What I Found:
- ✅ Domain is accessible via HTTPS (SSL configured)
- ✅ Server at 146.190.162.121 is responding on port 80/443
- ❌ Port 9000 (Listmonk default) is not accessible from outside
- ❌ All requests return `404 Not Found`

---

## Possible Issues & Solutions

### Issue 1: Listmonk is not running

**Check if Listmonk is running on the server:**

```bash
# SSH into your server
ssh root@146.190.162.121

# Check if Listmonk is running
ps aux | grep listmonk

# If using Docker
docker ps | grep listmonk

# If using systemd
systemctl status listmonk
```

**Start Listmonk:**

```bash
# If using Docker
cd /path/to/listmonk
docker compose up -d

# If using binary
./listmonk

# If using systemd
systemctl start listmonk
```

---

### Issue 2: Firewall blocking port 9000

**DigitalOcean Firewall Configuration:**

1. Go to **DigitalOcean Console** → **Networking** → **Firewalls**
2. Find the firewall attached to `146.190.162.121`
3. Add **Inbound Rule:**
   - Type: `Custom`
   - Protocol: `TCP`
   - Port: `9000`
   - Source: `All IPv4` and `All IPv6`

**Or via command line (on the server):**

```bash
# If using ufw
sudo ufw allow 9000/tcp
sudo ufw reload

# If using firewalld
sudo firewall-cmd --add-port=9000/tcp --permanent
sudo firewall-cmd --reload
```

---

### Issue 3: Nginx/Apache not configured correctly

If you're using a reverse proxy, the configuration might be incorrect.

**Nginx Configuration** (`/etc/nginx/sites-available/listmonk`):

```nginx
server {
    listen 80;
    server_name listmonk.behaviorschool.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name listmonk.behaviorschool.com;
    
    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/listmonk.behaviorschool.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/listmonk.behaviorschool.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy to Listmonk
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**Apply Nginx configuration:**

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### Issue 4: Listmonk configured on different port

Check your Listmonk configuration:

```bash
# Find config file
cd /path/to/listmonk
cat config.toml | grep "address"
```

Should show:
```toml
[app]
address = "0.0.0.0:9000"
```

If it's different, either:
- Change Listmonk config to use port 9000, OR
- Update your Nginx proxy_pass to the correct port

---

## Step-by-Step Connection Guide

### Step 1: Verify Listmonk is Running

SSH into your server and check:

```bash
ssh root@146.190.162.121

# Check if process is running
ps aux | grep listmonk

# Check which port it's listening on
sudo netstat -tulpn | grep listmonk
# OR
sudo ss -tulpn | grep listmonk

# If using Docker
docker ps
docker logs listmonk
```

**Expected output:**
```
tcp  0  0  0.0.0.0:9000  0.0.0.0:*  LISTEN  12345/listmonk
```

---

### Step 2: Test Locally on Server

While SSH'd into the server:

```bash
# Test health endpoint
curl http://localhost:9000/health

# Should return: {"data":"pong"}

# Test admin interface
curl -I http://localhost:9000/admin
```

If this works, Listmonk is running correctly, and the issue is with external access.

---

### Step 3: Configure Environment Variables

Once Listmonk is accessible, you need to set the admin credentials.

**Find your Listmonk admin credentials:**

```bash
# They were set during initial setup
# Check your notes or reset them via Listmonk CLI
./listmonk --list-users
```

**Update `.env.local` (locally):**

```bash
# Listmonk Configuration
LISTMONK_URL=https://listmonk.behaviorschool.com
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-admin-password
NEXT_PUBLIC_LISTMONK_EMBED_URL=https://listmonk.behaviorschool.com
```

**Update Netlify Environment Variables:**

1. Go to **Netlify Dashboard**
2. Select your site → **Site settings** → **Environment variables**
3. Add/Update:
   - `LISTMONK_URL` = `https://listmonk.behaviorschool.com`
   - `LISTMONK_USERNAME` = `admin` (or your username)
   - `LISTMONK_PASSWORD` = your admin password
   - `NEXT_PUBLIC_LISTMONK_EMBED_URL` = `https://listmonk.behaviorschool.com`
4. **Redeploy** your site

---

### Step 4: Test API Connection

Create a test script to verify the connection:

```bash
# On your server or local machine
curl -u "admin:your-password" https://listmonk.behaviorschool.com/api/health

# Should return: {"data":"pong"}

# Test lists endpoint
curl -u "admin:your-password" https://listmonk.behaviorschool.com/api/lists
```

---

### Step 5: Access from Admin Dashboard

Once configured:

1. Visit `https://behaviorschool.com/admin`
2. Click **"Newsletter (Listmonk)"** in the sidebar
3. You should see:
   - ✅ Connection status: "Connected"
   - ✅ Stats: Lists, Subscribers, Campaigns
   - ✅ "Open Listmonk" button works

---

## Quick Diagnostic Commands

Run these on your server to diagnose issues:

```bash
# 1. Is Listmonk running?
ps aux | grep listmonk

# 2. What port is it on?
sudo netstat -tulpn | grep listmonk

# 3. Can I access it locally?
curl http://localhost:9000/health

# 4. Is Nginx running?
systemctl status nginx

# 5. Check Nginx logs
tail -f /var/log/nginx/error.log

# 6. Check Listmonk logs
# If using systemd:
journalctl -u listmonk -f

# If using Docker:
docker logs -f listmonk

# 7. Is port 9000 open?
sudo ufw status | grep 9000
```

---

## Common Errors & Fixes

### Error: "Connection refused"
**Cause:** Listmonk is not running  
**Fix:** Start Listmonk (see Issue 1 above)

### Error: "Timeout" 
**Cause:** Firewall blocking port  
**Fix:** Open port 9000 in firewall (see Issue 2 above)

### Error: "502 Bad Gateway"
**Cause:** Nginx can't reach Listmonk  
**Fix:** Check if Listmonk is running on the expected port

### Error: "401 Unauthorized"
**Cause:** Wrong username/password  
**Fix:** Verify credentials in `.env.local` match Listmonk admin

### Error: "404 Not Found" (current issue)
**Cause:** Either:
- Listmonk is not running
- Nginx is misconfigured
- Wrong URL/path
**Fix:** Follow diagnostic steps above

---

## Recommended Architecture

```
Internet
   ↓
Cloudflare/CDN (optional)
   ↓
listmonk.behaviorschool.com (146.190.162.121)
   ↓
Nginx (Port 443 → 9000)
   ↓
Listmonk (Port 9000)
   ↓
PostgreSQL Database
```

---

## Security Checklist

Once connected, ensure:

- [ ] HTTPS enabled (Let's Encrypt SSL)
- [ ] Strong admin password set
- [ ] Firewall configured (only necessary ports open)
- [ ] Regular database backups
- [ ] SMTP credentials secured
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Listmonk kept up to date

---

## Next Steps

### Immediate Actions:

1. **SSH into 146.190.162.121**
2. **Run diagnostic commands** above
3. **Verify Listmonk is running**
4. **Check Nginx configuration**
5. **Open port 9000 if needed**
6. **Test API connection**
7. **Update environment variables**
8. **Redeploy Netlify site**

### Once Connected:

1. ✅ Test admin dashboard connection
2. ✅ Create your first mailing list
3. ✅ Set up email templates
4. ✅ Configure SMTP (Mailgun)
5. ✅ Import subscribers (if any)
6. ✅ Send test campaign

---

## Support

If you're still having issues after following this guide, check:

1. **Listmonk logs** for specific errors
2. **Nginx error logs** for proxy issues
3. **Firewall logs** for blocked connections

**Need Help?** 

Provide me with:
- Output of `ps aux | grep listmonk`
- Output of `curl http://localhost:9000/health` (from server)
- Nginx error log last 20 lines: `tail -20 /var/log/nginx/error.log`
- Listmonk logs: `journalctl -u listmonk -n 50`

---

## Test Connection Script

Save this as `test-listmonk.sh` and run it on your server:

```bash
#!/bin/bash

echo "=== Listmonk Connection Test ==="
echo ""

echo "1. Checking if Listmonk process is running..."
ps aux | grep listmonk | grep -v grep
echo ""

echo "2. Checking which ports Listmonk is listening on..."
sudo netstat -tulpn | grep listmonk
echo ""

echo "3. Testing local connection..."
curl -s http://localhost:9000/health && echo " ✅ Local connection works!" || echo " ❌ Local connection failed"
echo ""

echo "4. Testing external connection..."
curl -s https://listmonk.behaviorschool.com/health && echo " ✅ External connection works!" || echo " ❌ External connection failed"
echo ""

echo "5. Checking Nginx status..."
systemctl status nginx | grep Active
echo ""

echo "6. Checking firewall rules for port 9000..."
sudo ufw status | grep 9000 || echo "UFW not active or port not configured"
echo ""

echo "=== Test Complete ==="
```

Run it:
```bash
chmod +x test-listmonk.sh
./test-listmonk.sh
```

---

**Once everything is working, the admin dashboard at `/admin/listmonk` will automatically connect and show your newsletter stats!** 📊

