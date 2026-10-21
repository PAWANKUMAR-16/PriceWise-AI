@echo off
title PriceWise AI - Backend Server
echo ========================================================
echo Starting PriceWise AI Backend Server (Spring Boot 3.3)
echo ========================================================

cd /d "c:\Users\LOQ\Desktop\price tracer\backend"

set JAVA_HOME=C:\Users\LOQ\tools\jdk21
set PATH=%JAVA_HOME%\bin;%PATH%
set DATABASE_URL=jdbc:postgresql://localhost:5432/pricewise_db
set DATABASE_USERNAME=pricewise_user
set DATABASE_PASSWORD=pricewise_password
set JWT_SECRET=pricewise-dev-secret-key-minimum-256-bits-long-for-hmac-sha256

echo Java Version:
java -version

echo.
echo Launching Spring Boot on http://localhost:8080 ...
echo.

call mvnw.cmd spring-boot:run "-Dspring.profiles.active=dev"

pause
