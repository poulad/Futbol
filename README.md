# Futbol

[![Build Status](https://travis-ci.org/pouladpld/Futbol.svg?branch=master)](https://travis-ci.org/pouladpld/Futbol)

A Progressive Web App with Angular and ASP.NET Core

## Getting Started

<!-- 1. Install self-signed certificate. try [this article](https://www.humankode.com/asp-net-core/develop-locally-with-https-self-signed-certificates-and-asp-net-core) -->
1. Install NodeJS and APS.NET Core 2.1+
1. `npm start`
1. `dotnet run`
1. http://localhost:5000

### Database

Using Docker

```bash
docker run --detach --publish 5432:5432 --name futbol-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=futbol -e POSTGRES_DB=futbol postgres:10

# docker stop futbol-postgres
# docker start futbol-postgres
# docker rm --volumes --force futbol-postgres
```