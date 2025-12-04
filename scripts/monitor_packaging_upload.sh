#!/bin/bash
# Monitor packaging upload script progress
# Checks every 10 minutes to ensure process isn't stuck

LOG_FILE="/tmp/packaging_upload.log"
PID_FILE="/tmp/packaging_upload.pid"
CHECK_INTERVAL=600  # 10 minutes in seconds

echo "🔍 Starting monitoring for packaging upload script..."
echo "   Log file: $LOG_FILE"
echo "   Check interval: $CHECK_INTERVAL seconds (10 minutes)"
echo ""

# Function to check if process is stuck
check_progress() {
    if [ ! -f "$LOG_FILE" ]; then
        echo "⚠️  Log file not found. Script may not have started."
        return 1
    fi
    
    # Get last log entry timestamp
    LAST_LINE=$(tail -1 "$LOG_FILE" 2>/dev/null)
    LAST_TIME=$(stat -f "%m" "$LOG_FILE" 2>/dev/null || stat -c "%Y" "$LOG_FILE" 2>/dev/null)
    CURRENT_TIME=$(date +%s)
    
    if [ -z "$LAST_TIME" ]; then
        echo "⚠️  Could not get log file timestamp"
        return 1
    fi
    
    TIME_DIFF=$((CURRENT_TIME - LAST_TIME))
    
    # Check if log hasn't been updated in more than 15 minutes (stuck)
    if [ $TIME_DIFF -gt 900 ]; then
        echo "⚠️  WARNING: Log file hasn't been updated in $((TIME_DIFF / 60)) minutes"
        echo "   Last log entry: $LAST_LINE"
        echo "   Process may be stuck!"
        return 1
    else
        echo "✅ Process is active (last update: $((TIME_DIFF / 60)) minutes ago)"
        echo "   Last log entry: $LAST_LINE"
        return 0
    fi
}

# Main monitoring loop
while true; do
    echo ""
    echo "⏰ $(date '+%Y-%m-%d %H:%M:%S') - Checking progress..."
    
    # Check if process is still running
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo "✅ Process is running (PID: $PID)"
            check_progress
        else
            echo "✅ Process has completed (PID: $PID no longer running)"
            echo ""
            echo "📊 Final Summary:"
            tail -20 "$LOG_FILE" | grep -E "(Success|Skipped|Errors|Total|Complete)" || echo "   (No summary found in log)"
            break
        fi
    else
        # Try to find the process by checking for tsx running the script
        if pgrep -f "add_packaging_items_new.ts" > /dev/null; then
            echo "✅ Process is running (found by process name)"
            check_progress
        else
            echo "ℹ️  Process not found. It may have completed or not started yet."
            check_progress
        fi
    fi
    
    echo ""
    echo "💤 Sleeping for $((CHECK_INTERVAL / 60)) minutes..."
    sleep $CHECK_INTERVAL
done

echo ""
echo "🏁 Monitoring complete."

