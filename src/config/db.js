const mysql = {
    HOST: "localhost",  // Switch between "localhost" and "mysqldb" (if dockerized)
    PORT: "3306",
    USERNAME: "root",
    PASSWORD: "admin",
    DATABASE: "fantatimerDB",
    POOL_SIZE: "10"
}

const jwt = {
    ACCESS_TOKEN_SECRET: "swsh23hjddnns",
    ACCESS_TOKEN_LIFE: "12h",
    REFRESH_TOKEN_SECRET: "dhw782wujnd99ahmmakhanjkajikhiwn2n",
    REFRESH_TOKEN_LIFE: "7d",
    ALGORITHM: "HS256"
}

module.exports = {
    db: mysql,
    token: jwt
}