# ASP.NET Core Web API – Docker & Kubernetes Quickstart

This guide walks you through running the API that lives in `AspNetCoreWebAPIForAngular` with Docker and Kubernetes on Docker Desktop. It is written for beginners—follow the steps in order and you will have the API running inside Kubernetes locally.

---

## 1. Prerequisites
- Docker Desktop (latest) with the **Kubernetes** option available
- .NET SDK 8.0 (or 7.0 if your project targets that version)
- PowerShell or any terminal located at  
  `D:\AspNet_Project_2025\AspNetCoreWebAPIForAngular\AspNetCoreWebAPIForAngular\AspNetCoreWebAPIForAngular`

---

## 2. Files to Add
Create the following files next to `AspNetCoreWebAPIForAngular.csproj`.

### 2.1 `Dockerfile`
```
# ------------ BUILD STAGE ------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AspNetCoreWebAPIForAngular.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app/publish

# ------------ RUNTIME STAGE ------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "AspNetCoreWebAPIForAngular.dll"]
```

> If the project uses .NET 7, replace `8.0` with `7.0` in both images.

### 2.2 `.dockerignore`
```
bin/
obj/
out/
.vs/
.vscode/
.idea/
*.user
*.suo
*.log
.git/
.gitignore
Dockerfile*
docker-compose.*
node_modules/
dist/
Thumbs.db
*.DS_Store
```

### 2.3 `k8s-deployment.yaml`
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aspnet-api-deployment
  labels:
    app: aspnet-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aspnet-api
  template:
    metadata:
      labels:
        app: aspnet-api
    spec:
      containers:
        - name: aspnet-api-container
          image: my-aspnet-api:1.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: aspnet-api-service
spec:
  type: NodePort
  selector:
    app: aspnet-api
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

---

## 3. Build and Test with Docker
1. Open PowerShell in the project folder.
2. Build the image:
   ```
   docker build -t my-aspnet-api:1.0 .
   ```
3. Run the container locally:
   ```
   docker run -d -p 5000:80 --name my-aspnet-api-container my-aspnet-api:1.0
   ```
4. Browse to `http://localhost:5000` (or `/swagger`).  
5. Stop and remove the test container when you're done:
   ```
   docker stop my-aspnet-api-container
   docker rm my-aspnet-api-container
   ```

---

## 4. Enable Kubernetes in Docker Desktop
1. Open Docker Desktop → **Settings** → **Kubernetes**.
2. Check **Enable Kubernetes** → **Apply & Restart**.
3. Wait for the status **Kubernetes is running**.
4. Verify from PowerShell:
   ```
   kubectl version --client
   kubectl get nodes
   ```

---

## 5. Deploy to Kubernetes
1. Make sure the Docker image `my-aspnet-api:1.0` exists locally.
2. Apply the deployment and service:
   ```
   kubectl apply -f k8s-deployment.yaml
   ```
3. Watch the pods:
   ```
   kubectl get pods
   ```
   Wait until the pod is `Running`.
4. Check the service:
   ```
   kubectl get service aspnet-api-service
   ```
   You should see `PORT(S)` similar to `80:30080/TCP`.
5. Open the API at `http://localhost:30080/swagger/` (Swagger UI) or `http://localhost:30080`.

---

## 6. Updating the App
1. Change your code.
2. Rebuild with a new tag:
   ```
   docker build -t my-aspnet-api:2.0 .
   ```
3. Update `image:` inside `k8s-deployment.yaml` to `my-aspnet-api:2.0`.
4. Reapply:
   ```
   kubectl apply -f k8s-deployment.yaml
   ```
5. Wait for the new pod to be ready (`kubectl get pods`).

---

## 7. Cleaning Up
```
kubectl delete -f k8s-deployment.yaml
docker rmi my-aspnet-api:1.0 my-aspnet-api:2.0
```

---

## 8. Quick Terminal Command Reference
- `docker build -t my-aspnet-api:1.0 .`
- `docker run -d -p 5000:80 --name my-aspnet-api-container my-aspnet-api:1.0`
- `docker ps`, `docker logs my-aspnet-api-container`, `docker exec -it my-aspnet-api-container sh`
- `kubectl apply -f k8s-deployment.yaml`
- `kubectl get pods -w`
- `kubectl logs deployment/aspnet-api-deployment`
- `kubectl get service aspnet-api-service`
- `kubectl port-forward service/aspnet-api-service 8080:80` (optional debugging)

---

## 9. Troubleshooting Tips
- Use `docker logs <container-name>` to see application logs when running with Docker.
- Use `kubectl logs <pod-name>` for Kubernetes logs.
- If the pod status is `CrashLoopBackOff`, describe it with `kubectl describe pod <pod-name>` to inspect events.
- Ensure the exposed ports in Docker (`-p 5000:80`) and Kubernetes (`nodePort: 30080`) are not already in use.

---

You now have everything needed to containerize this ASP.NET Core Web API and run it under Kubernetes via Docker Desktop. Share any errors you encounter and we can troubleshoot together.

