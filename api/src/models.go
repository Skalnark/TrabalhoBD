package main

import(
  "fmt"
  "encoding/json"
)

func Format(response interface{}) string {
  res, err := json.Marshal(response)
  if err != nil {
    fmt.Println("(Format) Houve um erro ao realizar o Marshal da resposta: ", err)
    return ""
  }

  return string(res)
}

type Usuario struct {
  Username  string `json:"username" db:"username"`
  Email string
}

type LineBus struct {
  IdLineBus string `json:"id" db:"id_line_bus"`
  IdLine string `json:"id_line" db:"id_line"`
  IdBus string `json:"is_bus" db:"id_bus"`
  Schedule string `json:"schedule" db:"schedule"`
}

type DbInfo struct {
  Username string
  Password string
  Name string
  Port string 
  Host string
}