#!/bin/bash 
echo "Start Cypress"
cd C:\\Users\\Idan\\RealCryptoMetrics-Webscraper && npx cypress run --browser chrome
echo "Cypress Finished"
echo "Start API Calls"
cd C:\\Users\\Idan\\RealCryptoMetrics-Webscraper\\scripts && npx ts-node daily-analysis-collection.ts
echo "Finished API Calls"