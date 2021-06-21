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
  Email string `json:"email", db:"email"`
}

type LineBus struct {
  Id string `json:"id" db:"id_line_bus"`
  IdLine string `json:"id_line" db:"id_line"`
  IdBus string `json:"is_bus" db:"id_bus"`
}

type Bus struct {
  Id string `json:"id_bus" db:"id_bus`
  LineNumber string `json:"line_number" db:"line_number"`
  DepartureTime string `json:"departure_time" db:"departure_time"`
  Passengers int `json:"passengers", db:"passengers"`
}

type StationBus struct {
  Id string `json:"id" db:"id_station_bus"`
  IdBus string `json:"id_bus" db:"id_bus"`
  IdStation string `json:"id_station" db:"id_station"`
  LastSeen string `json:"last_seen" db:"last_seen"`
}

type DbInfo struct {
  Username string
  Password string
  Name string
  Port string 
  Host string
}