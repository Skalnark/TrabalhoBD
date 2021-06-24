package main

import (
	"encoding/json"
	"fmt"
	"net/mail"
)

func Format(response interface{}) string {
	res, err := json.Marshal(response)
	if err != nil {
		fmt.Println("(Format) Houve um erro ao realizar o Marshal da resposta: ", err)
		return ""
	}

	return string(res)
}

func ValidPassenger(p Passenger) string {

	err := ""

	if len(p.Username) < 4 {
		err += "Username must have at least 4 characteres"
	}

	if len(p.Password) < 8 {
		err += ", Password must have at least 8 characteres"
	}

	_, ret := mail.ParseAddress(p.Email)

	if ret != nil {
		err += ", Invalid email format."
		return err
	}

	return err
}

type Passenger struct {
	Id         string `json:"id_passenger" db:"id_passenger"`
	Username   string `json:"username" db:"username"`
	Email      string `json:"email", db:"email"`
	Password   string `json:"password" db:"password"`
	RoleType   string `json:"role_type" db:"role_type"`
	Scholarity string `json:"scholarity" db:"scholarity"`
}

type LineBus struct {
	Id     string `json:"id" db:"id_line_bus"`
	IdLine string `json:"id_line" db:"id_line"`
	IdBus  string `json:"id_bus" db:"id_bus"`
}

type Bus struct {
	IdBus          string `json:"id_bus" db:"id_bus`
	LineNumber     string `json:"line_number" db:"line_number"`
	DepartureTime  string `json:"departure_time" db:"departure_time"`
	PassengerCount string `json:"passenger_count", db:"passenger_count"`
}

type StationBus struct {
	Id        string `json:"id" db:"id_station_bus"`
	IdBus     string `json:"id_bus" db:"id_bus"`
	IdStation string `json:"id_station" db:"id_station"`
	LastSeen  string `json:"last_seen" db:"last_seen"`
}

type DbInfo struct {
	Username string
	Password string
	Name     string
	Port     string
	Host     string
}
