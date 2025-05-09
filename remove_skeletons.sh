#!/bin/bash

# Find all files that have skeleton and replace them with spinner
files=(
  "client/src/components/dashboard/MedicalActivity.tsx"
  "client/src/components/dashboard/DataAccessControl.tsx"
  "client/src/components/dashboard/UpcomingAppointments.tsx"
  "client/src/components/dashboard/HealthProfile.tsx"
)

for file in "${files[@]}"; do
  echo "Processing $file..."
  
  # Add spinner import if not present
  if ! grep -q "import { Spinner } from \"@/components/ui/spinner\";" "$file"; then
    sed -i '1i import { Spinner } from "@/components/ui/spinner";' "$file"
  fi
  
  # Replace the isLoading condition with a simple spinner
  sed -i 's/{isLoading ? (.*{\/\* Spinner loading added by script \*\/}.*)/{isLoading ? (\n            <div className="flex justify-center p-8">\n              <Spinner size="lg" \/>\n            <\/div>\n          ) : (/g' "$file"
  
  # Clean any malformed JSX that might have been created
  sed -i 's/\/><\/div>/\/>\n            <\/div>/g' "$file"
  
  echo "Fixed $file"
done

echo "All files processed. Skeleton components removed and replaced with Spinner."