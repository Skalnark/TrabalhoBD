package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

//DB armazena a conexão com o banco de dados
var DB *sqlx.DB
var key string

func main() {

	port := os.Getenv("SERVER_PORT")
	host := os.Getenv("SERVER_HOST")
	key = os.Getenv("JWT_KEY")
	var dbinfo = DbInfo{
		Host:     os.Getenv("SERVER_DB_HOST"),
		Port:     os.Getenv("SERVER_DB_PORT"),
		Username: os.Getenv("SERVER_DB_USER"),
		Password: os.Getenv("SERVER_DB_PASSWORD"),
		Name:     os.Getenv("SERVER_DB_NAME")}

	err := OpenConnection(dbinfo)

	if err != nil {
		fmt.Println("Error connecting to the database: ", err)
		return
	}

	HTTPServer(host, port)

	fmt.Printf("Exiting...\n")
	defer DB.Close()
}

func HTTPServer(host string, port string) {

	http.HandleFunc("/GetBusScheduling", BasicAuth(GetBusScheduling))
	http.HandleFunc("/GetPassengers", BasicAuth(GetPassengers))
	http.HandleFunc("/GetArrivalTime", BasicAuth(GetArrivalTime))
	http.HandleFunc("/SignUp", SignUp)
	http.HandleFunc("/CreateComment", BasicAuth(CreateComment))
	http.HandleFunc("/GetComments", BasicAuth(GetComments))
	http.HandleFunc("/GetBusByLine", BasicAuth(GetBusByLine))
	http.HandleFunc("/GetBusByStation", BasicAuth(GetBusByStation))
	http.HandleFunc("/GetLineByStation", BasicAuth(GetLineByStation))
	http.HandleFunc("/GetAllBus", BasicAuth(GetAllBus))
	http.HandleFunc("/GetBusById", BasicAuth(GetBusById))

	l := host + ":" + port

	fmt.Println("\n\nIniciando servidor em ", l)

	fmt.Println(http.ListenAndServe(l, nil))
}

func GetBusById(w http.ResponseWriter, r *http.Request) {

	idBus := r.URL.Query().Get("bus")

	rawSqlData, err := ioutil.ReadFile("./sql/get_bus_by_id.sql")

	if err != nil {
		fmt.Println("Error reading file")
		w.WriteHeader(http.StatusInternalServerError)
		return	
	}

	sql := string(rawSqlData)

	var bus Bus

	err = DB.Get(&bus, sql, idBus)

	if err != nil {
		fmt.Println("Error running query", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	busJson, err := json.Marshal(bus)

	if err != nil {
		fmt.Println("Error marshaling json", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(busJson))
}

func GetAllBus(w http.ResponseWriter, r *http.Request) {
	
	rawSqlData, err := ioutil.ReadFile("./sql/get_all_bus.sql")

	if err != nil {
		fmt.Println("Error reading file get_all_bus.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sql := string(rawSqlData)

	var busArr []Bus

	err = DB.Select(&busArr, sql)

	if err != nil {
		fmt.Println("Error running query get_all_bus.sql")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	busJson, err := json.Marshal(busArr)

	if err != nil {
		fmt.Println("Error marshaling the response: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(busJson))
}

func GetLineByStation(w http.ResponseWriter, r *http.Request) {

	IdStation := r.URL.Query().Get("IdStation")

	rawSqlData, err := ioutil.ReadFile("./sql/get_line_by_station.sql")

	sql := string(rawSqlData)

	var lines []Line

	err = DB.Select(&lines, sql, IdStation)

	lineJson, err := json.Marshal(lines)

	if err != nil {
		fmt.Println("Error marshalling the line array: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(lineJson))
}

func GetBusByStation(w http.ResponseWriter, r *http.Request) {
	var station StationBus

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println("Error reading the request body: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &station)

	if err != nil {
		fmt.Println("Error unmarshaling the body: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	rawSqlData, err := ioutil.ReadFile("./sql/get_bus_by_bus_station.sql")

	if err != nil {
		fmt.Println("Error reading file get_bus_by_bus_station.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sql := string(rawSqlData)

	var busArr []Bus

	err = DB.Select(&busArr, sql, station.IdStation)

	if err != nil {
		fmt.Println("Error running get_bus_by_bus_station.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	busJson, err := json.Marshal(busArr)

	if err != nil {
		fmt.Println("Error marshaling the response: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(busJson))
}

func GetBusByLine(w http.ResponseWriter, r *http.Request) {
	var line Line

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println("Error reading the request body: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = json.Unmarshal(body, &line)

	if err != nil {
		fmt.Println("Error unmarshalling the request body: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	rawSqlData, err := ioutil.ReadFile("./sql/get_bus_by_line.sql")

	if err != nil {
		fmt.Println("Error reading file get_bus_by_line.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sql := string(rawSqlData)

	var busArr []Bus

	err = DB.Select(&busArr, sql, line.Code)

	if err != nil {
		fmt.Println("Error running get_bus_by_line.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	busJson, err := json.Marshal(busArr)

	if err != nil {
		fmt.Println("Error marshalling the bus array: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(busJson))
}

func SignUp(w http.ResponseWriter, r *http.Request) {

	var passenger Passenger

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Fprintf(w, `{"Eror": "Internal server error"}`)
		return
	}

	err = json.Unmarshal(body, &passenger)

	if err != nil {
		fmt.Println("Error unmarshaling the body: ", err)
		fmt.Fprintf(w, `{"Eror": "Internal server error"}`)
		return
	}

	valid := ValidPassenger(passenger)

	if len(valid) > 0 {
		fmt.Fprint(w, `{"Error": "`+valid+`"}`)
		return
	}

	rawSqlData, err := ioutil.ReadFile("./sql/passenger_exists.sql")

	if err != nil {
		fmt.Println("Error parsing passenger_exists.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sql := string(rawSqlData)

	data, err := DB.Queryx(sql, passenger.Username, passenger.Email)

	if err != nil {
		fmt.Println("Error on query passenger_exists.sql")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var p Passenger

	data.StructScan(p)

	if len(p.Email) > 0 {
		fmt.Fprintf(w, `{"Error": "Username or email already taken"}`)
		return
	}

	rawSqlData, err = ioutil.ReadFile("./sql/new_user.sql")

	if err != nil {
		fmt.Println("Error reading file new_user.sql: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sql = string(rawSqlData)

	_, err = DB.Exec(sql, passenger.Username, passenger.Password, passenger.Email)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "User created")
}

func GetArrivalTime(w http.ResponseWriter, r *http.Request) {

	strBusParameter := r.URL.Query().Get("id_bus")
	busParameter, err := strconv.Atoi(strBusParameter)

	if err != nil {
		fmt.Println("Error parsing id_bus: ", err)
		return
	}

	strStationParameter := r.URL.Query().Get("id_station")
	stationParameter, err := strconv.Atoi(strStationParameter)

	if err != nil {
		fmt.Println("Error parsing id_station: ", err)
		return
	}

	rawSqlData, err := ioutil.ReadFile("./sql/schedule_by_stop.sql")

	if err != nil {
		fmt.Println("Error reading file schedule_by_stop.sql: ", err)
		return
	}

	sql := string(rawSqlData)

	rows, err := DB.Queryx(sql, busParameter, stationParameter)

	if err != nil {
		fmt.Println("Error running schedule_by_stop.sql: ", err)
		return
	}

	var station StationBus

	for rows.Next() {
		err = rows.StructScan(&station)
	}

	if err != nil {
		fmt.Println("Error reading the schedule response", err)
		return
	}

	ls, err := time.Parse(time.RFC3339, station.LastSeen)

	if err != nil {
		fmt.Println("Error parsing Station.LastSeen: ", err)
		return
	}

	nowh, nowm, _ := time.Now().Clock()
	lsh, lsm, _ := ls.Clock()

	finalHour := lsh - nowh
	finalMinute := lsm - nowm

	if nowh > lsh {
		finalHour += 24
	}

	if finalHour < -1 {
		finalHour = -finalHour
	}

	if (lsm - nowm) < 0 {
		finalHour -= 1
		finalMinute += 60
	}

	debug := fmt.Sprintf("Horário do sistema: %02d:%02d", nowh, nowm)

	fmt.Println(debug)

	hours := fmt.Sprintf("%02d", finalHour)
	minutes := fmt.Sprintf("%02d", finalMinute)

	var response = `{"time_to_arrival": "` + hours + ":" + minutes + `"}`

	fmt.Fprintf(w, response)
}

func GetPassengers(w http.ResponseWriter, r *http.Request) {

	busParameter := r.URL.Query().Get("bus")

	rawSqlData, err := ioutil.ReadFile("./sql/number_passengers.sql")

	if err != nil {
		fmt.Println("Error reading file number_passengers.sql", err)
		return
	}

	sql := string(rawSqlData)

	rows, err := DB.Queryx(sql, busParameter)

	if err != nil {
		fmt.Println("Error running number_passengers.sql", err)
		return
	}

	var passenger_count string

	for rows.Next() {
		err = rows.Scan(&passenger_count)
	}

	if err != nil {
		fmt.Println("Error unmarshaling the rows: ", err)
		return
	}

	var bus Bus
	bus.PassengerCount = passenger_count

	fmt.Fprintf(w, Format(bus))
}

func GetBusScheduling(w http.ResponseWriter, r *http.Request) {

	lineBus := LineBus{IdBus: r.URL.Query().Get("bus"), IdLine: r.URL.Query().Get("line")}

	rawSqlData, err := ioutil.ReadFile("./sql/schedule_by_stop.sql")

	if err != nil {
		fmt.Println("Error reading file schedule_by_stop.sql: ", err)
		return
	}

	scheduleByStopSQL := string(rawSqlData)

	rows, err := DB.Queryx(scheduleByStopSQL, lineBus.IdBus, lineBus.IdLine)

	if err != nil {
		fmt.Println("Error running scheduleByStopSQL: ", err)
		return
	}

	var station StationBus

	for rows.Next() {
		err = rows.StructScan(&station)
	}

	if err != nil {
		fmt.Println("Error reading the schedule response", err)
		return
	}

	fmt.Fprintf(w, Format(station))
}

func Root(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Haro warudo")
}

func CreateComment(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println("Error reading the body", err)
		return
	}

	var comment Comment

	err = json.Unmarshal(body, &comment)

	if err != nil {
		fmt.Println("Error unmarshaling the body: ", err)
		return
	}

	rawSqlData, err := ioutil.ReadFile("./sql/comment.sql")

	if err != nil {
		fmt.Println("Error opening comment.sql: ", err)
		return
	}

	sql := string(rawSqlData)

	_, err = DB.Queryx(sql, comment.IdBus, comment.IdPassenger, comment.Content)

	if err != nil {
		fmt.Println("Error inserting data: ", err)
		return
	}
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	busParameter := r.URL.Query().Get("bus")

	rawSqlData, err := ioutil.ReadFile("./sql/get_comments.sql")

	if err != nil {
		fmt.Println("Error reading file get_comments.sql", err)
		return
	}

	sql := string(rawSqlData)

	comments := []Comment{}

	err = DB.Select(&comments, sql, busParameter)

	if err != nil {
		fmt.Println("Error on query: ", err)
		return
	}

	commentsJson, err := json.Marshal(comments)

	if err != nil {
		fmt.Println("Error marshaling: ", err)
		return
	}

	fmt.Fprintf(w, string(commentsJson))
}

type handler func(w http.ResponseWriter, r *http.Request)

func BasicAuth(pass handler) handler {

	return func(w http.ResponseWriter, r *http.Request) {

		auth := strings.SplitN(r.Header.Get("Authorization"), " ", 2)

		if len(auth) != 2 || auth[0] != "Basic" {
			http.Error(w, "authorization failed", http.StatusUnauthorized)
			return
		}

		payload, _ := base64.StdEncoding.DecodeString(auth[1])
		pair := strings.SplitN(string(payload), ":", 2)

		if len(pair) != 2 || !validate(pair[0], pair[1]) {
			http.Error(w, "authorization failed", http.StatusUnauthorized)
			return
		}

		pass(w, r)
	}
}

func validate(username, password string) bool {

	rawsql, err := ioutil.ReadFile("./sql/auth.sql")

	if err != nil {
		fmt.Println(err)
		return false
	}

	passengers, err := DB.Queryx(string(rawsql), username, password)

	if err != nil {
		fmt.Println(err)
		return false
	}

	var p Passenger

	for passengers.Next() {
		passengers.StructScan(&p)
	}

	if len(p.Username) != 0 {
		return true
	}

	return false
}

func OpenConnection(info DbInfo) (err error) {

	var port = 0

	port, err = strconv.Atoi(info.Port)
	var SQLInfo = fmt.Sprintf(
		"host=%s port=%d user=%s "+
			"password=%s dbname=%s sslmode=disable",
		info.Host, port, info.Username, info.Password, info.Name)

	fmt.Println(SQLInfo)

	DB, err = sqlx.Open("postgres", SQLInfo)

	if err != nil {
		fmt.Println("(", info.Name, ") error connecting to the server")
		return
	}

	err = DB.Ping()

	if err != nil {
		fmt.Println("(", info.Name, ") ping error")
	} else {
		fmt.Println("Conected to the database: ", info.Name)
	}

	return
}
