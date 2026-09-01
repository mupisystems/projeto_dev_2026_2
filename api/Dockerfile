FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/brezelle-api .

FROM alpine:3.20
RUN adduser -D -H app && mkdir -p /data && chown -R app:app /data
USER app
WORKDIR /app
COPY --from=build /out/brezelle-api .
EXPOSE 8080
CMD ["./brezelle-api"]
