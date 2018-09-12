# Futbol

[![Build Status](https://travis-ci.org/poulad/Futbol.svg?branch=master)](https://travis-ci.org/poulad/Futbol)

A Progressive Web App with Angular and ASP.NET Core

## Getting Started

1. Install NodeJS and APS.NET Core 2.1+
    ```bash
    # check .NET Core installation
    dotnet --info

    # check Angular CLI installation
    ng --version
    ```
1. Run an instance of Postgres database.
    ```bash
    # if using Docker, try this command
    docker run --name futbol-postgres --detach --publish 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=futbol -e POSTGRES_DB=futbol postgres:10
    ```
1. Start Angular app
    ```bash
    cd src/ClientApp/
    npm instal
    npm start
    ```
1. Start ASP.NET Core app
    ```bash
    cd src/Futbol.Web/
    dotnet run
    ```
1. hit [http://localhost:5000](http://localhost:5000) in your browser.

## Database

Using Docker

```bash
docker run --name futbol-postgres --detach --publish 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_USER=futbol -e POSTGRES_DB=futbol postgres:10

# docker stop futbol-postgres
# docker start futbol-postgres
# docker rm --volumes --force futbol-postgres
```

## Deployment

### Clean up

```bash
docker rm -fv futbol_web-app futbol_postgres
sudo rm -rfv /var/futbol/
```
