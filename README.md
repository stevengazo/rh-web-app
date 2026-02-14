## 📌 Sistema de Recursos Humanos – Web App (React + Vite)

Aplicación web para la gestión integral de Recursos Humanos, desarrollada con **React + Vite**, conectada a una API en **.NET** y base de datos **SQL Server**, todo orquestado con **Docker Compose**.

----------

## 🚀 Tecnologías Utilizadas

### 🔹 Frontend

-   ⚛️ React
    
-   ⚡ Vite
    
-   🐳 Docker
    
-   🌐 Nginx (para servir la app en producción)
    

### 🔹 Backend

-   🔷 .NET Web API
    
-   🔐 JWT Authentication
    
-   🗄️ SQL Server 2022
    
-   🐳 Docker
    

----------

## 📂 Módulos del Sistema

El sistema incluye los siguientes módulos principales:

-   👤 **Perfil de Empleado**
    
    -   Visualización y edición de datos personales
        
    -   Información laboral
        
    -   Historial
        
-   🏖️ **Gestión de Vacaciones**
    
    -   Solicitud de vacaciones
        
    -   Aprobación / Rechazo
        
    -   Cálculo de días disponibles
        
-   🎓 **Gestión de Cursos y Certificaciones**
    
    -   Registro de cursos
        
    -   Registro de certificaciones
        
    -   Historial académico del empleado
        
-   💰 **Nómina**
    
    -   Cálculo de pagos
        
    -   Historial de planillas
        
    -   Gestión de deducciones
        
-   📄 **Acciones de Personal**
    
    -   Cambios de puesto
        
    -   Aumentos salariales
        
    -   Sanciones
        
    -   Movimientos internos
        

----------

# 🐳 Despliegue con Docker

El proyecto utiliza **Docker Compose** para levantar los siguientes servicios:

-   SQL Server
-   API .NET
-   Aplicación Web (React + Vite)

----------

## 📦 Archivo `docker-compose.yml`

    `
    version: "3.9"
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: sql_server_test
    restart: always
    ports:
      - "1433:1433"
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "Your_password123"
    volumes:
      - sql_data1:/var/opt/mssql
  rhapi:
    image: stevengazo/rh-api:latest
    container_name: api_rh_test
    restart: always
    depends_on:
      - sqlserver
    ports:
      - "5000:8080"
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ConnectionStrings__DefaultConnection: >
        Server=sqlserver,1433;
        Database=RH;
        User ID=sa;
        Password=Your_password123;
        TrustServerCertificate=True;
      Jwt__Key: TU_LLAVE_SECRETA_LARGA_DE_MINIMO_32_CARACTERES
      Jwt__Issuer: MyApi
      Jwt__Audience: MyApiUsers
      Jwt__ExpiresInHours: 5
  rh-webapp:
    image: stevengazo/rh-web:latest
    container_name: webapp_rh_test
    restart: always
    depends_on:
      - rhapi
    ports:
      - "3000:80"
volumes:
  sql_data1:
        ` 

----------

# ▶️ Cómo Ejecutar el Proyecto

### 1️⃣ Requisitos

-   Docker Desktop instalado
-   Docker Compose habilitado
    

----------

### 2️⃣ Levantar los Servicios

En la raíz del proyecto ejecutar:

`docker-compose up -d` 

----------

### 3️⃣ Accesos

Servicio

URL

🌐 Web App

http://localhost:3000

🔷 API .NET

http://localhost:5000

🗄️ SQL Server

localhost:1433

----------

# 🔐 Configuración de Seguridad

La API utiliza autenticación basada en **JWT**.  
Es importante configurar correctamente:

-   `Jwt__Key`
    
-   `Jwt__Issuer`
    
-   `Jwt__Audience`
    

⚠️ **En producción**, cambiar:

-   La contraseña de `sa`
    
-   La llave secreta JWT
    
-   El entorno a `Production`
    

----------

# 🛠️ Desarrollo Local (Sin Docker para Frontend)

Si deseas correr solo el frontend en modo desarrollo:

`npm install
npm run dev` 

La aplicación estará disponible en:

`http://localhost:5173` 

⚠️ Asegúrate de configurar correctamente la URL base de la API en el archivo de configuración (por ejemplo, usando variables de entorno en Vite).
