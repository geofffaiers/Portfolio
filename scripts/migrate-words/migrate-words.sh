#!/bin/bash
# filepath: /home/geoff/projects/Portfolio/api/data/migrate-words.sh

set -e

# Check if required environment variables are set
if [ -z "$MYSQL_HOST" ] || [ -z "$MYSQL_PORT" ] || [ -z "$MYSQL_DATABASE" ] || [ -z "$MYSQL_ROOT_USER" ] || [ -z "$MYSQL_ROOT_PASSWORD" ]; then
    echo "Error: Required environment variables are not set"
    echo "Make sure MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_ROOT_USER, and MYSQL_ROOT_PASSWORD are defined"
    exit 1
fi

# Database connection details from environment variables
DB_HOST="$MYSQL_HOST"
DB_PORT="$MYSQL_PORT"
DB_NAME="$MYSQL_DATABASE"
DB_USER="$MYSQL_ROOT_USER"
DB_PASS="$MYSQL_ROOT_PASSWORD"

# Path to your words file (relative to script location)
WORDS_FILE="$(dirname "$0")/words.txt"

echo "Starting words migration..."
echo "Database: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo "Words file: $WORDS_FILE"

# Check if words file exists
if [ ! -f "$WORDS_FILE" ]; then
    echo "Error: Words file not found at $WORDS_FILE"
    exit 1
fi

# Check if we can connect to the database
echo "Testing database connection..."
if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --protocol=TCP --silent "$DB_NAME" -e "SELECT 1;" 2>/dev/null; then
    echo "Error: Cannot connect to database."
    echo "Debug info:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    echo "Testing direct connection..."
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --protocol=TCP --silent "$DB_NAME" -e "SELECT 1;"
    exit 1
fi

echo "Database connection successful!"

# Create temporary SQL file
TEMP_SQL=$(mktemp)

echo "Processing words file..."
# Generate SQL INSERT statements
echo "INSERT IGNORE INTO words (word, length, first_letter) VALUES" > "$TEMP_SQL"

# Process words file and create VALUES clauses
awk '
BEGIN { first = 1 }
NF > 0 && $1 != "" { 
    if (!first) printf(",\n")
    gsub(/['\''\\]/, "\\\\&", $1)  # Escape quotes and backslashes
    printf("('"'"'%s'"'"', %d, '"'"'%s'"'"')", $1, length($1), tolower(substr($1,1,1)))
    first = 0
}
END { printf(";\n") }
' "$WORDS_FILE" >> "$TEMP_SQL"

echo "Executing SQL migration..."
# Execute the SQL with protocol specification
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --protocol=TCP --silent "$DB_NAME" < "$TEMP_SQL"

# Cleanup
rm "$TEMP_SQL"

echo "Words migration completed!"

# Show stats
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --protocol=TCP --silent "$DB_NAME" -e "
SELECT 
    COUNT(*) as total_words,
    MIN(length) as min_length,
    MAX(length) as max_length,
    COUNT(DISTINCT first_letter) as unique_first_letters
FROM words;
"