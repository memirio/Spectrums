#!/bin/bash
# Quick status check for packaging batch 3 upload

LOG_FILE="/tmp/packaging_batch3.log"

echo "📊 Packaging Batch 3 Upload Status Check"
echo "========================================="
echo ""

if [ ! -f "$LOG_FILE" ]; then
    echo "⚠️  Log file not found. Script may not be running."
    exit 1
fi

# Count processed items
PROCESSED=$(grep -c "\[[0-9]\+/30\] Processing:" "$LOG_FILE" 2>/dev/null || echo "0")
echo "📦 Items processed: $PROCESSED / 30"

# Check for errors
ERRORS=$(grep -c "❌ Error:" "$LOG_FILE" 2>/dev/null || echo "0")
echo "❌ Errors: $ERRORS"

# Check for successes
SUCCESS=$(grep -c "✅ Successfully processed!" "$LOG_FILE" 2>/dev/null || echo "0")
echo "✅ Successfully processed: $SUCCESS"

# Check if process is still running
if pgrep -f "add_packaging_items_batch3.ts" > /dev/null; then
    echo "🟢 Status: Running"
else
    echo "🔴 Status: Not running (may have completed)"
fi

echo ""
echo "📝 Last 5 log entries:"
echo "---"
tail -5 "$LOG_FILE" | sed 's/^/   /'

echo ""
echo "💡 To see full log: tail -f $LOG_FILE"

