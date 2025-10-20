# 🚀 Listmonk Quick Fix - Get Connected in 5 Minutes

**Server:** 146.190.162.121  
**Domain:** listmonk.behaviorschool.com  
**Current Status:** ⚠️ Returns 404 (needs configuration)

---

## ⚡ Quick Fix Steps

### 1️⃣ SSH into Your Server (30 seconds)

```bash
ssh root@146.190.162.121
```

### 2️⃣ Check if Listmonk is Running (10 seconds)

```bash
# Quick check
ps aux | grep listmonk | grep -v grep

# If using Docker
docker ps | grep listmonk
```

**🔴 If nothing shows:** Listmonk is not running → Go to Step 3  
**🟢 If you see a process:** Listmonk is running → Go to Step 4

---

### 3️⃣ Start Listmonk (1 minute)

**If using Docker:**
```bash
cd /root/listmonk  # or wherever it's installed
docker compose up -d
docker ps  # Verify it's running
```

**If using binary:**
```bash
cd /path/to/listmonk
./listmonk &
```

**If using systemd:**
```bash
systemctl start listmonk
systemctl status listmonk
```

---

### 4️⃣ Test Local Connection (10 seconds)

```bash
curl http://localhost:9000/health
```

**Expected:** `{"data":"pong"}`  
**If you get this:** ✅ Listmonk is working! Continue to Step 5  
**If error:** Check Listmonk logs:
```bash
# Docker
docker logs listmonk

# Systemd
journalctl -u listmonk -n 50
```

---

### 5️⃣ Open Firewall Port (30 seconds)

```bash
# Check if port 9000 is open
sudo ufw status | grep 9000

# If not open, add it:
sudo ufw allow 9000/tcp
sudo ufw reload
```

---

### 6️⃣ Configure/Fix Nginx (2 minutes)

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/listmonk
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name listmonk.behaviorschool.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name listmonk.behaviorschool.com;
    
    ssl_certificate /etc/letsencrypt/live/listmonk.behaviorschool.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/listmonk.behaviorschool.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable and reload:**

```bash
# Create symlink if needed
sudo ln -sf /etc/nginx/sites-available/listmonk /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

### 7️⃣ Test External Connection (10 seconds)

```bash
curl https://listmonk.behaviorschool.com/health
```

**Expected:** `{"data":"pong"}`  
**✅ If you see this:** Listmonk is accessible!

---

### 8️⃣ Get Your Admin Credentials (30 seconds)

```bash
# If you forgot your admin password, list users:
cd /path/to/listmonk
./listmonk --list-users

# Or reset password for admin user (ID is usually 1):
./listmonk --reset-password --user-id 1
# Follow prompts to set new password
```

---

### 9️⃣ Update Netlify Environment Variables (1 minute)

1. Go to **Netlify Dashboard** → Your Site → **Site settings** → **Environment variables**
2. Add/Update these:

```
LISTMONK_URL=https://listmonk.behaviorschool.com
LISTMONK_USERNAME=admin
LISTMONK_PASSWORD=your-password-from-step-8
NEXT_PUBLIC_LISTMONK_EMBED_URL=https://listmonk.behaviorschool.com
```

3. Click **"Redeploy site"**

---

### 🔟 Test from Admin Dashboard (30 seconds)

Once Netlify redeploys:

1. Visit https://behaviorschool.com/admin
2. Click **"Newsletter (Listmonk)"** in sidebar
3. You should see:
   - ✅ Connection Status: Connected
   - ✅ Lists, Subscribers, Campaigns stats
   - ✅ "Open Listmonk" button works

---

## 🎯 Expected Result

**Before Fix:**
```
❌ 404 Not Found
❌ Can't access Listmonk
❌ Admin dashboard shows "Not configured"
```

**After Fix:**
```
✅ https://listmonk.behaviorschool.com works
✅ Admin dashboard shows connection stats
✅ Can manage newsletters from admin panel
```

---

## 🆘 Still Not Working?

### Run Full Diagnostic:

```bash
# Save this as test.sh
#!/bin/bash
echo "1. Listmonk process:"
ps aux | grep listmonk | grep -v grep

echo -e "\n2. Listening ports:"
sudo netstat -tulpn | grep listmonk

echo -e "\n3. Local test:"
curl -s http://localhost:9000/health

echo -e "\n4. External test:"
curl -s https://listmonk.behaviorschool.com/health

echo -e "\n5. Nginx status:"
systemctl status nginx | grep Active

echo -e "\n6. Firewall:"
sudo ufw status | grep 9000

echo -e "\n7. Last Nginx errors:"
tail -5 /var/log/nginx/error.log
```

Run it:
```bash
chmod +x test.sh
./test.sh
```

**Send me the output** and I'll help you fix it!

---

## 📞 Common Quick Fixes

### Problem: "Connection refused"
```bash
# Listmonk not running
cd /path/to/listmonk
./listmonk &
```

### Problem: "502 Bad Gateway"
```bash
# Nginx can't reach Listmonk - check port
sudo netstat -tulpn | grep 9000
# Should show: 0.0.0.0:9000 ... LISTEN
```

### Problem: "Timeout"
```bash
# Firewall blocking
sudo ufw allow 9000/tcp
sudo ufw reload
```

### Problem: "401 Unauthorized"
```bash
# Wrong password - reset it
cd /path/to/listmonk
./listmonk --reset-password --user-id 1
```

---

## ✨ Success Indicators

You'll know it's working when:

1. ✅ `curl https://listmonk.behaviorschool.com/health` returns `{"data":"pong"}`
2. ✅ Admin dashboard shows connection stats
3. ✅ You can open Listmonk UI from admin panel
4. ✅ You can create campaigns and send emails

---

**Total Time:** ~5 minutes  
**Difficulty:** Easy  
**Skills Needed:** Basic Linux commands

**Good luck! 🚀**

