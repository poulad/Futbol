FROM microsoft/aspnetcore:2
COPY app /app
WORKDIR /app/
ENTRYPOINT ["dotnet", "Futbol.Web.dll"]