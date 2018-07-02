FROM microsoft/aspnetcore:2
WORKDIR /app
COPY aspnetcore .
ENTRYPOINT ["dotnet", "Futbol.Web.dll"]