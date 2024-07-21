package utils

import (
	"server/initializers"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	ACCESS_KEY_TTL  = 15 * time.Minute // 15 minutes
	REFRESH_KEY_TTL = 7 * 24 * time.Hour // 7 days
)

var Jwtkey = []byte(initializers.CONFIG.JWT_SECRET)

func CreateToken(id string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": id,
		"crt": time.Now().Unix(),
		"exp": time.Now().Add(ACCESS_KEY_TTL).Unix(),
	})
	tokenString, err := token.SignedString(Jwtkey)
	if err != nil {
		panic(err)
	}
	return tokenString

}
