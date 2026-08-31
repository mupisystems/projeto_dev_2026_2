package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const AdminEmailKey contextKey = "admin_email"

func RequireJWT(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
			tokenString := ""
			if authorization := request.Header.Get("Authorization"); strings.HasPrefix(authorization, "Bearer ") {
				tokenString = strings.TrimPrefix(authorization, "Bearer ")
			} else if cookie, err := request.Cookie("brezelle_token"); err == nil {
				tokenString = cookie.Value
			}
			if tokenString == "" {
				writeUnauthorized(writer)
				return
			}

			token, err := jwt.Parse(tokenString, func(parsed *jwt.Token) (interface{}, error) {
				if _, ok := parsed.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(secret), nil
			})
			if err != nil || !token.Valid {
				writeUnauthorized(writer)
				return
			}
			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				writeUnauthorized(writer)
				return
			}
			email, _ := claims["email"].(string)
			next.ServeHTTP(writer, request.WithContext(context.WithValue(request.Context(), AdminEmailKey, email)))
		})
	}
}

func writeUnauthorized(writer http.ResponseWriter) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusUnauthorized)
	_, _ = writer.Write([]byte(`{"error":"Sessão inválida ou expirada"}`))
}
