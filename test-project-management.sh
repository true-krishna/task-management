#!/bin/bash

# Test script for Project Management endpoints
# Make sure the server is running before executing this script

BASE_URL="http://localhost:5000/api/v1"
CONTENT_TYPE="Content-Type: application/json"

echo "============================================"
echo "Project Management API Testing"
echo "============================================"
echo ""

# Variables to store tokens and IDs
ACCESS_TOKEN=""
USER_ID=""
PROJECT_ID=""
SECOND_USER_ID=""

# Test 1: Register a test user
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "project-owner@test.com",
    "password": "Password123!",
    "firstName": "Project",
    "lastName": "Owner"
  }')
echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Test 2: Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "project-owner@test.com",
    "password": "Password123!"
  }')
echo "$LOGIN_RESPONSE" | jq '.'

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user.id')
echo "Access Token: $ACCESS_TOKEN"
echo "User ID: $USER_ID"
echo ""

# Test 3: Create a project
echo "3. Creating a project..."
CREATE_PROJECT=$(curl -s -X POST "$BASE_URL/projects" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "E-commerce Platform",
    "description": "Building a modern e-commerce platform with React and Node.js",
    "status": "planning",
    "visibility": "team"
  }')
echo "$CREATE_PROJECT" | jq '.'

PROJECT_ID=$(echo "$CREATE_PROJECT" | jq -r '.data.id')
echo "Project ID: $PROJECT_ID"
echo ""

# Test 4: Get project by ID
echo "4. Getting project by ID..."
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 5: Get all projects
echo "5. Getting all projects..."
curl -s -X GET "$BASE_URL/projects?page=1&limit=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 6: Update project
echo "6. Updating project..."
curl -s -X PUT "$BASE_URL/projects/$PROJECT_ID" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "E-commerce Platform v2",
    "status": "active"
  }' | jq '.'
echo ""

# Test 7: Register a second user to add as member
echo "7. Registering second test user..."
REGISTER_USER2=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "team-member@test.com",
    "password": "Password123!",
    "firstName": "Team",
    "lastName": "Member"
  }')
echo "$REGISTER_USER2" | jq '.'

SECOND_USER_ID=$(echo "$REGISTER_USER2" | jq -r '.data.id')
echo "Second User ID: $SECOND_USER_ID"
echo ""

# Test 8: Add member to project
echo "8. Adding member to project..."
curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/members" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"userId\": \"$SECOND_USER_ID\"
  }" | jq '.'
echo ""

# Test 9: Get project members
echo "9. Getting project members..."
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID/members" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 10: Update project visibility
echo "10. Updating project visibility to public..."
curl -s -X PATCH "$BASE_URL/projects/$PROJECT_ID/visibility" \
  -H "$CONTENT_TYPE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "visibility": "public"
  }' | jq '.'
echo ""

# Test 11: Remove member from project
echo "11. Removing member from project..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID/members/$SECOND_USER_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 12: Filter projects by status
echo "12. Getting projects filtered by status (active)..."
curl -s -X GET "$BASE_URL/projects?status=active" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 13: Filter projects by visibility
echo "13. Getting projects filtered by visibility (public)..."
curl -s -X GET "$BASE_URL/projects?visibility=public" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 14: Delete project
echo "14. Deleting project..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# Test 15: Try to get deleted project (should return 404)
echo "15. Trying to get deleted project (should fail)..."
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

echo "============================================"
echo "Project Management Testing Complete!"
echo "============================================"
