# ------------ BUILD STAGE ------------
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /src
    
    # Copy csproj and restore
    COPY AspNetCoreWebAPIForAngular.csproj ./
    RUN dotnet restore
    
    # Copy the rest of the source and build
    COPY . ./
    RUN dotnet publish -c Release -o /app/publish
    
    # ------------ RUNTIME STAGE ------------
    FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
    WORKDIR /app
    COPY --from=build /app/publish ./
    
    # Expose port (must match what your app uses; default is 80 here)
    EXPOSE 80
    EXPOSE 443
    
    # Set ASP.NET Core to listen on port 80
    ENV ASPNETCORE_URLS=http://+:80
    ENV ASPNETCORE_ENVIRONMENT=Development
    
    ENTRYPOINT ["dotnet", "AspNetCoreWebAPIForAngular.dll"]