#!/bin/bash

# Function to create a spinner loading template
create_spinner_loading() {
  echo '<div className="flex justify-center p-8"><Spinner size="lg" /></div>'
}

# Get all files that have skeleton loading
COMPONENT_FILES=$(find client/src/components/dashboard -name "*.tsx" | xargs grep -l "// Loading skeleton")
PAGE_FILES=$(find client/src/pages -name "*.tsx" | xargs grep -l "<Skeleton")

# Process each file
for file in $COMPONENT_FILES $PAGE_FILES; do
  echo "Processing $file..."
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Read the file line by line
  in_skeleton_block=false
  while IFS= read -r line; do
    if [[ "$line" == *"// Loading skeleton"* ]]; then
      in_skeleton_block=true
      echo "            {/* Spinner loading added by script */}" >> "$temp_file"
      echo "            $(create_spinner_loading)" >> "$temp_file"
    elif [[ "$in_skeleton_block" == true && "$line" == *"<Skeleton"* ]]; then
      # Skip lines with Skeleton components
      continue
    elif [[ "$in_skeleton_block" == true && ! "$line" == *"<Skeleton"* && ! "$line" == *"// Loading skeleton"* ]]; then
      # Check if this might be the end of the skeleton block
      if [[ "$line" == *"}"* || "$line" == *")"* || "$line" == *"</div>"* ]]; then
        in_skeleton_block=false
      else
        continue
      fi
    fi
    
    if [[ "$in_skeleton_block" == false ]]; then
      echo "$line" >> "$temp_file"
    fi
  done < "$file"
  
  # Replace the original file with the modified content
  mv "$temp_file" "$file"
done

echo "Replaced skeleton loading with spinner loading in all components!"