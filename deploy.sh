# Full deployment script for ChordsLegend

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function for section headers
section_header() {
  echo -e "${BLUE}▶ $1 ${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}"
}

# Function for success messages
success() {
  echo -e "${GREEN}✓ $1 ${NC}"
}

# Function for warnings
warning() {
  echo -e "${YELLOW}⚠ $1 ${NC}"
}

# Function for errors
error() {
  echo -e "${RED}✗ $1 ${NC}"
}

section_header "Starting ChordsLegend Deployment"

# 1. Build the Expo web app
section_header "Building Expo Web App"
echo -e "${CYAN}Building the React/Expo web app...${NC}"
npx expo export:web --clear
if [ $? -eq 0 ]; then
  success "Expo web build successful!"
else
  error "Expo web build failed!"
  exit 1
fi

# 2. Copy web-build to server directory
section_header "Preparing Web Build for Server"
echo -e "${CYAN}Copying web-build files to server/web-build...${NC}"
rm -rf server/web-build
mkdir -p server/web-build
cp -r web-build/* server/web-build/

# 3. Fix paths in web-build files
echo -e "${CYAN}Fixing paths in web files...${NC}"
sed -i 's|/ismailfadlalla/ChordsLegend/|/|g' server/web-build/index.html
sed -i 's|\\ismailfadlalla\\ChordsLegend\\|/|g' server/web-build/index.html

# 4. Add to git
section_header "Committing to Git"
git add server/web-build -f
git commit -m "Deploy web app to Railway"

# 5. Push to GitHub
section_header "Pushing to GitHub"
echo -e "${CYAN}Pushing to GitHub to trigger Railway deployment...${NC}"
git push

success "Deployment initiated!"
warning "Railway deployment will take 3-5 minutes to complete."
echo ""
echo -e "${CYAN}Run the following to verify deployment:${NC}"
echo "  node test-railway-deployment.js"
echo ""
echo -e "${GREEN}Your app will be available at:${NC}"
echo "  https://chordslegend-production.up.railway.app/"
