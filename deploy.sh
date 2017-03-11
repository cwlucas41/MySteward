./package.sh
aws lambda update-function-code --function-name MyStewardHandler --zip-file fileb://steward.zip
