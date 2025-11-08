#!/bin/bash
# Initialize MinIO bucket (run this after docker-compose up)

echo "Waiting for MinIO to be ready..."
sleep 5

mc alias set local http://localhost:9000 minio minio123
mc mb local/screenshots --ignore-existing
mc anonymous set download local/screenshots

echo "MinIO bucket 'screenshots' created and set to public!"

