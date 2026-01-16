#!/bin/bash

echo "🚀 Starting Task Manager Backend with Swagger..."
echo "================================================"
echo ""

# Start server in background
cd /home/kaka/Documents/kodeakademia/task-manager-backend
npm run dev > /tmp/swagger-test.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 6

echo ""
echo "📊 Server Status:"
echo "----------------"

# Check if server started
if grep -q "Server started" /tmp/swagger-test.log; then
    echo "✅ Server: Running on port 5000"
    
    # Test Swagger UI
    echo -n "✅ Swagger UI: "
    SWAGGER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api-docs/)
    if [ "$SWAGGER_STATUS" = "200" ]; then
        echo "Available at http://localhost:5000/api-docs"
    else
        echo "❌ Not accessible (HTTP $SWAGGER_STATUS)"
    fi
    
    # Test API
    echo -n "✅ API Health: "
    curl -s http://localhost:5000/api/health | jq -r '.status'
    
else
    echo "❌ Server: Failed to start"
    echo ""
    echo "Error logs:"
    tail -10 /tmp/swagger-test.log
fi

echo ""
echo "📝 How to use Swagger:"
echo "---------------------"
echo "1. Open browser: http://localhost:5000/api-docs"
echo "2. You'll see all API endpoints organized by tags"
echo "3. Click 'Try it out' on any endpoint to test it"
echo "4. For protected endpoints:"
echo "   - First login via POST /api/v1/auth/login"
echo "   - Copy the accessToken from response"
echo "   - Click 'Authorize' button (🔒 icon at top)"
echo "   - Paste token and click 'Authorize'"
echo "   - Now you can test protected endpoints"
echo ""
echo "🛑 Stopping test server..."
kill $SERVER_PID 2>/dev/null
sleep 2
pkill -f nodemon 2>/dev/null

echo "✅ Test complete!"
echo ""
echo "To run the server normally, use: npm run dev"
