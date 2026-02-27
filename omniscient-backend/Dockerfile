# Use the official Microsoft Playwright image (includes Node.js and all Chromium dependencies)
FROM mcr.microsoft.com/playwright:v1.58.2-focal
# Set the working directory
WORKDIR /app

# Copy package files and install Node dependencies ONLY (skip OS browser installs)
COPY package*.json ./
RUN npm install

# Copy the remaining backend files
COPY . .

# Expose the Render port
EXPOSE 10000

# Command to run the Express server
CMD ["node", "server.js"]
