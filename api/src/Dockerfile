FROM golang:buster

ENV GO111MODULE=on

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o api main.go models.go && ls -la

EXPOSE 3000

CMD [ "./api" ]
