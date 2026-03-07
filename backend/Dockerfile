# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Download deps first (layer caching)
RUN apk add --no-cache maven
RUN mvn dependency:go-offline -B
RUN mvn clean package -DskipTests -B

# ─────────────────────────────────────────
# Stage 2: Run
# ─────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Dspring.profiles.active=docker", \
  "-jar", "app.jar"]
