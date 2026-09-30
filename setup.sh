#!/bin/bash
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Install Node.js 14+ first."
    exit 1
fi

npm install
echo ""
echo "Setup complete. To run:"
echo "  npm run dev"
echo ""