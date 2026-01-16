#!/bin/bash

echo "🚀 Starting Task Manager Backend Server..."
echo "=========================================="
echo ""

# Start server in background
cd /home/kaka/Documents/kodeakademia/task-manager-backend
npm run dev > /tmp/server-test.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 5

echo ""
echo "📊 Connection Status:"
echo "--------------------"

# Check logs for connection status
if grep -q "MongoDB connected successfully" /tmp/server-test.log; then
    echo "✅ MongoDB: Connected"
else
    echo "❌ MongoDB: Not Connected"
fi

if grep -q "Redis connected successfully" /tmp/server-test.log; then
    echo "✅ Redis: Connected"
else
    echo "❌ Redis: Not Connected"
fi

if grep -q "Server started" /tmp/server-test.log; then
    echo "✅ Server: Running on port 5000"
else
    echo "❌ Server: Not Started"
fi

echo ""
echo "🧪 Testing Endpoints:"
echo "--------------------"

# Test health endpoint
echo -n "Health Check: "
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
if [ $? -eq 0 ]; then
    echo "✅ $HEALTH_RESPONSE"
else
    echo "❌ Failed to connect"
fi

# Test auth endpoint (should return 401)
echo -n "Auth Endpoint: "
AUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/v1/auth/me)
if [ "$AUTH_RESPONSE" = "401" ]; then
    echo "✅ Protected (401 - as expected)"
else
    echo "⚠️  Response: $AUTH_RESPONSE"
fi

echo ""
echo "📝 Recent Server Logs:"
echo "--------------------"
tail -20 /tmp/server-test.log | grep -E "(info|error|Error)"

echo ""
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null
sleep 2
pkill -f nodemon 2>/dev/null

echo "✅ Test complete!"
