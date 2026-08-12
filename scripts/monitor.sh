#!/bin/bash

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load Telegram creds from osis-smait-fi/.env if available
if [ -f "$ROOT_DIR/osis-smait-fi/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/osis-smait-fi/.env" | xargs)
fi

BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="${TELEGRAM_CHAT_ID}"
N8N_WEBHOOK_URL="${N8N_WEBHOOK_URL:-}"
SERVER_NAME="AgoraActa-Prod-Server"
RAM_THRESHOLD=80

# 1. Get RAM Usage
RAM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
RAM_USED=$(free -m | awk '/Mem:/ {print $3}')
RAM_USAGE_PCT=$(( RAM_USED * 100 / RAM_TOTAL ))

# 2. Get CPU Load (1 min average)
CPU_LOAD=$(cat /proc/loadavg | awk '{print $1}')

# 3. Get Disk Usage (Root partition)
DISK_USAGE_PCT=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

# 4. Check PM2 Processes
# Get PM2 status in JSON format
PM2_LIST=$(pm2 jlist 2>/dev/null || echo "[]")

# Check if any process is not online or has crashed
CRITICAL_ALERT=false
ALERT_MESSAGE=""

# Parse PM2 JSON using node (since node is guaranteed to be installed)
if [ "$PM2_LIST" != "[]" ]; then
  PM2_STATUS=$(node -e "
  try {
    const list = $PM2_LIST;
    const issues = list.filter(p => p.pm2_env.status !== 'online');
    if (issues.length > 0) {
      console.log(JSON.stringify({ alert: true, processes: issues.map(p => ({ name: p.name, status: p.pm2_env.status, restarts: p.pm2_env.restart_time })) }));
    } else {
      console.log(JSON.stringify({ alert: false }));
    }
  } catch (e) {
    console.log(JSON.stringify({ alert: false, error: e.message }));
  }
  ")

  PM2_ALERT=$(echo "$PM2_STATUS" | node -e "try { const r = JSON.parse(require('fs').readFileSync(0, 'utf-8')); console.log(r.alert); } catch(e) { console.log('false'); }")

  if [ "$PM2_ALERT" = "true" ]; then
    CRITICAL_ALERT=true
    ALERT_MESSAGE="PM2 Process Issue: $(echo "$PM2_STATUS" | node -e "const r = JSON.parse(require('fs').readFileSync(0, 'utf-8')); console.log(r.processes.map(p => p.name + ' is ' + p.status).join(', '));")"
  fi
else
  CRITICAL_ALERT=true
  ALERT_MESSAGE="PM2 is not running or not found"
fi

# Check RAM threshold
if [ $RAM_USAGE_PCT -gt $RAM_THRESHOLD ]; then
  CRITICAL_ALERT=true
  ALERT_MESSAGE="${ALERT_MESSAGE:+$ALERT_MESSAGE | }RAM usage is critical: ${RAM_USAGE_PCT}%"
fi

# 5. Check Health of Strapi and Next.js
STRAPI_STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:1337/admin || echo "000")
NEXTJS_STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://localhost:3002/ || echo "000")

if [ "$STRAPI_STATUS" != "200" ] && [ "$STRAPI_STATUS" != "302" ]; then
  CRITICAL_ALERT=true
  ALERT_MESSAGE="${ALERT_MESSAGE:+$ALERT_MESSAGE | }Strapi CMS is offline (HTTP $STRAPI_STATUS)"
fi

if [ "$NEXTJS_STATUS" != "200" ] && [ "$NEXTJS_STATUS" != "302" ]; then
  CRITICAL_ALERT=true
  ALERT_MESSAGE="${ALERT_MESSAGE:+$ALERT_MESSAGE | }Next.js Website is offline (HTTP $NEXTJS_STATUS)"
fi

# 6. Construct Payload
PAYLOAD=$(cat <<EOF
{
  "server": "$SERVER_NAME",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "metrics": {
    "cpu_load": $CPU_LOAD,
    "ram_total_mb": $RAM_TOTAL,
    "ram_used_mb": $RAM_USED,
    "ram_usage_pct": $RAM_USAGE_PCT,
    "disk_usage_pct": $DISK_USAGE_PCT
  },
  "health": {
    "strapi": "$STRAPI_STATUS",
    "nextjs": "$NEXTJS_STATUS"
  },
  "alert": {
    "critical": $CRITICAL_ALERT,
    "message": "$ALERT_MESSAGE"
  }
}
EOF
)

# 7. Send Notification (Telegram Direct / n8n)
if [ -n "$BOT_TOKEN" ] && [ -n "$CHAT_ID" ]; then
  EMOJI="🟢"
  STATUS_TITLE="Health Check OK"
  if [ "$CRITICAL_ALERT" = true ]; then
    EMOJI="🔴"
    STATUS_TITLE="CRITICAL ALERT"
  fi

  MESSAGE="${EMOJI} *${SERVER_NAME} - ${STATUS_TITLE}*
🕒 *Waktu:* $(date +'%Y-%m-%d %H:%M:%S')
💻 *CPU Load:* ${CPU_LOAD}
🧠 *RAM:* ${RAM_USAGE_PCT}% (${RAM_USED}MB / ${RAM_TOTAL}MB)
💾 *Disk:* ${DISK_USAGE_PCT}%
⚡ *Strapi (1337):* ${STRAPI_STATUS}
🌐 *Next.js (3002):* ${NEXTJS_STATUS}"

  if [ "$CRITICAL_ALERT" = true ]; then
    MESSAGE="${MESSAGE}
⚠️ *Pesan:* ${ALERT_MESSAGE}"
  fi

  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{\"chat_id\": \"${CHAT_ID}\", \"text\": $(echo "$MESSAGE" | jq -R -s '.'), \"parse_mode\": \"Markdown\"}" > /dev/null
fi

if [ -n "$N8N_WEBHOOK_URL" ] && [[ "$N8N_WEBHOOK_URL" =~ ^http ]]; then
  curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$N8N_WEBHOOK_URL" > /dev/null
fi
