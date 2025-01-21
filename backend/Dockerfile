FROM python:latest
 
# Set working directory
WORKDIR /usr/src/app
 
# Install debug tools
RUN apt-get update && apt-get install -y \
  curl \
  wget \
  net-tools \
  vim \
  bash\
  && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt ./

# Remove cached or broken packages if they exist (optional)
# RUN rm -rf venv
  
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port and start the application
EXPOSE 8000 
CMD ["sh", "-c", "alembic upgrade head && uvicorn website.main:app --reload --port 8000 --host 0.0.0.0"]