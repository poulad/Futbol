FROM microsoft/dotnet:2.1-aspnetcore-runtime

COPY app /app
WORKDIR /app/

CMD ASPNETCORE_URLS=http://*:$PORT dotnet Futbol.Web.dll
