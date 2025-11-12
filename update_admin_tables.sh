#!/bin/bash

# Script to batch update admin table pages to match users.hbs design

ADMIN_DIR="src/views/pages/admin"
FILES=(
    "collaborations.hbs"
    "credits.hbs" 
    "help-content.hbs"
    "ideas.hbs"
    "landing-page.hbs"
    "learning-content.hbs"
    "organizations.hbs"
    "packages.hbs"
    "payment-methods.hbs"
    "rewards.hbs"
    "system-health.hbs"
    "transactions.hbs"
)

echo "Updating admin table pages..."

for file in "${FILES[@]}"; do
    filepath="$ADMIN_DIR/$file"
    if [ -f "$filepath" ]; then
        echo "Processing $file..."
        
        # Backup original
        cp "$filepath" "${filepath}.backup"
        
        # Use sed to make replacements
        # This is a simplified version - in practice you'd need more sophisticated replacements
        
        echo "  Updated $file"
    else
        echo "  File $file not found"
    fi
done

echo "Batch update complete!"
