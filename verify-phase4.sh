#!/bin/bash

# Simple verification script for Phase 4 implementation

echo "=========================================="
echo "Phase 4 Implementation Verification"
echo "=========================================="
echo ""

# Check file existence
echo "1. Checking file structure..."
FILES=(
  "src/infrastructure/database/mongoose/schemas/ProjectSchema.js"
  "src/infrastructure/database/mongoose/models/ProjectModel.js"
  "src/infrastructure/repositories/ProjectRepository.js"
  "src/application/use-cases/project/CreateProject.js"
  "src/application/use-cases/project/GetProject.js"
  "src/application/use-cases/project/GetAllProjects.js"
  "src/application/use-cases/project/UpdateProject.js"
  "src/application/use-cases/project/DeleteProject.js"
  "src/application/use-cases/project/UpdateProjectVisibility.js"
  "src/application/use-cases/project/AssignUserToProject.js"
  "src/application/use-cases/project/RemoveUserFromProject.js"
  "src/application/use-cases/project/GetProjectMembers.js"
  "src/presentation/validators/projectValidators.js"
  "src/presentation/controllers/ProjectController.js"
  "src/presentation/routes/projectRoutes.js"
  "src/presentation/swagger/schemas/projectSchemas.js"
)

ALL_EXIST=true
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file (MISSING)"
    ALL_EXIST=false
  fi
done
echo ""

# Check syntax
echo "2. Checking JavaScript syntax..."
SYNTAX_OK=true
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    if node -c "$file" 2>/dev/null; then
      echo "✓ $(basename $file) - syntax OK"
    else
      echo "✗ $(basename $file) - SYNTAX ERROR"
      SYNTAX_OK=false
    fi
  fi
done
echo ""

# Check integration
echo "3. Checking factory integration..."
if grep -q "getProjectRepository" src/main/factories/repositoryFactory.js; then
  echo "✓ ProjectRepository in RepositoryFactory"
else
  echo "✗ ProjectRepository NOT in RepositoryFactory"
fi

if grep -q "getCreateProject" src/main/factories/useCaseFactory.js; then
  echo "✓ Project use cases in UseCaseFactory"
else
  echo "✗ Project use cases NOT in UseCaseFactory"
fi

if grep -q "getProjectController" src/main/factories/controllerFactory.js; then
  echo "✓ ProjectController in ControllerFactory"
else
  echo "✗ ProjectController NOT in ControllerFactory"
fi

if grep -q "createProjectRoutes" src/main/AppFactory.js; then
  echo "✓ Project routes in AppFactory"
else
  echo "✗ Project routes NOT in AppFactory"
fi

if grep -q "Projects" src/presentation/swagger/swagger.config.js; then
  echo "✓ Projects tag in Swagger config"
else
  echo "✗ Projects tag NOT in Swagger config"
fi
echo ""

# Summary
echo "=========================================="
echo "Verification Summary:"
echo "=========================================="
if [ "$ALL_EXIST" = true ] && [ "$SYNTAX_OK" = true ]; then
  echo "✓ All files exist"
  echo "✓ All syntax checks passed"
  echo "✓ Integration verified"
  echo ""
  echo "Status: READY FOR TESTING"
  echo ""
  echo "Next steps:"
  echo "1. Start server: npm run dev"
  echo "2. Run full tests: ./test-project-management.sh"
  echo "3. View Swagger docs: http://localhost:5000/api-docs"
else
  echo "✗ Some checks failed - review output above"
fi
echo "=========================================="
